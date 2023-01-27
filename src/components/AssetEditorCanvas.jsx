import { useEffect, useState } from "react";
import { fabric } from "fabric";

import "../App.css"

var keyPressed;
var colorList = {
    red: ["#d90166", "#9c004a", "#840000", "#b4262a", "#4a0100"],
    green: ["#96d117", "#529c16", "#6a9c41", "#71d61e", "#1d9117"],
    blue: ["#1a9c80", "#0ee3b5", "#0b8a6e", "#0f7b85", "#13c3d4"],
    grey: ["#999999", "#636363", "#2e2e2e", "#000000"]
} 

function getDarkColor(ind) {
    return colorList["blue"][ind % 5]
}

fabric.util.addListener(document.body, "keydown", function (options) {
    if (options.repeat) {
        return;
    }
    keyPressed = options.which || options.keyCode; 
});

function AssetEditorCanvas(props) { 

    const assetImagePath = props.assetImagePath;
    const assetOptions = props.assetOptions;
    const assetData = props.assetData;
    const canvasOptions = props.canvasOptions;

    const labelGap = 20;

    const [canvas, setCanvas] = useState(null);  
    const [labels, setLabels] = useState(null);  

    useEffect(() => {
        console.log("init");
        function initCanvas() {
            let c = new fabric.Canvas("overlay", {
                height: canvasOptions.height,
                width: canvasOptions.width,
                containerClass: "overlayCanvas",
                selection: false,
                uniScaleTransform: true,
                preserveObjectStacking: true,
                altSelectionKey: true
            })
            c.setBackgroundColor(null, c.renderAll.bind(c));
            return c;
        }
        if(canvas === null) {
            setCanvas(initCanvas());
        } 
        setLabels(assetData);

    }, [assetData]);  
    
    useEffect(() => {
        if(canvas && labels) {
            canvas.clear();
            canvas.remove();
            rl(labels);
        }
    }, [labels])


    useEffect(() => {
        if(canvas && labels) {
            canvas.on("mouse:down", function(options) {
                let selectedLabel;
                if(options.target) {
                    if(keyPressed === 16) {
                        let toBeDeletedLabel;
                        const rectTarget = canvas.getActiveObject()._objects[0];
                        labels.forEach((ele) => {
                            if(ele.id === rectTarget.id) {
                                toBeDeletedLabel = ele;  
                            }
                        });
                        labelDelete(toBeDeletedLabel)   
                    }
                    const rectTarget = options.target._objects[0];
                    if (rectTarget) {
                        labels.forEach((ele) => {
                            if(ele.id === rectTarget.id) {
                                selectedLabel = ele;  
                            }
                        });
                        labelClick(selectedLabel);
                        selectedLabel = null;
                    } else {
                        labelClick(null);
                    }
                } else {
                    labelClick(null);
                }
                canvas.on("mouse:up")
            });
            
            canvas.on("mouse:up", function(options){
                if(options.target) {
                    return;
                } else {
                    if(keyPressed == 17) {
                        const x = Math.round(options.pointer.x);
                        const y = Math.round(options.pointer.y);
                      
                        labelCreate({
                            left: Math.round(x),
                            top: Math.round(y),
                            width: 300,
                            height: 300,
                            type: "div"
                        })
                    }
                }
            });
        }
    }, [canvas, assetData])

    function labelDelete(l) {
        props.onLabelDelete(l);
        keyPressed = null;
    }

    function labelClick(l) {
        props.onLabelClick(l);
    }

    function labelCreate(values) {
        const id = Math.floor(Math.random() * 10000);
        props.onLabelCreate(id, values);
        keyPressed = null;
    }

    function labelModified(id, new_values) {
        props.onLabelEdit(id, new_values)
    }

    function rl(l) {
        canvas.clear();
        canvas.remove();
        for(let i=0; i<l.length; i++) {
            const ele = l[i];
            const rect = new fabric.Rect({
                id: ele["id"],
                left: ele["coordinates"][0],
                top: ele["coordinates"][1],
                fill: "rgba(0,0,0,0.05)",
                width: ele["coordinates"][2],
                height: ele["coordinates"][3],
                stroke: getDarkColor(i),
                strokeWidth: 4,
                selectable: true,
                transparentCorners: false
            });
        
            const text = new fabric.Textbox(ele["type"], {
                left: rect.left + labelGap,
                top: rect.top + labelGap,
                fontFamily: "Inconsolata",
                fontSize: 20,
                selectable: true,
                editable: true
            });
    
            const group = new fabric.Group([rect, text], {
                selectable: true
            });


            canvas.add(group);
            group.setCoords();
            canvas.renderAll();

            // TODO
            // group.on("scaling", function(e) {
            //     // const t = e.transform.target;
            //     console.log("rect resizing ...");
            //     // labelResize(t.id, {
            //     //     left: Math.round(t.left),
            //     //     top: Math.round(t.top),
            //     //     width: Math.round(t.width * t.scaleX),
            //     //     height: Math.round(t.height * t.scaleY),
            //     // });
            // })
    
            group.on("modified", function(e) {
                let t = e.transform.target;
                const rectTarget = t._objects[0];
                labelModified(rectTarget.id, {
                    left: t.left,
                    top: t.top,
                    width: t.width * t.scaleX,
                    height: t.height * t.scaleY,
                });
            });
        }
    }


    return (
        <div className="assetEditorCanvas">
            <canvas 
                id="overlay"
                className="overlayCanvas"
            />
            <img src={assetImagePath} alt="" className="assetImage" width={assetOptions.width} height={assetOptions.height}/>
        </div>
    )
}

  export default AssetEditorCanvas;
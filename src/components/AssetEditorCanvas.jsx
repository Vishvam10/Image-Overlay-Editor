import { useEffect, useState } from "react";
import { fabric } from "fabric";

import "../App.css"

var keyPressed;

function getDarkColor() {
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}

function getNextID(labels) {
    let res = 0;
    labels.forEach((ele) => {
        if(res < ele.id) {
            res = ele.id;
        }
    });
    return res + 1;
}

fabric.util.addListener(document.body, "keydown", function (options) {
    if (options.repeat) {
        return;
    }
    keyPressed = options.which || options.keyCode; 
    console.log(keyPressed)
});

function AssetEditorCanvas(props) { 

    const assetImagePath = props.assetImagePath;
    const assetOptions = props.assetOptions;
    const assetData = props.assetData;
    const canvasOptions = props.canvasOptions;

    const labelGap = 20;

    const [canvas, setCanvas] = useState("");  
    const [labels, setLabels] = useState("");  

    useEffect(() => {
        console.log("INIT . . .");
        function initCanvas() {
            let c = new fabric.Canvas("overlay", {
                height: canvasOptions.height,
                width: canvasOptions.width,
                containerClass: "overlayCanvas",
                selection: false,
                preserveObjectStacking: true,
                altSelectionKey: true
            })
            c.setBackgroundColor(null, c.renderAll.bind(c));
            return c;
        }

        setCanvas(initCanvas());
        setLabels(assetData);

    }, [assetData]);  
    
    useEffect(() => {
        if(canvas && labels) {
            console.log("READY . . .", labels.length);
            rl(labels);
        }
    }, [labels])


    useEffect(() => {
        if(canvas && labels) {
            canvas.on("mouse:down", function(options) {
                let selectedLabel;
                if(options.target) {
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
                        canvas.on()
                        const x = Math.round(options.pointer.x);
                        const y = Math.round(options.pointer.y);
                      
                        console.log("in up ...", x, y);
                        labelCreate({
                            top: Math.round(x),
                            left: Math.round(y),
                            width: 100,
                            height: 100,
                            type: "division"
                        })
                    }
                }
            });
                
        }
    }, [canvas, assetData])


    function labelClick(l) {
        props.onLabelClick(l);
    }

    function labelCreate(values) {
        console.log("creating ...", values)
        const id = getNextID(labels);
        props.onLabelCreate(id, values);
        keyPressed = null;
    }

    function labelModified(id, new_values) {
        props.onLabelEdit(id, new_values)
    }

    
    function rl(l) {
        canvas.remove();
        for(let i=0; i<l.length; i++) {
            const ele = l[i]
            let rect = new fabric.Rect({
                id: ele["id"],
                left: ele["coordinates"][0],
                top: ele["coordinates"][1],
                fill: "rgba(255,0,0,0.1)",
                width: ele["coordinates"][2],
                height: ele["coordinates"][3],
                stroke: getDarkColor(),
                strokeWidth: 4,
                selectable: true,
                transparentCorners: false
            });
        
            let text = new fabric.Textbox(ele["type"], {
                left: rect.left + labelGap,
                top: rect.top + labelGap,
                fontFamily: "Inconsolata",
                fontSize: 20,
                editable: true
            });
    
            let group = new fabric.Group([rect,text]);
            canvas.add(group);
            group.addWithUpdate();
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
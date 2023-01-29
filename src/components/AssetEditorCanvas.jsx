import { useEffect, useState } from "react";
import { fabric } from "fabric";

import "../App.css"

var keyPressed, keyPressedOptions;
var mouseX, mouseY;

var colorList = {
    red: ["#d90166", "#9c004a", "#840000", "#b4262a", "#4a0100"],
    green: ["#96d117", "#529c16", "#6a9c41", "#71d61e", "#1d9117"],
    blue: ["#1a9c80", "#0ee3b5", "#0b8a6e", "#0f7b85", "#13c3d4"],
    grey: ["#999999", "#636363", "#2e2e2e", "#000000"]
} 

function getDarkColor(ind) {
    return colorList["blue"][ind % 5]
}

function getLabelByCoordinates(l, mx, my) {
    if(l) {
        let min_diff = 100000;
        let min_ind = -1;
        for(let i=0; i<l.length; i++) {
            const ele = l[i];
            const [x, y, w, h] = ele["coordinates"];
            if(
                (mx >= x) && (mx <= x+w) && 
                (my >= y) && (my <= my+h)
            ) {
                let diff = Math.min(
                        Math.abs(mx - x), 
                        Math.abs(mx - (x + w)), 
                        Math.abs(my - y), 
                        Math.abs(my - (y + h)
                    )
                );
                if(diff < min_diff) {
                    min_diff = diff;
                    min_ind = i;
                }
            }
        }
        console.log("Label index : ", min_ind, l[min_ind])
        if(min_ind != -1) {
            return l[min_ind];
        }
    }
}

function AssetEditorCanvas(props) { 

    const assetImagePath = props.assetImagePath;
    const assetOptions = props.assetOptions;
    const assetData = props.assetData;
    const currentLabel = props.currentLabel;
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
                fireRightClick: true,
                stopContextMenu: true,
                selection: false,
                uniScaleTransform: true,
                preserveObjectStacking: true,
                altSelectionKey: true,
                renderOnAddRemove: false
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
            console.log("labels length : ", labels.length);
            rl(labels);
                
            // if(keyPressed === 16) {
            //     // Delete label : Shift + Left Click 
            //     handleOnLabelDelete(options);  
            // } else if(keyPressed == 17) {
            //     // Create label : Ctrl + Left Click 
            //     handleOnLabelCreate(options)
            // } else {
            //     // Read Label : Left Click 
            //     handleOnLabelClick(options);
            // }

            canvas.on("mouse:down", (options) => {
                if(options.button === 1) {
                    handleOnLabelClick(options);
                }
            })

            canvas.on("mouse:move", (options) => {
                var pointer = canvas.getPointer(options.e);
                mouseX = Math.round(pointer.x);
                mouseY = Math.round(pointer.y);
            })
    

            // console.log('rerender', labels.length);
        }
    }, [labels])

    useEffect(() => {
        
        fabric.util.addListener(document.body, "keydown", function (options) {
            if (options.repeat) {
                return;
            }
            keyPressed = options.which || options.keyCode; 
            keyPressedOptions = options;

            if((options.key === "c") && (options.keyCode === 67)) {
                console.log("create ... ", mouseX, mouseY);
                handleOnLabelCreate(mouseX, mouseY);
                keyPressed = null;
            } else if((options.key === "d") && (options.keyCode === 68)) {
                console.log("delete ... ", mouseX, mouseY);
                const l = getLabelByCoordinates(labels, mouseX, mouseY);
                handleOnLabelDelete(l);
                keyPressed = null;
            }
        });

    }, [labels])


    function handleOnLabelCreate(x, y) {
        labelCreate({
            left: Math.round(x),
            top: Math.round(y),
            width: 300,
            height: 300,
            type: "div"
        });
        return;
    }

    function handleOnLabelDelete(l) {
        if(l) {
            labelDelete(l);
        }
        return;
    }
    
    function handleOnLabelClick(options) {
        let selectedLabel;
        if(options.target) {
            const rectTarget = options.target._objects[0];
            if (rectTarget) {
                // console.log("debug ... ", labels.length)
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
        return;   

    }

    function labelDelete(l) {
        console.log("label delete ... ", l);
        if(l) {
            props.onLabelDelete(l);
        }
        keyPressed = null;
    }

    function labelClick(l) {
        // console.log("click ... ", l);
        props.onLabelClick(l);
        return;
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
        // console.log("in canvas ... ", l.length, l)
        canvas.clear();
        canvas.remove();
        for(let i=0; i<l.length; i++) {
            const ele = l[i];
            const rect = new fabric.Rect({
                id: ele["id"],
                left: ele["coordinates"][0],
                top: ele["coordinates"][1],
                fill: "rgba(0,0,0,0)",
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
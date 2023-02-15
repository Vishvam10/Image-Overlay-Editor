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
    return colorList["red"][ind % 5]
}

function getLabelByID(labels, id) {
    let l;
    labels.forEach((ele) => {
        if(ele["id"] === id) {
            l = ele;
            return;
        }
    });
    return l;
}

function getParents(labels, id, text) {
    const label = getLabelByID(labels, id);
    if(label["parent"] != null) {
        text += (">" + label["type"])
        return getParents(labels, label["parent"], text)
    } 
    return text;
}

function AssetEditorCanvas(props) { 

    const assetImagePath = props.assetImagePath;
    const assetOptions = props.assetOptions;
    const assetData = props.assetData.current;
    const canvasOptions = props.canvasOptions;

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
                uniScaleTransform: false,
                preserveObjectStacking: true,
                altSelectionKey: true,
                renderOnAddRemove: false
                // perPixelTargetFind: true  
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

            canvas.on("mouse:move", (options) => {
                var pointer = canvas.getPointer(options.e);
                mouseX = Math.round(pointer.x);
                mouseY = Math.round(pointer.y);
            })

            canvas.on("mouse:down", (options) => {
                if(!options.target) {
                    labelClick(null);
                }
            })
        }
    }, [labels, assetImagePath])

    useEffect(() => {
        const canv = document.getElementsByTagName("canvas")[1];
        canv.tabIndex = 1000;
        if(canv) {
            fabric.util.addListener(canv, "keydown", function (options) {
                if (options.repeat) {
                    return;
                }
                keyPressed = options.which || options.keyCode; 
                keyPressedOptions = options;
    
                if(canvas) {
                    if((options.key === "c") && (options.keyCode === 67)) {
                        handleOnLabelCreate(mouseX, mouseY);
                        keyPressed = null;
                    } else if((options.key === "d") && (options.keyCode === 68)) {
                        const l = canvas.getActiveObject();
                        if(l) {
                            const rect = l._objects[0]["id"]
                            handleOnLabelDelete(rect);
                        }
                        keyPressed = null;
                    }
                }
            });
        }

    },[canvas])


    function handleOnLabelCreate(x, y) {
        const id = Math.floor(Math.random() * 10000);
        const l = {
            id: id,
            coordinates: [
                Math.round(x),
                Math.round(y),
                50,
                50,
            ],
            type: "div",
            parent: null
        }
        labelCreate(l)
        keyPressed = null;
        return;
    }

    function handleOnLabelDelete(id) {
        if(id) {
            labelDelete(id);
        }
        return;
    }

    function labelDelete(l) {
        if(l) {
            props.onLabelDelete(l);
        }
        keyPressed = null;
    }

    function labelClick(id) {
        props.onLabelClick(id);
        return;
    }

    function labelCreate(l) {
        props.onLabelCreate(l);
        keyPressed = null;
    }

    function labelModified(id, new_values) {
        props.onLabelEdit(id, new_values)
    }

    function rl(l) {
        canvas.clear();
        canvas.remove();
        if(assetImagePath) {
            for(let i=0; i<l.length; i++) {
                const ele = l[i];
                let text = ele["type"];
                if(ele["parent"]) {
                    text = ele["parent"] + " > " + text;
                }
                const color = getDarkColor(i);

                const rect = new fabric.Rect({
                    id: ele["id"],
                    left: ele["coordinates"][0],
                    top: ele["coordinates"][1],
                    fill: "rgba(0,0,0,0)",
                    width: ele["coordinates"][2] - 2,
                    height: ele["coordinates"][3],
                    stroke: color,
                    strokeWidth: 2,
                    strokeUniform: true,
                    selectable: false,
                    noScaleCache: true,
                    hasRotatingPoint: false,
                    transparentCorners: false,
                });
                const textBox = new fabric.Textbox(text, {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: 10,
                    fontFamily: "monospace",
                    backgroundColor: color,
                    fill: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    hasBorders: false,
                    hasControls: false,
                });
                const group = new fabric.Group([rect, textBox], {
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    lockScalingFlip: true,
                    hasControls: true,
                    hasRotatingPoint: false,
                    transparentCorners: false,
                    selectable: true,
                    cornerSize: 8,
                    objectCaching: false,
                });
                
                canvas.add(group);
                canvas.renderAll()

                group.on('scaling', function () {
                    if (this.scaleX < 1) {
                      this._objects[1].scaleX = 1 + (1 - this.scaleX)
                    }
                    else {
                        this._objects[1].scaleX = 1 / (this.scaleX)
                    }
                    if (this.scaleY < 1) {
                        this._objects[1].scaleY = 1 + (1 - this.scaleY)
                    }
                    else {
                        this._objects[1].scaleY = 1 / (this.scaleY)
                    }
                })
    
                group.on("mouseup", function(e) {
                    if(e.transform) {
                        const id = e.transform.target._objects[0]["id"];
                        labelClick(id);
                    }
                })
        
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
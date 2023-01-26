import { useEffect, useState } from "react";
import { fabric } from 'fabric';

import "../App.css"

function getDarkColor() {
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}

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
                selection: true,
                preserveObjectStacking: true,
                altSelectionKey: true
            })
            c.setBackgroundColor(null, c.renderAll.bind(c));
            return c;
        }

        setCanvas(initCanvas());
        setLabels(assetData);

    }, [assetImagePath]);  
    
    useEffect(() => {
        if(canvas && labels) {
            console.log("READY . . .");
            rl();
        }
    }, [canvas])

    function labelClick(l) {
        props.onLabelClick(l);
    }

    // function labelResize(id, new_values) {
    //     props.onLabelResize(id, new_values);
    // }

    function labelModified(id, new_values) {
        // console.log("in edit...", new_values);
        props.onLabelEdit(id, new_values)
    }

    useEffect(() => {
        if(canvas && labels) {
            canvas.on('mouse:down', function(options) {
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
            });
            
            // function enableSelection() {
            //     removeEvents();
            //     changeObjectSelection(true);
            //     canvas.selection = true;
            // }
            
            // function changeObjectSelection(value) {
            // canvas.forEachObject(function (obj) {
            //     obj.selectable = value;
            // });
            // canvas.renderAll();
            // }
            
            // function removeEvents() {
            // canvas.isDrawingMode = false;
            // canvas.selection = false;
            // canvas.off('mouse:down');
            // canvas.off('mouse:up');
            // canvas.off('mouse:move');
            // }

            // var rect, isDown, origX, origY;
            // var Name = "This is a rectangle";
            // removeEvents();
            // changeObjectSelection(false);

            // canvas.on('mouse:down', function(o) {
            //     isDown = true;
            //     var pointer = canvas.getPointer(o.e);
            //     origX = pointer.x;
            //     origY = pointer.y;
            //     var pointer = canvas.getPointer(o.e);
            //     rect = new fabric.Rect({
            //     left: origX,
            //     top: origY,
            //     originX: 'left',
            //     originY: 'top',
            //     width: pointer.x - origX,
            //     height: pointer.y - origY,
            //     angle: 0,
            //     selectable:false,
            //     fill: '#07ff11a3',
            //     stroke: 'black',
            //     transparentCorners: false
            //     });
            //     canvas.add(rect);
            // });

            // canvas.on('mouse:move', function(o) {
            //     if (!isDown) return;
            //     var pointer = canvas.getPointer(o.e);

            //     if (origX > pointer.x) {
            //     rect.set({
            //         left: Math.abs(pointer.x)
            //     });
            //     }
            //     if (origY > pointer.y) {
            //     rect.set({
            //         top: Math.abs(pointer.y)
            //     });
            //     }

            //     rect.set({
            //     width: Math.abs(origX - pointer.x)
            //     });
            //     rect.set({
            //     height: Math.abs(origY - pointer.y)
            //     });


            //     canvas.renderAll();
            // });
            
            // canvas.on('mouse:up', function(o) {
                // console.log("up ...")
                // rect.setCoords();
                // var text = new fabric.Text(Name,{
                // left:rect.left,
                // top:rect.top,
                // fontSize: 20
                // });
                // var group = new fabric.Group([rect,text]);
                // canvas.remove(rect);
                // canvas.add(group);
                // group.addWithUpdate();
                // enableSelection();
            // });
          
        }
    })

    function rl() {
        // console.log("IN RL : ", labels);
        labels.forEach((ele) => {
            let rect = new fabric.Rect({
                id: ele["id"],
                left: ele["coordinates"][0],
                top: ele["coordinates"][1],
                fill: "rgba(0,0,0,0.1)",
                width: ele["coordinates"][2],
                height: ele["coordinates"][3],
                stroke: getDarkColor(),
                strokeWidth: 4,
                selectable: true,
                transparentCorners: false
            });
            let text = new fabric.Text(ele["type"], {
                left: rect.left + labelGap,
                top: rect.top + labelGap,
                fontFamily: "Inconsolata",
                fontSize: 20,
            });
            canvas.add(rect);
            let group = new fabric.Group([rect,text]);
            canvas.add(group);
            canvas.remove(rect);
            group.addWithUpdate();

            // TODO
            group.on("scaling", function(e) {
                // const t = e.transform.target;
                console.log("rect resizing ...");
                // labelResize(t.id, {
                //     left: Math.round(t.left),
                //     top: Math.round(t.top),
                //     width: Math.round(t.width * t.scaleX),
                //     height: Math.round(t.height * t.scaleY),
                // });
            })

            group.on("modified", function(e) {
                let t = e.transform.target;
                const rectTarget = t._objects[0];
                console.log("modified ... ", t, rectTarget.id);
                labelModified(rectTarget.id, {
                    left: t.left,
                    top: t.top,
                    width: t.width * t.scaleX,
                    height: t.height * t.scaleY,
                });
            });
            // canvas.renderAll();
        });
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
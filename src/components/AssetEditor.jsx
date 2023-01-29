import AssetEditorCanvas from './AssetEditorCanvas';
import AssetEditorLabelInformation from "./AssetEditorLabelInformation"


import '../App.css';
import { useState } from 'react';

function getLabelByID(labels, id) {
  let l;
  labels.forEach((ele) => {
    if(ele["id"] === id) {
      l = ele;
    }
  });
  return l;
}

function isValidLabel(labels, id) {
  labels.forEach((ele) => {
    if(ele["id"] === id) {
      return false;
    }
  });

  return true;
}

function inverseScaleAssetData(data, scaleX, scaleY) {
  data.forEach((ele) => {
    ele["coordinates"][0] = Math.round(ele["coordinates"][0] / scaleX);
    ele["coordinates"][1] = Math.round(ele["coordinates"][1] / scaleY);
    ele["coordinates"][2] = Math.round(ele["coordinates"][2] / scaleX);
    ele["coordinates"][3] = Math.round(ele["coordinates"][3] / scaleY);
  }); 
  return data;
}

function AssetEditor(props) {

    let assetImagePath = props.assetPath;
    let [flattenedAssetData, setFlattenedAssetData] = useState(props.assetData);
    
    const [currentLabel, setCurrentLabel] = useState();

    let canvasOptions = props.canvasOptions;
    let assetOptions = props.assetOptions;

    function handleOnLabelClick(l) {
      setCurrentLabel(l); 
    }

    function handleLabelOnEdit(id, new_values) {
      const label = getLabelByID(flattenedAssetData, id);
      if(label) {
        label["coordinates"] = [
          Math.round(new_values["left"]), 
          Math.round(new_values["top"]), 
          Math.round(new_values["width"]), 
          Math.round(new_values["height"])
        ]
        setCurrentLabel(label);
      }
      return;
    }

    function handleLabelOnDelete(label) {
      if(label) {
        setFlattenedAssetData(function(prev) {
          return prev.filter(ele => ele["id"] != label["id"]);
        });
      }

    }
    
    function handleLabelOnResize(id, new_values) {
      // const label = getLabelByID(flattenedAssetData, id);
      // currentLabel["coordinates"] = [
      //   Math.round(new_values["left"]), 
      //   Math.round(new_values["top"]), 
      //   Math.round(new_values["width"]), 
      //   Math.round(new_values["height"])
      // ]
      // setCurrentLabel(label);
      // let curLabel = {...currentLabel}
      // someProperty.flag = true;
      // this.setState({someProperty})
      // setCurrentLabel(label);
      // console.log("resizing... : ", id);
      return;
    }
    
    function handleSaveAndExit() {
      /*
          TODO : 1. Create a JSON structure from list and return it
      */

     const d = inverseScaleAssetData(JSON.parse(JSON.stringify(flattenedAssetData)), assetOptions.scaleX, assetOptions.scaleY);

     props.onSave(d);

    }

    function handleOnLabelCreate(id, new_label) {
      
      /*
      TODO : 1. Check if the label is valid
             2. Assign parent to the label 
      */

      if(isValidLabel(flattenedAssetData, id)) {
        console.log("valid : ", isValidLabel(flattenedAssetData, id))
        const temp = {
          id: id,
          coordinates: [
            new_label["left"],
            new_label["top"],
            new_label["width"],
            new_label["height"],
          ],
          type: new_label["type"],

        }

        setFlattenedAssetData(function(prev) {
          // console.log("prev : ", prev)
          return [...prev, temp];
        });
      }
    }

    function handleLabelTypeChange(id, new_type) {
      const temp = JSON.parse(JSON.stringify(flattenedAssetData));
      temp.forEach((ele) => {
        if(ele["id"] === id) {
          ele["type"] = new_type;
        }
      });
      setFlattenedAssetData(temp);
    }

    // console.log("in asset editor ...", flattenedAssetData.length)

    return (
       <div className="assetEditor">
            <AssetEditorLabelInformation 
              labelData={currentLabel}
              onLabelTypeChange={handleLabelTypeChange}
              onSaveAndExit={handleSaveAndExit}
            />
            <AssetEditorCanvas 
              canvasOptions={canvasOptions}
              assetImagePath={assetImagePath} 
              assetOptions={assetOptions}
              assetData={flattenedAssetData}
              onLabelClick={handleOnLabelClick}
              onLabelEdit={handleLabelOnEdit}
              onLabelCreate={handleOnLabelCreate}
              onLabelDelete={handleLabelOnDelete}
              onLabelResize={handleLabelOnResize}
            />

       </div>
    )


}

export default AssetEditor;
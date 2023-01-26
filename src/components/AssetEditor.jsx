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

function AssetEditor(props) {

    let assetImagePath = props.assetPath;
    let flattenedAssetData = props.assetData;
    
    const [currentLabel, setCurrentLabel] = useState();

    let canvasOptions = props.canvasOptions;
    let assetOptions = props.assetOptions;

    function handleOnLabelClick(l) {
      setCurrentLabel(l); 
    }

    function handleLabelOnEdit(id, new_values) {
      const label = getLabelByID(flattenedAssetData, id);
      label["coordinates"] = [
        Math.round(new_values["left"]), 
        Math.round(new_values["top"]), 
        Math.round(new_values["width"]), 
        Math.round(new_values["height"])
      ]
      console.log("edited ...", id, new_values);
      setCurrentLabel(label);
      return;
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
     return
    }

    function handleOnLabelCreate(new_label) {
      
      /*
      TODO : 1. Check if the label is valid
             2. Assign parent to the label 
      */
     
     console.log("REACHED 1", flattenedAssetData.length, new_label)
     flattenedAssetData.push(new_label)
     console.log("REACHED 2", flattenedAssetData.length)
    }

    console.log("scaled flattened assets : ", flattenedAssetData)

    return (
       <div className="assetEditor">
            <AssetEditorLabelInformation 
              labelData={currentLabel}
              onSaveAndExit={handleSaveAndExit}
            />
            <AssetEditorCanvas 
              assetImagePath={assetImagePath} 
              assetOptions={assetOptions}
              assetData={flattenedAssetData}
              currentLabel={currentLabel}
              canvasOptions={canvasOptions}
              onLabelClick={handleOnLabelClick}
              onLabelEdit={handleLabelOnEdit}
              onLabelCreated={handleOnLabelCreate}
              onLabelResize={handleLabelOnResize}
            />

       </div>
    )


}

  export default AssetEditor;
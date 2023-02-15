import { useEffect, useRef, useState } from "react";
import AssetEditorCanvas from "./AssetEditorCanvas";
import AssetEditorLabelInformation from "./AssetEditorLabelInformation";
import AssetEditorControls from "./AssetEditorControls";

import assignParent from "./../utils/assignParent";

import "../App.css";



function getLabelByID(assetData, id) {
  let l = null;
  assetData.current.forEach((ele) => {
    if (ele["id"] === id) {
      l = ele;
    }
  });
  return l;
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

  const assetData = useRef(props.assetData);
  const [currentLabel, setCurrentLabel] = useState();

  useEffect(() => {
    assetData.current = props.assetData;
  }, [props.assetData])

  useEffect(() => {
  }, [assetImagePath]);

  let canvasOptions = props.canvasOptions;
  let assetOptions = props.assetOptions;

  function handleOnLabelClick(id) {
    const label = getLabelByID(assetData, id);
    setCurrentLabel(label);
    return;
  }

  function handleLabelOnEdit(id, new_values) {
    const temp = JSON.parse(JSON.stringify(assetData.current));
    let label;
    for(let ele of temp) {
      if(ele["id"] === id) {
        ele["coordinates"] = [
          Math.round(new_values["left"]),
          Math.round(new_values["top"]),
          Math.round(new_values["width"]),
          Math.round(new_values["height"]),
        ];
        label = ele;
        break;
      }
    }
    temp.forEach((ele) => {
      assignParent(assetData.current, ele)
    })
    assetData.current = temp;
    setCurrentLabel(label);
    return;
  }
  
  function handleLabelOnDelete(id) {
    if (id) {
      const temp = assetData.current.filter((ele) => ele["id"] != id);
      temp.forEach((ele) => {
        assignParent(temp, ele, "deleted")
      })
      assetData.current = temp;
    }
  }

  function handleFileUpload(dataURL, mlOutput) {
    props.onFileUpload(dataURL, mlOutput);
  }

  function handleOnLabelCreate(new_label) {
    if(new_label) {
      const temp = [...assetData.current, new_label];
      temp.forEach((ele) => {
        assignParent(assetData.current, ele)
      })
      assetData.current = temp;
      setCurrentLabel(new_label);
    }
    return;
  }

  function handleLabelTypeChange(id, new_type) {
    const temp = JSON.parse(JSON.stringify(assetData.current));
    temp.forEach((ele) => {
      if (ele["id"] === id) {
        ele["type"] = new_type;
      }
    });
    assetData.current = temp;
  }

  function handleExportJSON() {

    const d = inverseScaleAssetData(
      JSON.parse(JSON.stringify(assetData.current)),
      assetOptions.scaleX,
      assetOptions.scaleY
    );

    const JSONData = {
      "containers" : d
    }
    props.onExportJSON(JSON.stringify(JSONData));
  }

  function handleExportYOLO() {
    const d = inverseScaleAssetData(
      JSON.parse(JSON.stringify(assetData)),
      assetOptions.scaleX,
      assetOptions.scaleY
    );

    let types = {}
    let data = []
    let count = 0
    d.forEach((ele) => {
      if(!types[ele["type"]]) {
        types[ele["type"]] = count;
        count += 1
      } 
      const [x, y, w, h] = ele["coordinates"];
      data.push([types[ele["type"]], x, y, w, h]);
    });
    
    props.onExportYOLO(data, types);
  }

  return (
    <div className="assetEditor">
      <div className="assetSidePanel">
        <div className="row">
          <AssetEditorLabelInformation
            labelData={currentLabel}
            onLabelTypeChange={handleLabelTypeChange}
          />
        </div>
        <div className="row">
          <AssetEditorControls 
            onExportJSON={handleExportJSON}
            onExportYOLO={handleExportYOLO}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
      <AssetEditorCanvas
        canvasOptions={canvasOptions}
        assetImagePath={assetImagePath}
        assetOptions={assetOptions}
        assetData={assetData}
        onLabelClick={handleOnLabelClick}
        onLabelEdit={handleLabelOnEdit}
        onLabelCreate={handleOnLabelCreate}
        onLabelDelete={handleLabelOnDelete}
      />
    </div>
  );
}

export default AssetEditor;

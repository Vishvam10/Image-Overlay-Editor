import { useEffect, useState } from "react";
import AssetEditorCanvas from "./AssetEditorCanvas";
import AssetEditorLabelInformation from "./AssetEditorLabelInformation";
import AssetEditorControls from "./AssetEditorControls";

import "../App.css";

function getLabelByID(labels, id) {
  let l;
  labels.forEach((ele) => {
    if (ele["id"] === id) {
      l = ele;
    }
  });
  return l;
}

function isValidLabel(labels, id) {
  labels.forEach((ele) => {
    if (ele["id"] === id) {
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

  const [assetData, setAssetData] = useState([]);
  const [currentLabel, setCurrentLabel] = useState();

  useEffect(() => {
    setAssetData(props.assetData);
  }, [props.assetData])

  useEffect(() => {
  }, [assetImagePath]);

  let canvasOptions = props.canvasOptions;
  let assetOptions = props.assetOptions;

  function assignParent(new_label) {
    const [xl, yl, wl, hl] = new_label["coordinates"];

    let min_x_diff_1 = 1000000;
    let min_x_diff_2 = 1000000; 

    let min_x_diff_3 = 1000000; 
    let min_x_diff_4 = 1000000; 

    let min_y_diff_1 = 1000000; 
    let min_y_diff_2 = 1000000; 

    let min_y_diff_3 = 1000000; 
    let min_y_diff_4 = 1000000; 

    assetData.forEach((ele) => {
      const [xc, yc, wc, hc] = ele["coordinates"];

      const x_diff_1 = xl - xc;
      const x_diff_2 = xl - xc - wc;

      const x_diff_3 = xl + wl - xc;
      const x_diff_4 = xl + wl - xc - wc;

      const y_diff_1 = yl - yc;
      const y_diff_2 = yl - yc - hc;

      const y_diff_3 = yl + hl - yc;
      const y_diff_4 = yl + hl - yc - hc;

      let temp = 0;

      if (
        x_diff_1 >= 0 &&
        x_diff_2 <= 0 &&
        y_diff_1 >= 0 &&
        y_diff_2 <= 0 &&
        x_diff_3 >= 0 &&
        x_diff_4 <= 0 &&
        y_diff_1 >= 0 &&
        y_diff_2 <= 0 &&
        x_diff_3 >= 0 &&
        x_diff_4 <= 0 &&
        y_diff_3 >= 0 &&
        y_diff_4 <= 0 &&
        x_diff_1 >= 0 &&
        x_diff_2 <= 0 &&
        y_diff_3 >= 0 &&
        y_diff_4 <= 0
      ) {
        new_label["parent"] = ele["id"]

        if(x_diff_1 < min_x_diff_1) {
          min_x_diff_1 = x_diff_1;
          temp += 1
        }
        if(x_diff_2 < min_x_diff_2) {
          min_x_diff_2 = x_diff_2;
          temp += 1
        }

        if(x_diff_3 < min_x_diff_3) {
          min_x_diff_3 = x_diff_3;
          temp += 1
        }
        if(x_diff_4 < min_x_diff_4) {
          min_x_diff_4 = x_diff_4;
          temp += 1
        }

        if(y_diff_1 < min_y_diff_1) {
          min_y_diff_1 = y_diff_1;
          temp += 1
        }
        if(y_diff_2 < min_y_diff_2) {
          min_y_diff_2 = y_diff_2;
          temp += 1
        }

        if(y_diff_3 < min_y_diff_3) {
          min_y_diff_3 = y_diff_3;
          temp += 1
        }

        if(y_diff_4 < min_y_diff_4) {
          min_y_diff_4 = y_diff_4;
          temp += 1
        }

        if(temp == 8) {
          new_label["parent"] = ele["id"]
        }
      }

    
    });
  }

  function handleOnLabelClick(id) {
    const label = getLabelByID(assetData, id);
    if (label) {
      setCurrentLabel(label);
    } else {
      setCurrentLabel(null);
    }
    return;
  }

  function handleLabelOnEdit(id, new_values) {
    const label = getLabelByID(assetData, id);
    if (label) {
      label["coordinates"] = [
        Math.round(new_values["left"]),
        Math.round(new_values["top"]),
        Math.round(new_values["width"]),
        Math.round(new_values["height"]),
      ];
      setCurrentLabel(label);
    }
    return;
  }

  function handleLabelOnDelete(id) {
    if (id) {
      setAssetData(function (prev) {
        return prev.filter((ele) => ele["id"] != id);
      });
    }
  }

  function handleLabelOnResize(id, new_values) {
    // const label = getLabelByID(assetData, id);
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

  function handleFileUpload(dataURL, mlOutput) {
    props.onFileUpload(dataURL, mlOutput);
  }

  function handleExportJSON() {
    /*
          TODO : 1. Create a JSON structure from list and return it
      */

    const d = inverseScaleAssetData(
      JSON.parse(JSON.stringify(assetData)),
      assetOptions.scaleX,
      assetOptions.scaleY
    );

    props.onExportJSON(d);
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

  function handleOnLabelCreate(new_label) {
    if (new_label) {
      if (isValidLabel(assetData, new_label["id"])) {
        assignParent(new_label);
        setAssetData(function (prev) {
          return [...prev, new_label];
        });
      }
    }
    const temp = currentLabel;
    setCurrentLabel(temp);
  }

  function handleLabelTypeChange(id, new_type) {
    const temp = JSON.parse(JSON.stringify(assetData));
    temp.forEach((ele) => {
      if (ele["id"] === id) {
        ele["type"] = new_type;
      }
    });
    setAssetData(temp);
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
        onLabelResize={handleLabelOnResize}
      />
    </div>
  );
}

export default AssetEditor;

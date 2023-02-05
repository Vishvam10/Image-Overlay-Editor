import { useEffect, useReducer, useState } from 'react';

import AssetEditor from './components/AssetEditor';
// import assetImagePath from "./assets/img.png"
import tempAssetData from "./data.json"

import './App.css';

function assignID(labels) {
  if(!labels) {
    return;
  }
  labels.forEach((ele) => {
    ele["id"] = Math.floor(Math.random() * 10000);
    if(ele["children"]) {
      assignID(ele["children"])
    }
  });
  return labels;
}

function assignParent(labels, parent) {
  if(!labels) {
    return;
  }
  labels.forEach((ele) => {
    if(ele["children"]) {
      assignParent(ele["children"], ele["id"])
    } 
    ele["parent"] = parent  
  });
  return labels;
}

function flattenLabels(labels) {
  if(!labels) {
    return;
  }
  return labels.reduce((acc, x) => {
    acc = acc.concat(x);
    if (x["children"]) {
      acc = acc.concat(flattenLabels(x["children"]));
      delete x["children"]
    }
    return acc;
  }, []);
}

function scaleAssetData(labels, scaleX, scaleY) {
  if(!labels) {
    return;
  }
  labels.forEach((ele) => {
    ele["coordinates"][0] = Math.round(ele["coordinates"][0] * scaleX);
    ele["coordinates"][1] = Math.round(ele["coordinates"][1] * scaleY);
    ele["coordinates"][2] = Math.round(ele["coordinates"][2] * scaleX);
    ele["coordinates"][3] = Math.round(ele["coordinates"][3] * scaleY);
  }); 
  return labels;
}

function calculateAspectRatioFit(imgWidth, imgHeight, canvasWidth, canvasHeight) {
  const scaleX = canvasWidth / imgWidth;
  const scaleY = canvasHeight / imgHeight
  // const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
  return { scaleX, scaleY, width: imgWidth*scaleX, height: imgHeight*scaleY };
}


const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function App() {
  
  const [assetURL, setAssetURL] = useState("");
  const [assetData, setAssetData] = useState([]);
  const [assetOptions, setAssetOptions] = useState({});
  
  let canvasOptions = {
    width : 1000,
    height : 600  
  }

  async function getMLOutput() {
    const d = await delay(2000);
    const dummyData = {
      "containers": [
          {
              "coordinates": [
                  12,
                  43,
                  500,
                  22
              ],
              "type": "container"
          },
          {
              "coordinates": [
                  23,
                  123,
                  333,
                  783
              ],
              "type": "container",
              "children": [
                  {
                      "type": "image",
                      "coordinates": [
                          665,
                          989,
                          580,
                          710
                      ]
                  }               
              ]
          },
          {
              "coordinates": [
                  0,
                  400,
                  34,
                  10
              ],
              "type": "container"
          }
      ]
    }
    return dummyData;
  }
  
  async function init(aURL, mlOutput) {    
    let canvasOptions = {
      width : 1000,
      height : 600  
    }
    let img = new Image();
    img.src = aURL;
    
    const imgWidth = img.naturalWidth; 
    const imgHeight = img.naturalWidth; 
    
    img = null;
      
    let sample = document.createElement("img");
    sample.src = aURL;
    sample.height = 200;
    sample.width = 200;
    document.body.appendChild(sample);

    let data;
    let aOptions;
    if(mlOutput) {
      data = await getMLOutput();
      data = data.containers;
      data = assignID(data);
      data = assignParent(data, null)
      data = flattenLabels(data)
      const rd = calculateAspectRatioFit(imgWidth, imgHeight, canvasOptions.width, canvasOptions.height);
      data = scaleAssetData(data, rd.scaleX, rd.scaleY);
        
      aOptions = {
        scaleX: rd.scaleX,
        scaleY: rd.scaleY,
        width: Math.round(rd.width),
        height: Math.round(rd.height)
      }
      // console.log("resized dimensions : ", aOptions)
      
      setAssetData(data);
      setAssetOptions(aOptions);
    } else {
      const rd = calculateAspectRatioFit(imgWidth, imgHeight, canvasOptions.width, canvasOptions.height);
      aOptions = {
        scaleX: rd.scaleX,
        scaleY: rd.scaleY,
        width: Math.round(rd.width),
        height: Math.round(rd.height)
      }
      setAssetOptions(aOptions);
    }
  }

  function exportJSON(data) {
    console.log("*************** JSON ****************")
    console.log(data)
    console.log("**************************************")
  }

  function exportYOLO(data, types) {
    console.log("*************** YOLO ****************")
    console.log("in yolo", data, types)
    console.log("**************************************")
  }

  function handleFileUpload(dataURL, mlOutput) {
    console.log("in app : ", assetOptions); 
    setAssetURL(dataURL);
    init(dataURL, mlOutput);
  }

  return (
    <div className="app">
      <AssetEditor 
        assetPath={assetURL} 
        assetOptions={assetOptions}
        assetData={assetData}
        canvasOptions={canvasOptions}
        onExportJSON={exportJSON}
        onExportYOLO={exportYOLO}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}

export default App;

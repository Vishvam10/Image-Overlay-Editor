import AssetEditor from './components/AssetEditor';
import assetImagePath from "./assets/img.png"
import assetData from "./data.json"


import './App.css';
// import { useState } from 'react';


function assignID(labels) {

  labels.forEach((ele, ind) => {
    ele["id"] = ind
  });

  return labels;

}

function flattenLabels(labels) {
  return labels.reduce((acc, x) => {
    acc = acc.concat(x);
    if (x["children"]) {
      acc = acc.concat(flattenLabels(x["children"]));
      delete x["children"]
    }
    return acc;
  }, []);
}

function scaleAssetData(data, scaleX, scaleY) {
  data.forEach((ele) => {
    ele["coordinates"][0] = Math.round(ele["coordinates"][0] * scaleX);
    ele["coordinates"][1] = Math.round(ele["coordinates"][1] * scaleY);
    ele["coordinates"][2] = Math.round(ele["coordinates"][2] * scaleX);
    ele["coordinates"][3] = Math.round(ele["coordinates"][3] * scaleY);
  }); 
  return data;
}


function calculateAspectRatioFit(imgWidth, imgHeight, canvasWidth, canvasHeight) {
  const scaleX = canvasWidth / imgWidth;
  const scaleY = canvasHeight / imgHeight
  // const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
  return { scaleX, scaleY, width: imgWidth*scaleX, height: imgHeight*scaleY };
}

function App() {
  // const [assetData, setAssetData] = useState(dummyData)
  
  // Will be obtained from a prop
  // console.log("IN APP : ", assetData)
  
  let canvasOptions = {
    width : 1000,
    height : 600  
  }

  let img = new Image();
  img.src = assetImagePath;
  
  const resizedDimensions = calculateAspectRatioFit(img.width, img.height, canvasOptions.width, canvasOptions.height);
  
  let flattenedAssetData = flattenLabels(assetData.containers);
  flattenedAssetData = assignID(flattenedAssetData);
  flattenedAssetData = scaleAssetData(flattenedAssetData, resizedDimensions.scaleX, resizedDimensions.scaleY);
  
  let assetOptions = {
    scaleX: resizedDimensions.scaleX,
    scaleY: resizedDimensions.scaleY,
    width: Math.round(resizedDimensions.width),
    height: Math.round(resizedDimensions.height)
  }
  
  function handleOnUpdate(new_data) {
    assetData = new_data;
  }

  return (
    <div className="app">
      <AssetEditor 
        assetPath={assetImagePath} 
        assetOptions={assetOptions}
        assetData={flattenedAssetData}
        canvasOptions={canvasOptions}
        onUpdate={handleOnUpdate}  
      />
    </div>
  );
}

export default App;

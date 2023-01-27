import AssetEditor from './components/AssetEditor';
import assetImagePath from "./assets/img.png"
import assetData from "./data.json"

import './App.css';


function assignID(labels) {

  labels.forEach((ele) => {
    ele["id"] = Math.floor(Math.random() * 10000);
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

  function handleOnSave(data) {
    console.log("*************** SAVED ****************")
    console.log(data)
    console.log("**************************************")
    alert("Saved ! Check console to see the updated data")
  }

  return (
    <div className="app">
      <AssetEditor 
        assetPath={assetImagePath} 
        assetOptions={assetOptions}
        assetData={flattenedAssetData}
        canvasOptions={canvasOptions}
        onSave={handleOnSave}
      />
    </div>
  );
}

export default App;

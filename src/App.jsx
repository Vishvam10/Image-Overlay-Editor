import { useState } from 'react';

import AssetEditor from './components/AssetEditor';

import './App.css';

function assignID(labels) {
  console.log("labels : ", labels)
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

function groupSimilarLabels(labels) {
  let groupedData = [];
  let mp = {} 
  labels.forEach((ele, ind) => {
    const [x, y, w, h] = ele["coordinates"];
    const s = `x${x}_y${y}_w${w}_h${h}`;
    if(!(s in mp)) {
      if(ele["text"]) {
        mp[s] = ele["text"]
      } else {
        mp[s] = ""
      }
      groupedData.push(ele);
    } else {
      if(ele["text"]) {
        mp[s] = mp[s] + " " + ele["text"]
      }
    }
  });

  for(const key in mp) { 
    let coordinates = key.split("_")
    const [x, y, w, h] = [
      Number(coordinates[0].substring(1)), 
      Number(coordinates[1].substring(1)), 
      Number(coordinates[2].substring(1)), 
      Number(coordinates[3].substring(1))
    ] 

    groupedData.forEach((ele) => {
      if(
        ele["coordinates"][0] == x && 
        ele["coordinates"][1] == y &&
        ele["coordinates"][2] == w &&
        ele["coordinates"][3] == h
      ) {
        ele["text"] = mp[key];
      }
    });
    
  }

  return groupedData;
}

function exportToCSV(filename, rows) {
  var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;'});
  if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { 
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}

function exportToJSON(obj, filename){
  let link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([
      JSON.stringify(obj)
    ]),
    {
      type:"application/json"
    }
  )
  link.download = filename + ".json";
  link.click();
  link.remove();
}

function App() {
  
  const [assetURL, setAssetURL] = useState("");
  const [assetData, setAssetData] = useState([]);
  const [assetOptions, setAssetOptions] = useState({});
  const [loading, setLoading] = useState(false);
  
  let canvasOptions = {
    width : 1000,
    height : 600  
  }

  async function getMLOutput(file, imgWidth, imgHeight) {
    
    /*
      const dummyData = JSON.parse("{\"containers\": [{\"coordinates\": [0, 0, 800, 48], \"type\": \"container\", \"children\": [{\"type\": \"text\", \"coordinates\": [203, 0, 533, 46], \"text\": \"Home\"}, {\"type\": \"text\", \"coordinates\": [203, 0, 533, 46], \"text\": \"Portfo 0\"}, {\"type\": \"text\", \"coordinates\": [203, 0, 533, 46], \"text\": \"Team\"}]}, {\"coordinates\": [0, 46, 800, 416], \"type\": \"container\", \"children\": [{\"type\": \"image\", \"coordinates\": [411, 134, 325, 245]}, {\"type\": \"text\", \"coordinates\": [56, 167, 298, 178], \"text\": \"Grow your business\"}, {\"type\": \"text\", \"coordinates\": [56, 167, 298, 178], \"text\": \"with Vesperr\"}, {\"type\": \"text\", \"coordinates\": [56, 167, 298, 178], \"text\": \"We are team of talanted designers making\"}, {\"type\": \"text\", \"coordinates\": [56, 167, 298, 178], \"text\": \"websites with Bootstrap\"}, {\"type\": \"text\", \"coordinates\": [56, 167, 298, 178], \"text\": \"Get Started\"}]}, {\"coordinates\": [0, 460, 800, 139], \"type\": \"container\", \"children\": [{\"type\": \"text\", \"coordinates\": [11, 461, 787, 52], \"text\": \"citrus\"}, {\"type\": \"text\", \"coordinates\": [11, 461, 787, 52], \"text\": \"Trustly\"}, {\"type\": \"text\", \"coordinates\": [11, 461, 787, 52], \"text\": \"myob\"}]}]}")
    */
    
    const imgBlob = new File([file], "", {
      type: file.type,
    })

    const formData = new FormData()
    formData.append("img", imgBlob)

    let data = await fetch("http://ec2-3-93-77-238.compute-1.amazonaws.com:8000/get_coordinates_from_image_object", {
      mode: "cors",
      body: formData,
      method: "POST"
    });

    if(data.status == 200) {
      data = await data.json();
      data = JSON.parse(data);
      data = data.containers;
      data = assignID(data);
      data = assignParent(data, null);
      data = flattenLabels(data);
      data = groupSimilarLabels(data);
      
      const rd = calculateAspectRatioFit(imgWidth, imgHeight, canvasOptions.width, canvasOptions.height);
      data = scaleAssetData(data, rd.scaleX, rd.scaleY);
      return data;
    }
    
    return [];
  }
  
  async function init(dataURL, file, input_type) {    
    setLoading(true);
    let canvasOptions = {
      width : 1000,
      height : 600  
    }
    
    let data = [];
    let aOptions;
    
    if(input_type == "file_upload") {
      let img = new Image();
      img.src = dataURL;
      
      const imgWidth = img.naturalWidth; 
      const imgHeight = img.naturalWidth; 
      
      img = null;
      
      data = await getMLOutput(file, imgWidth, imgHeight);
      const rd = calculateAspectRatioFit(imgWidth, imgHeight, canvasOptions.width, canvasOptions.height);
        
      aOptions = {
        scaleX: rd.scaleX,
        scaleY: rd.scaleY,
        width: Math.round(rd.width),
        height: Math.round(rd.height)
      }
      
      setAssetData(data);
      setAssetOptions(aOptions);
      setLoading(false);
      
    } else if(input_type == "url_screenshot") {
      
      let img = new Image();
      img.src = dataURL;
      
      const imgWidth = img.naturalWidth; 
      const imgHeight = img.naturalWidth; 
      
      document.body.appendChild(img)
      
      const rd = calculateAspectRatioFit(imgWidth, imgHeight, canvasOptions.width, canvasOptions.height);
      aOptions = {
        scaleX: rd.scaleX,
        scaleY: rd.scaleY,
        width: Math.round(rd.width),
        height: Math.round(rd.height)
      }

      img = null;

      setAssetData(data);
      setAssetOptions(aOptions);
      setLoading(false);
    } 

  }

  function exportJSON(data) {
    console.log("*************** JSON ****************")
    console.log(data)
    console.log("**************************************")
    exportToJSON(data, "data")
  }

  function exportYOLO(data, types) {
    let t = Object.keys(types).map((key) => [types[key], key])

    console.log("*************** YOLO ****************")
    console.log("in yolo", data, t)
    console.log("**************************************")

    exportToCSV("yolo", data);
    exportToCSV("types", t)
  }

  function handleFileUpload(dataURL, file) {
    setAssetURL(dataURL);
    init(dataURL, file, "file_upload");
  }

  function handleURLScreenshot(dataURL, file) {
    setAssetURL(dataURL);
    init(dataURL, file, "url_screenshot");
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
        onURLScreenshot={handleURLScreenshot}
        loading={loading}
      />
    </div>
  );
}

export default App;

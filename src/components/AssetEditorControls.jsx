import { useRef } from "react";


function AssetEditorControls(props) {
    const inputRef = useRef();
    const mlOutputRef = useRef();

    function simulateClick() {
        const inp = inputRef.current;
        if(inp) {
            inp.click();
        }
    }

    function handleFileUpload(e) {
        console.log("input chagned", e.target.files);
        const mlOutput = mlOutputRef.current;
        
        let file;
        if(e.target.files) {
            file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = function(){
                let dataURL = reader.result;
                props.onFileUpload(dataURL, mlOutput.checked);
            };
            reader.readAsDataURL(file);
        }
      }
    
    
    function handleExportJSON() {
        props.onExportJSON();
    }

    function handleExportYOLO() {
        props.onExportYOLO();
    }
    
    let btn = (
        <div className="assetEditorControls">
            <div className="fileUploadContainer">
                <div className="hideInput">
                    <input id="upfile" type="file" ref={inputRef} onChange={handleFileUpload}/>
                </div>
                <label className="switch" htmlFor="mlOutput" > API ?
                    <input id="mlOutput" type="checkbox" ref={mlOutputRef}/>
                    <span className="slider round"></span>
                </label>
                <button onClick={simulateClick} className="labelInformationButton">Upload File</button>
            </div>
            <button 
                className="labelInformationButton" 
                onClick={handleExportJSON}>Export as JSON
            </button>
            <button 
                className="labelInformationButton" 
                onClick={handleExportYOLO}>Export as YOLO
            </button>
        </div>
    )

    return (
        <>
            {btn}
        </>
    )

}

export default AssetEditorControls;
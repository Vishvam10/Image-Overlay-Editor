import { useRef, useState } from "react";

import Modal from "./Modal";

function AssetEditorControls(props) {

    const [show, setShow] = useState(false);

    function showModal() {
        setShow(true);
    }

    function hideModal() {
        setShow(false);
    }

    const inputRef = useRef();

    const URLInpRef = useRef();
    const URLModalRef = useRef();

    function simulateClick() {
        const inp = inputRef.current;
        if(inp) {
            inp.click();
        }
    }

    function handleFileUpload(e) {
        let file;
        if(e.target.files) {
            file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = function(){
                const dataURL = reader.result;
                props.onFileUpload(dataURL, file);
            };
            reader.readAsDataURL(file);
        }
    }
    
    function handleURLScreenshot() {
        console.log("url modal ref : ", URLModalRef);
        const url = URLInpRef.current.value;
        const ifr = `<iframe src=${url} sandbox></iframe>`;
        URLModalRef.current.insertAdjacentHTML("beforeend", ifr);
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
                <button onClick={showModal} className="labelInformationButton">Enter URL</button>
                <div className="hideInput">
                    <input id="upfile" type="file" ref={inputRef} onChange={handleFileUpload}/>
                </div>
                <button onClick={simulateClick} className="labelInformationButton">Upload File</button>
            </div>
            <div className="exportContainer">
                <button 
                    className="labelInformationButton" 
                    onClick={handleExportJSON}>
                    {/* <ion-icon name="arrow-up-outline"></ion-icon> */}
                    Push JSON Data with Image
                </button>
            </div>
            <div className="exportContainer">
                <button 
                    className="labelInformationButton" 
                    onClick={handleExportYOLO}>
                    Push YOLO Data with Image
                </button>
            </div>
        </div>
    )

    return (
        <>
            <Modal show={show} handleClose={hideModal}>
                <h2>Enter URL</h2>
                <div ref={URLModalRef} style={{width: "100%"}}>
                    <div className="urlInputContainer">
                        <input type="text" className="urlInput" ref={URLInpRef}/>
                        <span className="goContainer" onClick={handleURLScreenshot}>
                            <ion-icon name="chevron-forward-outline"></ion-icon>
                            <h4>Go</h4>
                        </span>
                    </div>
                </div>
            </Modal>
            {btn}
        </>
    )

}

export default AssetEditorControls;
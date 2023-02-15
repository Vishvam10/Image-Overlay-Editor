import "../App.css";

const ALLOWED_TYPES = [
    "a", "div", "link", "img", "text", "section", "button", "container"
]

function AssetEditorLabelInformation(props) {

    const labelData = props.labelData;
    let id="", type="", coordinates="", dimensions="", text="", parent="null", info="";

    function handleUpdateLabel(e) {
        let type = String(e.target.innerText).replace("\n", "").replace("\t", "").replace(" ", "").toLowerCase();
        
        if(type.length > 0 && type.length < 20 && ALLOWED_TYPES.includes(type)) {
            labelData["type"] = type;
            console.log("reached")
            props.onLabelTypeChange(labelData["id"], type);
        } 
        return;
    }

    if(labelData) {
        id = labelData["id"];
        type = labelData["type"];
        parent = labelData["parent"] == null ? "null" : labelData["parent"]
        text = labelData["text"] == null ? "null" : labelData["text"]
        coordinates = `(${labelData["coordinates"][0]}, ${labelData["coordinates"][1]})`;
        dimensions = `(${labelData["coordinates"][2]} x ${labelData["coordinates"][3]}) px`;

        info = (
            <div className="labelInformationGroup">
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">ID</h3>
                    <p className="labelInformationDetail">{id}</p>
                </span>
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">TYPE</h3>
                    <p className="labelInformationDetail" contentEditable="true" onBlur={handleUpdateLabel} suppressContentEditableWarning={true}>{type}</p>
                </span>
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">PARENT</h3>
                    <p className="labelInformationDetail">{parent}</p>
                </span>
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">COORDINATES</h3>
                    <p className="labelInformationDetail">{coordinates}</p>
                </span>
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">DIMENSIONS</h3>
                    <p className="labelInformationDetail">{dimensions}</p>
                </span>
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">TEXT</h3>
                    <p className="labelInformationDetail">{text}</p>
                </span>
            </div>
        )

    } else {
        info = <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">No label selected</h3>
                </span>
    }

    return (
        <div className="assetEditorLabelInformation">
            <h2 className="assetEditorLabelInformationHeading">Label Information</h2>
            {info}
        </div>
    )


}

export default AssetEditorLabelInformation;
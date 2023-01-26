
import "../App.css";


function AssetEditorLabelInformation(props) {

    const labelData = props.labelData;
    let id="", type="", coordinates="", dimensions="";
    let info="", btn="";

    function handleOnClick() {
        props.onSaveAndExit(labelData);
    }

    function handleUpdateLabel(e) {
        const type = String(e.target.innerText);
        if(type.length > 0) {
            labelData["type"] = type;
            props.onLabelTypeChange(labelData["id"], type);
        }
    }

    if(labelData) {
        id = labelData["id"];
        type = labelData["type"];
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
                    <h3 className="labelInformationHeader">COORDINATES</h3>
                    <p className="labelInformationDetail">{coordinates}</p>
                </span>
                <span className="labelInformationSubGroup">
                    <h3 className="labelInformationHeader">DIMENSIONS</h3>
                    <p className="labelInformationDetail">{dimensions}</p>
                </span>
                {btn}
            </div>
        )

       
    } else {
        btn = (
            <button className="labelInformationButton" onClick={handleOnClick}>Save and Exit</button>
        )
        info = btn
    }

    return (
        <div className="assetEditorLabelInformation">
            <h1 className="assetEditorLabelInformationHeading">Label Information</h1>
            {info}
        </div>
    )


}

export default AssetEditorLabelInformation;
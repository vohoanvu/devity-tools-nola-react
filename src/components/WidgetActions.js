import * as React from "react";
import Editable from "./Editable";
import btn_save from "../img/btn_save.png";
import btn_maximize from "../img/btn_maximize.png";
import btn_minimize from "../img/btn_minimize.png";
import btn_delete from "../img/btn_delete.png";
import btn_downnload from "../img/btn_download.png"
import $ from "jquery";


export default function Widget(props) 
{
    const saveBtnRef = React.useRef(null);
    const axios = props.axios;

    React.useEffect(() => {
    }, []);

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id);
        }
    }

    async function deleteWidget(id) {
        const newArray = props.widgetObjState[props.widget.w_type].filter(w => w.id !== id);
        props.setWidgetObjState({
            ...props.widgetObjState,
            [props.widget.w_type]:  newArray
        });
        $("div[data-panel=" + props.widget.w_type + "] .gear").addClass("rotate");
        await axios.delete("/api/widgets/" + id)
            .then(res => {
                if (res.status === 200) {
                    console.log("Succesfully deleted " + props.widget.w_type + " widget " + props.widget.name);
                    $("div[data-panel=" + props.widget.w_type + "] .gear").removeClass("rotate");
                }
            })
            .catch(err => console.log(err));
    }

    function handleTitleChange(newValue, currentWidget) {
        props.widgetObjState[currentWidget.w_type].find(w => w.id === currentWidget.id).name = newValue;
        props.setWidgetObjState({...props.widgetObjState});
    }

    function Maximize(id) {
        let w = $("[data-w_id=\"" + id + "\"]");

        $(w).removeClass("min");
        $(w).addClass("max");

        // Get the panel parent
        let p = $(w).parents(".p-panel");
        $(p).find(".w-container").hide();
        $(w).show();

        $(p).find(".non-truncated").show();
        $(p).find(".truncated").hide();

        // manage widget max min buttons
        $(w).find(".maximize").hide();
        $(w).find(".minimize").show();

        //rss text display
        $(".rss-item").find(".rss-text").removeClass("rss-min-font");

        const event = new Event(`widgetMaximized-${props.widget.id}`);
        window.dispatchEvent(event);
    }
    function Minimize(id) {
        let w = $("[data-w_id=\"" + id + "\"]");

        $(w).removeClass("max");
        $(w).addClass("min");

        // Get the panel parent
        let p = $(w).parents(".p-panel");
        $(p).find(".w-container").show();
        $(w).show();

        $(p).find(".non-truncated").hide();
        $(p).find(".truncated").show();

        // manage widget max min buttons
        $(w).find(".minimize").hide();
        $(w).find(".maximize").show();

        //rss text display
        $(".rss-item").find(".rss-text").addClass("rss-min-font");

        const event = new Event(`widgetMinimized-${props.widget.id}`);
        window.dispatchEvent(event);
    }

    async function saveWidgetTitleOnBlur(eventTarget) {
        const putBody = {
            ...props.widget, 
            name: eventTarget.value
        };
        await props.callPUTRequest(putBody, props.widget.w_type);
    }

    function DownloadWidgetHandler(type) {
        $("div[data-panel=" + type + "] .gear").addClass("rotate");
        switch (type) {
        case "NOTES":
            window.dispatchEvent(new Event(`JsonNoteDownloadRequested-${props.widget.id}`));
            break;
        case "LINKS":
            window.dispatchEvent(new Event(`JsonLinkDownloadRequested-${props.widget.id}`));
            break;
        case "CLIPBOARD":
            window.dispatchEvent(new Event(`JsonClipboardDownloadRequested-${props.widget.id}`));
            break;
        case "DEVITY":
            window.dispatchEvent(new Event(`JsonDevityDownloadRequested-${props.widget.id}`));
            break;
        default:
            break;
        }
    }

    return (
        <React.Fragment>
            {
                props.widget.name === "Devity News!" ? (
                    <span style={{ fontSize: "20px" }}>{props.widget.name}</span>
                ) : (
                    <Editable 
                        displayText={<span className="title filterable">{props.widget.name || "Enter a name for widget" }</span>}
                        inputType="input" 
                        childInputRef={props.inputRef}
                        passFromChildToParent={saveWidgetTitleOnBlur}
                        styling={{ display: "inline-block" }}>
                        <input
                            ref={props.inputRef}
                            type="text"
                            name="widgetTitle"
                            placeholder="Enter a name for widget"
                            value={props.widget.name}
                            onChange={e => handleTitleChange(e.target.value, props.widget)}
                        />
                    </Editable>
                )
            }
            <div className='buttons'>
                {
                    props.widget.w_type !== "DEVITY" && (
                        <img 
                            className='img-btn download' 
                            onClick={() => DownloadWidgetHandler(props.widget.w_type)} 
                            src={btn_downnload} alt="download" 
                            title="Download JSON file"
                            aria-hidden="true"/>
                    )
                }
                <img 
                    id={`save-btn-${props.widget.id}`}
                    className='img-btn save' 
                    ref={saveBtnRef}
                    onClick={async ()=> {
                        console.log("save button clicked...");
                        if (props.isReadyToSave.isReadyToSave) {
                            await props.callPUTRequest(props.isReadyToSave.putBody, props.isReadyToSave.type)
                                .then(result => {
                                    $(`#save-btn-${props.widget.id}`).hide();
                                });
                        } else {
                            alert("not yet ready to save! Please change something and then blur mouse pointer anywhere before saving again!");
                        }
                    }}
                    src={btn_save} 
                    alt="save widget"
                    aria-hidden="true"/>
                <img 
                    id={`delete-btn-${props.widget.id}`}
                    className='img-btn delete' 
                    onClick={()=>DeleteWidgetHandler(props.widget.id)} 
                    src={btn_delete} alt="delete" 
                    aria-hidden="true"/>
                <img 
                    id={`maximize-btn-${props.widget.id}`}
                    className='img-btn maximize' 
                    onClick={()=>Maximize(props.widget.id)} 
                    src={btn_maximize} alt="maximize" 
                    aria-hidden="true"/>
                <img 
                    className='img-btn minimize' 
                    style={{display:"none"}} 
                    onClick={()=>Minimize(props.widget.id)} 
                    src={btn_minimize} alt="minimize" 
                    aria-hidden="true"/>
            </div>
        </React.Fragment>
    );
  
}
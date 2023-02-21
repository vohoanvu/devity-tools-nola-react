import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import CONFIG from "../config.json";
import "../css/App.css";
import Editable from "./Editable";
import btn_add from "../img/btn_add.png";
import btn_delete_sm from "../img/btn_delete_sm.png";
import { abbriviate, currate_title } from "../Utilities";
const sso_url = CONFIG.SSO_URL;


export default function Clipboard(props)
{
    const [clipboardContent, setClipboardContent] = useState({
        currentText: "",
        content: null,
        widget: {}
    });
    const inputRef = useRef();
    const axios = props.axios;

    useEffect(() => {
        const curr_view = props.activePanel;
        const getWidgetContent = async () => {
            if ((curr_view && curr_view !== "CLIPBOARD" && curr_view !== "ALL") || 
            (curr_view === "CLIPBOARD" && clipboardContent.widget.w_content)) return;

            const widget = await getWidgetContentById(props.widget.id);
            let contentArray = [];
            if (Object.keys(JSON.parse(widget.w_content)).length !== 0) {
                contentArray = JSON.parse(widget.w_content)["CLIPBOARD"];
            }

            setClipboardContent({
                ...clipboardContent,
                content: contentArray,
                widget: widget
            });
        }

        getWidgetContent();
        $(`#save-btn-${props.widget.id}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget.id, props.activePanel]);

    async function getWidgetContentById(w_id) {
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                //console.log("Get CLIPBOARD widget");
                //console.log(res.data);
                return res.data;
            }).then(result => result)
            .catch((err) => console.log(err));
    }

    async function updateWidgetContent(currentContentArray, type) {
        let jsonObject = JSON.parse(clipboardContent.widget.w_content);
        jsonObject["CLIPBOARD"] = currentContentArray;

        const putBody = {
            ...clipboardContent.widget,
            w_content: JSON.stringify(jsonObject)
        }

        await props.sendContentToParent(putBody, null, null);
    }

    function handleContentOnChange(e) {
        setClipboardContent({
            ...clipboardContent,
            currentText: e.target.value
        });
        $(`#save-btn-${props.widget.id}`).show();
    }

    function onBlurClipboardContent(eventTarget) {
        if (eventTarget.value.length === 0) return;


        clipboardContent.content.splice(0, 0, eventTarget.value);
        setClipboardContent({
            ...clipboardContent,
            currentText: ""
        });
        updateWidgetContent(clipboardContent.content, clipboardContent.widget.w_type);
    }

    const handleItemClick = event => {
        var text = $(event.currentTarget).data("copy");
    
        $(event.currentTarget).animate({ opacity: "0.1" }, "fast");
        $(event.currentTarget).animate({ opacity: "1" }, "fast");
        
    
        navigator.clipboard.writeText(text).then(function() {
            console.log(text);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });
    
    };

    function handleRemoveClipboard(event) {
        const index = $(event.currentTarget).parent().index();
        clipboardContent.content.splice(index, 1);
        setClipboardContent({
            ...clipboardContent
        });
        $(`#save-btn-${props.widget.id}`).show();
        updateWidgetContent(clipboardContent.content, "CLIPBOARD");
    }

    return (
        <div className='w_overflowable'>
            <div className='widget clipboard'>
                <form id="clipboardContentForm" onSubmit={e => e.preventDefault() } autoComplete="off">
                    <img style={{ width: "10px", height: "10px"}} className='add-btn' src={btn_add} alt="create widget"/>
                    <Editable 
                        displayText={<span>{clipboardContent.currentText || "Add"}</span>}
                        inputType="input" 
                        childInputRef={inputRef}
                        passFromChildToParent={onBlurClipboardContent}
                        styling={{ display: "inline-block", width: "95%" }}>
                        <input
                            ref={inputRef}
                            type="text"
                            name="clipboardContent"
                            placeholder=""
                            value={clipboardContent.currentText}
                            onChange={handleContentOnChange}
                            style={{ width: "100%" }}
                        />
                    </Editable>
                </form>
                <div className='w_overflowable'>
                    <ul>
                        {
                            !clipboardContent.content ? (
                                <div style={{ display: "flex", justifyContent: "center"}}>
                                    <div className="loader"></div>
                                </div>
                            ) : (
                                clipboardContent.content.map( (data, index) => 
                                    <li key={index}>
                                        <span className='w_copyable filterable truncated' title={currate_title(data)} data-copy={data} onClick={handleItemClick} aria-hidden="true">{abbriviate(data)}</span>
                                        <span className='w_copyable filterable non-truncated' style={{display:"none"}}  data-copy={data} onClick={handleItemClick} aria-hidden="true">{data}</span>
                                        <img className='img-btn delete-item' src={btn_delete_sm} title='delete' alt="delete" onClick={handleRemoveClipboard} aria-hidden="true"/>
                                    </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}
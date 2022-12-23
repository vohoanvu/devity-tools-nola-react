import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from "jquery";
import configData from "../config.json";
import '../css/App.css';
import Editable from './Editable';
import btn_add from "../img/btn_add.png";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;


export default function Clipboard(props)
{
    const [clipboardContent, setClipboardContent] = useState({
        currentText: '',
        content: [],
        widget: {}
    });
    const inputRef = useRef();

    useEffect(() => {
        const getWidgetContent = async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget.id]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

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

        await props.callPUTRequest(putBody, type);
    }

    function handleContentOnChange(e) {
        setClipboardContent({
            ...clipboardContent,
            currentText: e.target.value
        });
    }

    function onBlurClipboardContent(eventTarget) {
        clipboardContent.content.splice(0, 0, eventTarget.value);
        setClipboardContent({
            ...clipboardContent,
            currentText: ''
        });
        updateWidgetContent(clipboardContent.content, clipboardContent.widget.w_type);
    }

    const handleItemClick = event => {
        var text = $(event.currentTarget).text();
    
        $(event.currentTarget).animate({ opacity: '0.1' }, "fast");
        $(event.currentTarget).animate({ opacity: '1' }, "fast");
        
    
        navigator.clipboard.writeText(text).then(function() {
          console.log(text);
        }, function(err) {
          console.error('Async: Could not copy text: ', err);
        });
    
      };

    return (
        <div className='widget clipboard'>
            <div>
            <form id="contentForm" onSubmit={e => e.preventDefault() } autoComplete="off">
                <img style={{ width: '10px', height: '10px'}} className='add-btn' src={btn_add} alt="create widget"/>
                <Editable 
                    displayText={<span>{clipboardContent.currentText || "Enter Clipboard Content"}</span>}
                    inputType="input" 
                    childInputRef={inputRef}
                    passFromChildToParent={onBlurClipboardContent}>
                    <input
                        ref={inputRef}
                        type="text"
                        name="clipboardContent"
                        placeholder=""
                        value={clipboardContent.currentText}
                        onChange={handleContentOnChange}
                    />
                </Editable>
            </form>
            </div>
            <div className='w_overflowable'>
                <ul>
                {
                    clipboardContent.content?.map( (data, index) => 
                        <li><span className='w_copyable filterable' onClick={handleItemClick} key={index}>{data}</span></li> )
                }
                </ul>
            </div>
        </div>
    );
}
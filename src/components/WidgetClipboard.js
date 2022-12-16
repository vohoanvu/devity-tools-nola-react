import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import Editable from './Editable';
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
        let jsonObjList = JSON.parse(clipboardContent.widget.w_content);
        jsonObjList["CLIPBOARD"] = currentContentArray;

        const putBody = {
            ...clipboardContent.widget,
            w_content: JSON.stringify(jsonObjList)
        }

        await props.callPUTRequest(putBody, type);
    }

    function handleContentOnChange(e) {
        setClipboardContent({
            ...clipboardContent,
            currentText: e.target.value
        });
    }

    function onBlurClipboardContent(newValue) {
        clipboardContent.content.splice(0, 0, newValue);
        setClipboardContent({
            ...clipboardContent,
            currentText: ''
        });
        updateWidgetContent(clipboardContent.content, clipboardContent.widget.w_type);
    }

    // const handleContentKeyDown = (event) => {
    //     const { key } = event;
    //     const keys = ["Escape", "Tab", "Enter"];

    //     if (keys.indexOf(key) > -1) {
    //         event.currentTarget.blur();
    //     }
    // };


    return (
        <div className='widget'>
            <form id="contentForm" onSubmit={e => e.preventDefault() }>
                <Editable 
                    text={clipboardContent.currentText}
                    placeholder="Enter Clipboard Content" 
                    inputType="input" 
                    childInputRef={inputRef}
                    passFromChildToParent={onBlurClipboardContent}>
                    <input
                        ref={inputRef}
                        type="text"
                        name="clipboardContent"
                        placeholder="Enter Clipboard Content"
                        value={clipboardContent.currentText}
                        onChange={handleContentOnChange}
                    />
                </Editable>
            </form>
            {
                clipboardContent.content?.map( (data, index) => 
                    <li key={index}>{data}</li> )
            }
        </div>
    );
}

/* <label>
    Input Clipboard:
    <input 
        value={clipboardContent.currentText}
        type="text" 
        onChange={handleContentOnChange}
        onBlur={onBlurClipboardContent}
        onKeyDown={handleContentKeyDown}/>
</label> */
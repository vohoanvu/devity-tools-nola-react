import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;


export default function Clipboard(props)
{
    const [clipboardContent, setClipboardContent] = useState({
        currentText: '',
        content: ["FORD", "BMW"],
        widget: {}
    });

    useEffect(() => {
        const getWidgetContent = async () => {
            const widget = await getWidgetContentById(props.widget.id);
            const contentArray = JSON.parse(widget.w_content).map(pair => pair.CLIPBOARD)[0];

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

    function onSaveClipboardItem(e) {
        const newClipboardContentArray = [...clipboardContent.content];
        newClipboardContentArray.splice(0, 0, e.target.value);
        setClipboardContent({
            ...clipboardContent,
            content: newClipboardContentArray
        });

        updateWidgetContent(newClipboardContentArray, clipboardContent.widget.w_type);
    }

    async function updateWidgetContent(currentContentArray, type) {
        //TODO: make PUT call here by props.callPUTRequest(putBody, widgetType)
        let jsonObjList = JSON.parse(clipboardContent.widget.w_content);
        jsonObjList[0].CLIPBOARD = currentContentArray;

        const putBody = {
            ...clipboardContent.widget,
            w_content: JSON.stringify(jsonObjList)
        }

        const result = await props.callPUTRequest(putBody, type);
        console.log("On After Widget Update success...", result);
    }

    function handleClipboardChange(e) {
        setClipboardContent({
            ...clipboardContent,
            currentText: e.target.value
        })
    }


    return (
        <div className='widget'>
            {
                clipboardContent.content.map( (data, index) => 
                <li key={index}>{data}</li> )
            }
            <form id="contentForm">
                <label>
                    Input Clipboard:
                    <input 
                        value={clipboardContent.currentText}
                        type="text" 
                        onChange={handleClipboardChange}
                        onBlur={onSaveClipboardItem}/>
                </label>
            </form>
        </div>
    );
}
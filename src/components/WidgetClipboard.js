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
        content: ["FORD", "BMW"]
    });

    useEffect(() => {
        const getWidgetContent = async () => {
            const content = await getWidgetContentById(props.widget.id);
            const contentArray = JSON.parse(content).map(pair => pair.CLIPBOARD)[0];

            setClipboardContent({
                ...clipboardContent,
                content: contentArray
            });
        }

        getWidgetContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget.id]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                return res.data.w_content;
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

        //TODO: make PUT call here
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
                clipboardContent.content.map( (data, index) => <li key={index}>{data}</li> )
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
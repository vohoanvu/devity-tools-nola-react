import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import WidgetActions from './WidgetActions';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;


export default function Clipboard(props)
{
    const [clipboardList, setClipBoardList] = useState([]);
    const [testClipboard, setTestClipboard] = useState(["Ford", "BMW", "Fiat"]);

    useEffect(() => {
        let clipboardsWithContent = props.clipboardWidgets.map(async (w, index) => {

            return {
                key: index,
                ...w, 
                w_content: await getWidgetContentById(w.id)
            };
        });

        Promise.all(clipboardsWithContent).then(result => setClipBoardList(result) );
    }, [props.clipboardWidgets]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                return res.data.w_content;
            }).then(result => result)
            .catch((err) => console.log(err));
    }

    function onSaveClipboardItem(e) {
        console.log("On Save...",e.target.value);
        const newTestClipboard = [...testClipboard];
        newTestClipboard.splice(0, 0, e.target.value);
        setTestClipboard(newTestClipboard);
    }

    return(
        <div>
            {
                clipboardList.map((widget, index) => {

                    return (
                            <div key={index} className="w-container">
                                <span className="w-container-title">Widget Name: {widget.name}</span>
                                {
                                    testClipboard.map( (data, index) => <li key={index}>{data}</li> )
                                }
                                <div>
                                    <input 
                                        defaultValue={widget.w_content} 
                                        type="text" 
                                        onBlur={onSaveClipboardItem}/>
                                </div>
                                <WidgetActions 
                                    widgetId={widget.id} 
                                    resetWidgetList={props.setClipboardWidgets}
                                    widgetList={props.clipboardWidgets}
                                />
                            </div>
                    );
                })
            }
        </div>
    );
}
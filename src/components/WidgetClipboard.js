import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;


export default function Clipboard(props)
{
    //const [clipboardList, setClipBoardList] = useState([]);
    const [testClipboard, setTestClipboard] = useState(["Ford", "BMW", "Fiat"]);
    const [clipboard, setClipboard] = useState({});

    useEffect(() => {
        (async () => {
            const content = await getWidgetContentById(props.widget.id);
            const currentWidget = {
                ...props.widget,
                w_content: content
            }
            setClipboard(currentWidget);
        })();

    }, [props.widget]);

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

    return (
        <React.Fragment>
            <div>
                {
                    testClipboard.map( (data, index) => <li key={index}>{data}</li> )
                }
                <input 
                    defaultValue={clipboard.w_content} 
                    type="text" 
                    onBlur={onSaveClipboardItem}/>
            </div>
        </React.Fragment>
    );
}
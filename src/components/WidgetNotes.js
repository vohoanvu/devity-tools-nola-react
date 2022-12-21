import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Note(props)
{
    const [note, setNote] = useState({});

    useEffect(() => {
        (async () => {
            const content = await getWidgetContentById(props.widget.id);
            const currentWidget = {
                ...props.widget,
                w_content: content
            }
            setNote(currentWidget);
        })();

    }, [props.widget]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => console.log(err));
    }

    function onSaveNewNote(e) {
        console.log(e.target.value);
    }


    return (
        <div className='widget'>
            <label>Enter Widget Content : </label>
            <input 
                defaultValue={note.w_content} 
                type="text" 
                onChange={onSaveNewNote}/>
        </div>
    );
    
}

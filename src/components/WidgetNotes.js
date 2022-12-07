import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import WidgetActions from './WidgetActions';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Note(props)
{
    const [noteList, setNoteList] = useState([]);

    useEffect(() => {
        let notesWithContent = props.noteWidgets.map(async (w, index) => {

            return {
                key: index,
                ...w, 
                w_content: await getWidgetContentById(w.id)
            };
        });
        
        Promise.all(notesWithContent).then(result => setNoteList(result) );
    }, [props.noteWidgets]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => console.log(err));
    }

    function onSaveNewNote(e) {
        console.log(e.target.value);
    }

    return(
        <div>
            {
                noteList.map((widget) => {

                    return (
                        <div key={widget.id} className="w-container">
                            <span className="w-container-title">Widget Name: {widget.name}</span>
                            <div>
                                <label>Enter Widget Content : </label>
                                <input 
                                    defaultValue={widget.w_content} 
                                    type="text" 
                                    onChange={onSaveNewNote}/>
                            </div>
                            <WidgetActions 
                                widgetId={widget.id} 
                                resetWidgetList={props.setNoteWidgets}
                                widgetList={props.noteWidgets}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
}
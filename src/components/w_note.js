import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import btn_delete from "../img/cntrl_delete.jpg";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Note(props)
{
    const [noteWidget, setNoteWidget] = useState({});

    useEffect(() => {
        getWidgetById(props.w_id);
    }, [props.w_id]);

    async function getWidgetById(w_id) {
        await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                setNoteWidget(res.data);
        })
        .catch((err) => console.log(err));
    }

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id).then(deleted => {
                props.rerenderWidgets();
            });
        };
    }

    async function deleteWidget(id) {
        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                console.log(res.data, 'after DELETE response');
            })
            .catch(err => console.log(err));
    }

    return(
        <div className="w-container">
            <span className="w-container-title">Widget Type : {noteWidget.w_type}</span>
            <span className="w-container-title">Widget Name : {noteWidget.name}</span>
            <button className='btn-delete' onClick={()=>DeleteWidgetHandler(noteWidget.id)}>
                <img src={btn_delete} alt="delete"></img>
            </button>
        </div>
    );
}
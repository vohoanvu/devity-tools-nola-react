import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import btn_delete from "../img/btn_delete.png";
import btn_save_content from "../img/save-disk-icon.png";
import '../css/buttons.css';
const devity_api = configData.DEVITY_API;

export default function WidgetActions(props)
{
    const [widgetId, setWidgetId] = useState("");

    useEffect(()=>{
        setWidgetId(props.widgetId);
    }, [props.widgetId]);

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id);
        };
    }

    async function deleteWidget(id) {

        const newWidgetObjState = {...props.widgetObjState}
        const newWidgetList = props.widgetObjState[props.widgetType].filter(w => w.id !== id);
        newWidgetObjState[props.widgetType] = newWidgetList;
        props.setWidgetObjState(newWidgetObjState);

        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                //do nothing yet
            })
            .catch(err => console.log(err));

            console.log('deleted widget ' + id);
    }

    function saveContentHandler(contentList) {
        console.log("On saving content to db...", contentList);
    }

    return (
        <div className='btn-box'>
            <button className='btn-delete' onClick={()=>DeleteWidgetHandler(widgetId)}>
                <img src={btn_delete} alt="delete"/>
            </button>
            <button className='btn-save' onClick={()=>saveContentHandler(props.contentList)}>
                <img src={btn_save_content} alt="save"/>
            </button> 
        </div>
    );
}



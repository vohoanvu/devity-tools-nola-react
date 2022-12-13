import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import btn_delete from "../img/btn_delete.png";
import btn_save_content from "../img/save-disk-icon.png";
import '../css/buttons.css';
import Editable from './Editable';
const devity_api = configData.DEVITY_API;

export default function WidgetActions(props)
{
    const [widgetId, setWidgetId] = useState("");

    useEffect(()=>{
        setWidgetId(props.widget.id);
    }, [props.widget.id]);

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id);
        };
    }

    async function deleteWidget(id) {
        const newWidgetObjState = {...props.widgetObjState}
        const newWidgetList = props.widgetObjState[props.widget.w_type].filter(w => w.id !== id);
        newWidgetObjState[props.widget.w_type] = newWidgetList;
        props.setWidgetObjState(newWidgetObjState);

        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                //do nothing yet
                console.log(res, 'on delete');
            })
            .catch(err => console.log(err));
    }

    function saveContentHandler(contentList) {
        console.log("On saving content to db...", contentList);
    }

    function handleTitleChange(newValue, currentWidget) {
        props.widgetObjState[currentWidget.w_type].find(w => w.id === currentWidget.id).name = newValue;
        props.setWidgetObjState({...props.widgetObjState});
    }

    return (
        <div className='w-chrome'>
            <Editable text={props.widget.name} placeholder="Enter a name for widget" inputType="input" childInputRef={props.inputRef}>
                <input
                    ref={props.inputRef}
                    type="text"
                    name="widgetTitle"
                    placeholder="Enter a name for widget"
                    value={props.widget.name}
                    onChange={e => handleTitleChange(e.target.value, props.widget)}
                />
            </Editable>
            <button className='btn-delete' onClick={()=>DeleteWidgetHandler(widgetId)}>
                <img src={btn_delete} alt="delete"/>
            </button>
            <button className='btn-save' onClick={()=>saveContentHandler(props.contentList)}>
                <img src={btn_save_content} alt="save"/>
            </button> 
        </div>
    );
}



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import btn_delete from "../img/btn_delete.png";
import '../css/buttons.css';
import Editable from './Editable';
import { log } from '../Utilities'
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
        props.widgetObjState[props.widget.w_type] = props.widgetObjState[props.widget.w_type].filter(w => w.id !== id);
        props.setWidgetObjState({...props.widgetObjState});

        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                log('deleted ' + props.widget.w_type + ' widget ' + props.widget.name);
            })
            .catch(err => console.log(err));
    }

    function handleTitleChange(newValue, currentWidget) {
        props.widgetObjState[currentWidget.w_type].find(w => w.id === currentWidget.id).name = newValue;
        props.setWidgetObjState({...props.widgetObjState});
    }

    async function saveWidgetTitleOnBlur(eventTarget) {
        const putBody = {...props.widget, name: eventTarget.value};
        await props.callPUTRequest(putBody, props.widget.w_type);
    }

    return (
        <div className='w-chrome'>
            <Editable 
                displayText={<span>{props.widget.name || "Enter a name for widget" }</span>}
                inputType="input" 
                childInputRef={props.inputRef}
                passFromChildToParent={saveWidgetTitleOnBlur}>
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
        </div>
    );
}



import * as React from "react";
import configData from "../config.json";
import axios from 'axios';
import Editable from './Editable';
import btn_save from "../img/btn_save.png";
import btn_maximize from "../img/btn_maximize.png";
import btn_minimize from "../img/btn_minimize.png";
import btn_delete from "../img/btn_delete.png";
import '../css/buttons.css';
import { log } from '../Utilities'

import $ from "jquery";
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  const saveBtnRef = React.useRef(null);

  React.useEffect(() => {
  }, []);

  function DeleteWidgetHandler(id) {
    if (window.confirm("Are you use you want to delete this widget?")) {
        deleteWidget(id);
    };
  }

  async function deleteWidget(id) {
      const newArray = props.widgetObjState[props.widget.w_type].filter(w => w.id !== id);
      props.setWidgetObjState({
        ...props.widgetObjState,
        [props.widget.w_type]:  newArray
      });
      $('div[data-panel=' + props.widget.w_type + '] .gear').addClass('rotate');
      await axios.delete(devity_api + '/api/widgets/' + id)
          .then(res => {
              log('Succesfully deleted ' + props.widget.w_type + ' widget ' + props.widget.name);
              $('div[data-panel=' + props.widget.w_type + '] .gear').removeClass('rotate');
          })
          .catch(err => console.log(err));
  }

  function handleTitleChange(newValue, currentWidget) {
      props.widgetObjState[currentWidget.w_type].find(w => w.id === currentWidget.id).name = newValue;
      props.setWidgetObjState({...props.widgetObjState});
  }

  function Maximize(id) {
    let w = $('[data-w_id="' + id + '"]');

    $(w).removeClass('min');
    $(w).addClass('max');

    // Get the panel parent
    let p = $(w).parents('.p-panel');
    $(p).find('.w-container').hide();
    $(w).show();

    // manage widget max min buttons
    $(w).find('.maximize').addClass('hide');
    $(w).find('.minimize').removeClass('hide');
  }
  function Minimize(id) {
    let w = $('[data-w_id="' + id + '"]');

    $(w).removeClass('max');
    $(w).addClass('min');

    // Get the panel parent
    let p = $(w).parents('.p-panel');
    $(p).find('.w-container').show();
    $(w).show();

    // manage widget max min buttons
    $(w).find('.minimize').addClass('hide');
    $(w).find('.maximize').removeClass('hide');
  }

  async function saveWidgetTitleOnBlur(eventTarget) {
      const putBody = {
          ...props.widget, 
          name: eventTarget.value
      };
      await props.callPUTRequest(putBody, props.widget.w_type);
  }

  return (
    <React.Fragment>
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
        <div className='chrome-btn-bar'>
            <img 
              id={`save-btn-${props.widget.id}`}
              className='img-btn-save' 
              ref={saveBtnRef}
              onClick={async ()=> {
                  console.log('save button clicked', props.widget);
                  if (props.isReadyToSave.isReadyToSave) {
                    await props.callPUTRequest(props.isReadyToSave.putBody, props.isReadyToSave.type);
                    if (props.widget.w_type === 'NOTES') {
                      $(`#save-btn-${props.widget.id}`).hide();
                    }
                  } else {
                    alert('not yet ready to save! Please click Save button again after a few seconds.');
                  }
              }}
              src={btn_save} alt="save widget"/>
            <img 
              className='img-btn-delete' 
              onClick={()=>DeleteWidgetHandler(props.widget.id)} 
              src={btn_delete} alt="delete"/>
            <img 
              className='img-btn maximize' 
              onClick={()=>Maximize(props.widget.id)} 
              src={btn_maximize} alt="maximize"/>
            <img 
              className='img-btn minimize hide' 
              onClick={()=>Minimize(props.widget.id)} 
              src={btn_minimize} alt="minimize"/>
        </div>
    </React.Fragment>
  );
  
}
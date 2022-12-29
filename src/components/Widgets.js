import * as React from "react";
import configData from "../config.json";
import axios from 'axios';
import Editable from './Editable';
import btn_save from "../img/btn_save.png";
import '../css/buttons.css';
import { log } from '../Utilities'
import btn_delete from "../img/btn_delete.png";
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  //const [widgetType, setWidgetType] = React.useState("");
  //const [widget, setWidget] = React.useState({});
  const saveBtnRef = React.useRef(null);

  React.useEffect(() => {
    //setWidgetType(props.widget.w_type);
  }, []);

  function DeleteWidgetHandler(id) {
    if (window.confirm("Are you use you want to delete this widget?")) {
        deleteWidget(id);
    };
  }

  async function deleteWidget(id) {
      console.log(props.widgetObjState, 'before delete');
      const newArray = props.widgetObjState[props.widget.w_type].filter(w => w.id !== id);
      props.setWidgetObjState({
        ...props.widgetObjState,
        [props.widget.w_type]:  newArray
      });
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
      const putBody = {
          ...props.widget, 
          name: eventTarget.value
      };
      await props.callPUTRequest(putBody, props.widget.w_type);
  }

  return (
    <React.Fragment>
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
        <div className='chrome-btn-bar'>
            <img 
              className='img-btn save' 
              ref={saveBtnRef}
              onClick={async ()=> {
                  console.log('save button clicked', props.widget);
                  if (props.isReadyToSave.isReadyToSave) {
                    await props.callPUTRequest(props.isReadyToSave.putBody, props.isReadyToSave.type);
                  } else {
                    alert('not ready to save! Please check sendPUTContentFromChildToParent() method in DevityPanel.js');
                  }
              }}
              src={btn_save} alt="save widget"/>
            <img 
              className='img-btn delete' 
              onClick={()=>DeleteWidgetHandler(props.widget.id)} 
              src={btn_delete} alt="delete"/>
        </div>
      </div>
    </React.Fragment>
  );
  
}

/* <WidgetActions 
  widget={props.widget}
  setWidgetObjState={props.setWidgetObjState}
  widgetObjState={props.widgetObjState}
  inputRef={props.inputRef}
  callPUTRequest={updateWidgetRequest}
  onClickHandler={onSaveHandler}
  isDisabled={false}/> */
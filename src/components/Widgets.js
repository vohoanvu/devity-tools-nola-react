import * as React from "react";
import configData from "../config.json";
import axios from 'axios';
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';
//import WidgetActions from './WidgetActions';
import Editable from './Editable';
import btn_save from "../img/btn_save.png";
import $ from "jquery";
import '../css/buttons.css';
import { log } from '../Utilities'
import btn_delete from "../img/btn_delete.png";
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  const [widgetType, setWidgetType] = React.useState("");
  const [widget, setWidget] = React.useState({});
  const saveBtnRef = React.useRef(null);

  React.useEffect(() => {
    setWidgetType(props.widget.w_type);
  }, [props.widget.w_type]);

  async function updateWidgetRequest(putBody, type) {
    delete putBody["key"];
    $('div[data-panel=' + type + '] .gear').addClass('rotate');
    const result = await axios.put(devity_api + "/api/widgets", { ...putBody })
          .then(response => {
            console.log(response.status, '...on update');
            return response.data;
          })
          .then(result => {
              $('div[data-panel=' + type + '] .gear').removeClass('rotate');
              return result;
          })
          .catch(err => console.log(err));

    return result;
  }

  // function renderSAVEbutton(onClickHandler, isDisabled, cssNames) {
  //   return (
  //     <img className={cssNames} onClick={onClickHandler} disabled={isDisabled} src={btn_save} alt="save widget"/>
  //   );
  // }

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
      await updateWidgetRequest(putBody, props.widget.w_type);
  }

  function passContentToParent(jsonData, type) {  
    setWidget({
      ...props.widget,
      w_type: type,
      w_content: JSON.stringify(jsonData)
    })
  }

  function renderIndividualWidget(type) {

    switch (type)
    {
      case "CLIPBOARD":
        return <WidgetClipboard widget={props.widget} callPUTRequest={updateWidgetRequest} />;
  
      case "LINKS":
        return <WidgetLink widget={props.widget} passContentToParent={passContentToParent}/>;
  
      case "NOTES":
        return <WidgetNote widget={props.widget} passContentToParent={passContentToParent}/>;
  
      default:
        return <div className="w-container">LOADING...</div>;
    }

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
                  console.log('save button clicked', widget);
                  await updateWidgetRequest(widget, widget.w_type);
              }}
              src={btn_save} alt="save widget"/>
            <img 
              className='img-btn delete' 
              onClick={()=>DeleteWidgetHandler(props.widget.id)} 
              src={btn_delete} alt="delete"/>
        </div>
      </div>
      {
        renderIndividualWidget(widgetType)
      }
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
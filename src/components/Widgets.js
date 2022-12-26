import * as React from "react";
import configData from "../config.json";
import axios from 'axios';
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';
import WidgetActions from './WidgetActions';
import $ from "jquery";
import '../css/buttons.css';
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  const [widgetType, setWidgetType] = React.useState("");

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

  function renderSAVEbutton(onClickHandler, isDisabled, cssNames) {
    return (
      <button type='button' value="Submit" className={cssNames} onClick={onClickHandler} disabled={isDisabled}>Save</button>
    );
  }

  function renderSwitchCases(type) {
    switch (type)
    {
      case "CLIPBOARD":
        return (<WidgetClipboard widget={props.widget} callPUTRequest={updateWidgetRequest} />);
  
      case "LINKS":
        return (<WidgetLink widget={props.widget} callPUTRequest={updateWidgetRequest} renderSaveBtn={renderSAVEbutton}/>);
  
      case "NOTES":
        return (<WidgetNote widget={props.widget} callPUTRequest={updateWidgetRequest} renderSaveBtn={renderSAVEbutton}/>);
  
      default:
        return <div className="w-container">NOTHING HERE</div>;
    }
  }

  return (
    <React.Fragment>
      <WidgetActions 
        widget={props.widget}
        setWidgetObjState={props.setWidgetObjState}
        widgetObjState={props.widgetObjState}
        inputRef={props.inputRef}
        callPUTRequest={updateWidgetRequest}/>
      {renderSwitchCases(widgetType)}
    </React.Fragment>
  );
  
}

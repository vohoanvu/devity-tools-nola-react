import React, { useEffect, useState } from 'react';
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';
import axios from 'axios';
import configData from "../config.json";
//import { UserContext } from "../api-integration/UserContext";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function WidgetList(props) 
{
  //const [w_type, setWidgetType] = useState("");
  //const user = React.useContext(UserContext);

  // useEffect(() => {
  //     //setWidgetType(props.widgetType);
  // }, []);


  function onAddNewWidget(widgetType) {

    const newWidget = {
        key: props.widgetArray.length+1,
        height : 300,
        name: "NEW Clipboard",
        order: 0,
        w_content: "{empty json}",
        w_type: widgetType,
        width: 300
    }

    const newWidgetList = [...props.widgetArray];
    newWidgetList.splice(0, 0, newWidget);
    props.setWidgetArray(newWidgetList);
}

  switch (props.widgetType) {
    case "CLIPBOARD":
      return (
        <div className="w-panel">
          <span className="w-panel-title">{props.widgetType}</span>
          <button 
                type="button"
                className='btn btn-primary'
                onClick={onAddNewWidget(props.widgetType)}
            >Add New</button>
          {
            props.widgetArray.map( (widget, index) => 
              <WidgetClipboard key={index} clipboardWidget={widget} setClipboardWidgets={props.setWidgetArray}/> )
          }op
        </div>
      );

    case "LINKS":
      return (
        <div className="w-panel">
          <span className="w-panel-title">{props.widgetType}</span>
          <button 
                type="button"
                className='btn btn-primary'
                onClick={onAddNewWidget(props.widgetType)}
          >Add New</button>
          {
            props.widgetArray.map( (widget, index) => 
              <WidgetLink key={index} linkWidget={widget} setLinkWidgets={props.setWidgetArray}/> )
          }
        </div>
      );
      
    case "NOTES":
      return (
        <div className="w-panel">
          <span className="w-panel-title">{props.widgetType}</span>
          <button 
                type="button"
                className='btn btn-primary'
                onClick={onAddNewWidget(props.widgetType)}
            >Add New</button>
          {
            props.widgetArray.map( (widget, index) => 
              <WidgetNote key={index} noteWidget={widget} setNoteWidgets={props.setWidgetArray}/>)
          }
        </div>
      );
                
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }
}

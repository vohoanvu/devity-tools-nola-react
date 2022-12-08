import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import Widget from './Widget';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels(props) 
{
  //const [linkWidgets, setLinkWidgets] = useState([]);
  //const [noteWidgets, setNoteWidgets] = useState([]);
  //const [clipboardWidgets, setClipboardWidgets] = useState([]);
  const [widgetObject, setWidgetObject] = useState({});

  useEffect(() => {
    async function fetchData() {
      await axios.get(devity_api + '/api/widgets')
        .then((res) => {
            if (res.status === '401') window.location.replace(sso_url);

            //setLinkWidgets(res.data["LINKS"]);
            //setNoteWidgets(res.data["NOTES"]);
            //setClipboardWidgets(res.data["CLIPBOARD"]);
            setWidgetObject(res.data);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);


  function onAddNewWidget(widgetType) {
    let newName = (widgetObject[widgetType].length+1).toString();

    const newWidget = {
        key: widgetObject[widgetType].length+1,
        w_content: `{ ${widgetType}: [] }`,
        name: "TEST Widget " + newName,
        order: widgetObject[widgetType].length+1,
        w_type: widgetType,
        height : 300,
        width: 300
    }
    const newWidgetArray = [...widgetObject[widgetType]];
    newWidgetArray.splice(0, 0, newWidget);
    widgetObject[widgetType] = newWidgetArray;

    switch (widgetType) {
      case "CLIPBOARD":
        setWidgetObject(widgetObject);
        createWidget(newWidget);
        break;
      case "NOTES":
        setWidgetObject(widgetObject);
        createWidget(newWidget);
        break;
      case "LINKS":
        setWidgetObject(widgetObject);
        createWidget(newWidget);
        break;
      default:
        break;
    }
  }

  async function createWidget(postBody) {
    delete postBody["key"];

    await axios.post(devity_api + "/api/widgets/", { ...postBody })
          .then(response => {
            return response.data
          })
          .then(result => {
            return result
          })
          .catch(err => console.log(err));
  }


  return (
    <React.Fragment>
      {
        Object.entries(widgetObject).map( ([key,value]) => {

          <div className="w-panel">
            <span className="w-panel-title">{key}</span>
            <button className='btn btn-primary' onClick={onAddNewWidget(props.widgetType)}>Add New</button>
            {
              value.map((w, index) => {
                return (
                    <Widget
                      key={index}
                      widget={w}
                      setWidgetObjState={setWidgetObject}
                      widgetObjState={widgetObject}
                    />
                );
              })
            }
          </div>
        })
      }
    </React.Fragment>
  );
}





{/* <React.Fragment>
      <div className="w-panel">
          <span className="w-panel-title">CLIPBOARD</span>
          <button type="button" 
            className='btn btn-primary' 
            onClick={()=>onAddNewWidget("CLIPBOARD", clipboardWidgets)}>Add New Clipboard</button>
          <WidgetClipboard clipboardWidgets={clipboardWidgets} setClipboardWidgets={setClipboardWidgets}/>
      </div>
      <div className="w-panel">
          <span className="w-panel-title">NOTES</span>
          <button type="button" className='btn btn-primary' 
            onClick={()=>onAddNewWidget("NOTES", noteWidgets)}>Add New Note</button>
          <WidgetNote noteWidgets={noteWidgets} setNoteWidgets={setNoteWidgets}/>
      </div>
      <div className="w-panel">
          <span className="w-panel-title">LINKS</span>
          <button type="button" className='btn btn-primary' 
            onClick={()=>onAddNewWidget("LINKS", linkWidgets)}>Add New Link</button>
          <WidgetLink linkWidgets={linkWidgets} setLinkWidgets={setLinkWidgets}/>
      </div>
    </React.Fragment> */}
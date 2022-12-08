import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import Widget from './Widgets';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels(props) 
{
  const [widgetObject, setWidgetObject] = useState({});

  useEffect(() => {
    async function fetchData() {
      await axios.get(devity_api + '/api/widgets')
        .then((res) => {
            if (res.status === '401') window.location.replace(sso_url);

            setWidgetObject(res.data);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);


  function onAddNewWidget(widgetType, widgetList) {
    let newName = (widgetList.length+1).toString();
    let jsonObj = []
    let contentItem = {};
    contentItem[widgetType.toString()] = [];
    jsonObj.push(contentItem);

    const newWidget = {
        key: widgetList.length+1,
        w_content: JSON.stringify(jsonObj),
        name: "TEST Widget " + newName,
        order: widgetList.length+1,
        w_type: widgetType,
        height : 300,
        width: 300
    }
    const newWidgetArray = [...widgetList];
    newWidgetArray.splice(0, 0, newWidget);
    const newWidgetsObject = {...widgetObject};
    newWidgetsObject[widgetType] = newWidgetArray;

    switch (widgetType) {
      case "CLIPBOARD":
        console.log(newWidgetsObject, 11111);
        setWidgetObject(newWidgetsObject);
        createWidget(newWidget);
        break;
      case "NOTES":
        console.log(newWidgetsObject, 11111);
        setWidgetObject(newWidgetsObject);
        createWidget(newWidget);
        break;
      case "LINKS":
        console.log(newWidgetsObject, 11111);
        setWidgetObject(newWidgetsObject);
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
        Object.entries(widgetObject).map( ([key,value], index) => {

          return (
            <div key={index} className="w-panel">
              <span className="w-panel-title">{key}</span>
              <button 
                className='btn btn-primary' 
                onClick={()=>onAddNewWidget(key, value)}>Add New</button>
              {
                value.map((w, index) => {
                  return (
                    <div key={index} className="w-container">
                      <span className="w-container-title">Widget Name: {w.name}</span>
                      <Widget
                        widget={w}
                        setWidgetObjState={setWidgetObject}
                        widgetObjState={widgetObject}
                      />
                    </div>
                  );
                })
              }
            </div>)
        })
      }
    </React.Fragment>
  );
}





/* <React.Fragment>
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
    </React.Fragment> */
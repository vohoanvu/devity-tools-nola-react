import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import Widget from './Widgets';
import WidgetActions from './WidgetActions';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels() 
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


  async function onAddNewWidget(widgetType, widgetList) {
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

    switch (widgetType) {
      case "CLIPBOARD":
        createWidget(newWidget, newWidgetArray, widgetType);
        break;
      case "NOTES":
        createWidget(newWidget, newWidgetArray, widgetType);
        break;
      case "LINKS":
        createWidget(newWidget, newWidgetArray, widgetType);
        break;
      default:
        break;
    }
  }

  async function createWidget(postBody, newWidgetArray, type) {
    delete postBody["key"];

    await axios.post(devity_api + "/api/widgets/", { ...postBody })
          .then(response => {
            return response.data
          })
          .then(result => {
              postBody["id"] = result.id;
              newWidgetArray.splice(0, 0, postBody);
              const newWidgetsObject = {...widgetObject};
              newWidgetsObject[type] = newWidgetArray;
              setWidgetObject(newWidgetsObject);
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
              <button onClick={()=>onAddNewWidget(key, value)}>Add New</button>
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
                      <WidgetActions 
                        widgetId={w.id} 
                        widgetType={w.w_type}
                        setWidgetObjState={setWidgetObject}
                        widgetObjState={widgetObject}/>
                    </div>
                  );
                })
              }
            </div>
          )
        })
      }
    </React.Fragment>
  );
}
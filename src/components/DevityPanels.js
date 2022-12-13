import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configData from "../config.json";
import Widget from './Widgets';
import WidgetActions from './WidgetActions';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_add from "../img/btn_add.png";
import Editable from './Editable';
import $ from "jquery";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels() 
{
  const [widgetObject, setWidgetObject] = useState({});
  const inputRef = useRef();

  useEffect(() => {
    async function fetchData() {
      await axios.get(devity_api + '/api/widgets')
        .then((res) => {
            if (res.status === 401) window.location.replace(sso_url);

            setWidgetObject(res.data);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);


  async function onAddNewWidget(widgetType, widgetList) {
    let newName = (widgetList.length+1).toString();

    let jsonContentObject = PrepareWidgetContentObject(widgetType);

    const newWidget = {
        key: widgetList.length+1,
        w_content: JSON.stringify(jsonContentObject),
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

  function PrepareWidgetContentObject(type) {
    let jsonObj = [];
    let contentItem = {};

    switch (type) {
      case "CLIPBOARD":
        contentItem[type.toString()] = [];  //format: "{ CLIPBOARD: [ "string1", "string2" ] }"
        jsonObj.push(contentItem);
        return jsonObj;
      case "NOTES":
        contentItem[type.toString()] = [];  //format: "{ NOTES: [ "string1", "string2" ] }"
        jsonObj.push(contentItem);
        return jsonObj;
      case "LINKS":
        contentItem["hyperLink"] = "";
        contentItem["displayName"] = ""; //format: "{ "hyperLink": "noladigital.net", "displayName": "NOLA" }"
        jsonObj.push(contentItem);
        return jsonObj;
      default:
        break;
    }
  }

  async function createWidget(postBody, newWidgetArray, type) {
    delete postBody["key"];
    $('div[data-panel=' + type + '] .gear').addClass('rotate');
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
              $('div[data-panel=' + type + '] .gear').removeClass('rotate');
              console.log("Created " + type + " widget.")
          })
          .catch(err => console.log(err));
  }

  function handleTitleChange(newValue, currentWidget) {
    widgetObject[currentWidget.w_type].find(w => w.id === currentWidget.id).name = newValue;
    setWidgetObject({
      ...widgetObject
    });
  }

  return (
    <React.Fragment>
      {
        Object.entries(widgetObject).map( ([key,value], index) => {

          return (
            <div key={index} className="p-panel" data-panel={key}>
              <div className='p-chrome'>
                <img src={btn_image_config} className="gear" alt="devity gear"/>
                <span className="p-title">{key}</span>
                <img className='add-btn' src={btn_add} onClick={()=>onAddNewWidget(key, value)} alt="devity widget"/>
              </div>
              <div className='p-contents'>
              
              {
                value.map((w, index) => {
                  return (
                    <div key={index} className="w-container">
                      <div className='w-chrome'>
                          <Editable text={w.name} placeholder="Enter a name for widget" inputType="input" childInputRef={inputRef}>
                              <input
                                ref={inputRef}
                                style={{ width: 130 }}
                                type="text"
                                name="widgetTitle"
                                placeholder="Enter a name for widget"
                                value={w.name}
                                onChange={e => handleTitleChange(e.target.value, w)}
                              />
                          </Editable>
                      </div>
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
            </div>
          )
        })
      }
    </React.Fragment>
  );
}
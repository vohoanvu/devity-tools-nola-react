import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configData from "../config.json";
import Widget from './Widgets';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_add from "../img/btn_add.png";
import $ from "jquery";
import { log } from '../Utilities';
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';

const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels(props) 
{
  const [widgetObject, setWidgetObject] = useState({});
  const inputRef = useRef();
  const [isReadyToSave, setIsReadyToSave] = useState({
    isReadyToSave: false,
    putBody: {},
    type: ""
  });

  useEffect(() => {
    async function fetchData() {
      await axios.get(devity_api + '/api/widgets').then((res) => {
            if (res.status === 401) window.location.replace(sso_url);

            console.log("Get panels data");
            console.log(res.data);
            setWidgetObject(res.data);
        })
        .then(result => props.signalAllPanelRendered(true))
        .catch((err) => console.log(err));
    };

    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    createWidget(newWidget, widgetType);
  }

  function PrepareWidgetContentObject(type) {
    let jsonObject = {};

    switch (type) {
      case "CLIPBOARD": //format: "{ CLIPBOARD: [ "string1", "string2" ] }"
        jsonObject["CLIPBOARD"] = [];
        return jsonObject;
      case "NOTES":
        jsonObject["NOTES"] = "<p></p>"; //format: "{ NOTES: "<p>html-encoded-string-from-TINY-editor</p>" }"
        return jsonObject;
      case "LINKS":
        let jsonObjList = [];
        jsonObject["hyperLink"] = "";
        jsonObject["displayName"] = ""; //format: "[{ "hyperLink": "noladigital.net", "displayName": "NOLA" }]"
        jsonObjList.push(jsonObject);
        return jsonObjList;
      default:
        break;
    }
  }

  async function createWidget(postBody, type) {
    delete postBody["key"];
    $('div[data-panel=' + type + '] .gear').addClass('rotate');
    await axios.post(devity_api + "/api/widgets/", { ...postBody })
          .then(response => {
            return response.data
          })
          .then(result => {
              postBody["id"] = result.id;
              widgetObject[type].splice(0, 0, postBody);
              setWidgetObject({...widgetObject});
              $('div[data-panel=' + type + '] .gear').removeClass('rotate');
              log("Created " + type + " widget.")
          })
          .catch(err => console.log(err));
  }

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

  async function sendPUTContentFromChildToParent(widget, setWidgetState, currentContent) {  
    let putBody = {};
    
    switch (widget.w_type)
    {
      case "CLIPBOARD":
        putBody = widget;
        break;

      case "LINKS":
        putBody = widget;
        break;

      case "NOTES":
        const jsonObj = {};
        jsonObj[widget.w_type] = currentContent;
        putBody = {
          ...widget,
          w_content: JSON.stringify(jsonObj)
        };

        break;
      default:
        break;
    }

    setIsReadyToSave({
      isReadyToSave: true,
      putBody: putBody,
      type: widget.w_type
    });
  }

  function renderIndividualWidget(widget) 
  {
    const mostRecentView = props.mostRecentPanel === 'ALL' ? null : props.mostRecentPanel;
    switch (widget.w_type)
    {
      case "CLIPBOARD":
        return <WidgetClipboard widget={widget} sendContentFromChildToParent={sendPUTContentFromChildToParent} mostRecentView={mostRecentView}/>;
  
      case "LINKS":
        return <WidgetLink widget={widget} sendContentFromChildToParent={sendPUTContentFromChildToParent} mostRecentView={mostRecentView}/>;
  
      case "NOTES":
        return <WidgetNote widget={widget} sendContentFromChildToParent={sendPUTContentFromChildToParent} mostRecentView={mostRecentView}/>;
  
      default:
        return <div className="w-container">LOADING...</div>;
    }

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
                <img className='add-btn' src={btn_add} onClick={()=>onAddNewWidget(key, value)} alt="create widget"/>
              </div>
              <div className='p-contents'>

              {
                value.map((w, index) => {
                  return (
                    <div key={index} className="w-container">
                      <Widget
                        widget={w}
                        setWidgetObjState={setWidgetObject}
                        widgetObjState={widgetObject}
                        inputRef={inputRef}
                        callPUTRequest={updateWidgetRequest}
                        isReadyToSave={isReadyToSave}
                      />
                      { renderIndividualWidget(w) }
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
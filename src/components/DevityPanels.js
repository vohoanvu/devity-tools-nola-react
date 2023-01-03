import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import CONFIG from "../config.json";
import Widget from './WidgetActions';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_add from "../img/btn_add.png";
import $ from "jquery";
import { log } from '../Utilities';
import W_Note from './WidgetNotes';
import W_Link from './WidgetLinks';
import W_Clipboard from './WidgetClipboard';
import { UserContext } from "../api-integration/UserContext";

const sso_url = CONFIG.SSO_URL;
const devity_api = CONFIG.DEVITY_API;

export default function DevityPanels(props) 
{
  const [wObject, setWObject] = useState({});
  const inputRef = useRef();
  const [isReadyToSave, setIsReadyToSave] = useState({
    isReadyToSave: false,
    putBody: {},
    type: ""
  });
  const [dirtyNote, setDirtyNote] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      await axios.get(devity_api + '/api/widgets').then((res) => {
            if (res.status === 401) window.location.replace(sso_url);

            console.log("Get panels data");
            console.log(res.data);
            setWObject(res.data);
        })
        .then(result => props.signalAllPanelRendered(true))
        .catch((err) => console.log(err));
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function w_add(widgetType, widgetList) {
    let newName = (widgetList.length+1).toString();

    let jsonContentObject = init_w_content(widgetType);

    const newWidget = {
        key: widgetList.length+1,
        w_content: JSON.stringify(jsonContentObject),
        name: "TEST Widget " + newName,
        order: widgetList.length+1,
        w_type: widgetType,
        height : 300,
        width: 300
    }

    w_create(newWidget, widgetType);
  }

  function init_w_content(type) {
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

  async function w_create(postBody, type) {
    delete postBody["key"];
    $('div[data-panel=' + type + '] .gear').addClass('rotate');
    await axios.post(devity_api + "/api/widgets/", { ...postBody })
          .then(response => {
            return response.data
          })
          .then(result => {
              postBody["id"] = result.id;
              wObject[type].splice(0, 0, postBody);
              setWObject({...wObject});
              $('div[data-panel=' + type + '] .gear').removeClass('rotate');
              log("Created " + type + " widget.")
          })
          .catch(err => console.log(err));
  }

  async function w_update(putBody, type) {
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

  async function sendPUTContentToParent(widget, setWidgetState, currentContent) {  
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

  function w_render(widget) 
  {
    const widgetType = userContext.activePanel;
    switch (widget.w_type)
    {
      case "CLIPBOARD":
        return <W_Clipboard 
          widget={widget} 
          sendContentToParent={sendPUTContentToParent}
          activePanel={widgetType}/>;
  
      case "LINKS":
        return <W_Link 
          widget={widget} 
          sendContentToParent={sendPUTContentToParent}
          activePanel={widgetType}/>;
  
      case "NOTES":
        return <W_Note 
          widget={widget} 
          sendContentToParent={sendPUTContentToParent} 
          setDirtyNote={setDirtyNote}
          isDirty={dirtyNote}
          activePanel={widgetType}/>;
  
      default:
        return <div className="w-container">LOADING...</div>;
    }

  }

  return (
    <React.Fragment>
      {
        Object.entries(wObject).map( ([key,value], index) => {
          return (
            <div key={index} className="p-panel" data-panel={key}>
              <div className='p-chrome'>
                <img src={btn_image_config} className="gear" alt="devity gear"/>
                <span className="p-title">{key}</span>
                <img className='add-btn' src={btn_add} onClick={()=>w_add(key, value)} alt="create widget"/>
              </div>
              <div className='p-contents'>

              {
                value.map((w, index) => {
                  return (
                    <div key={index} className="w-container">
                      <Widget
                        widget={w}
                        setWidgetObjState={setWObject}
                        widgetObjState={wObject}
                        inputRef={inputRef}
                        callPUTRequest={w_update}
                        isReadyToSave={isReadyToSave}
                      />
                      { w_render(w) }
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
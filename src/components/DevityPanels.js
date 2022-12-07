import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels(props) 
{
  const [linkWidgets, setLinkWidgets] = useState([]);
  const [noteWidgets, setNoteWidgets] = useState([]);
  const [clipboardWidgets, setClipboardWidgets] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await axios.get(devity_api + '/api/widgets')
        .then((res) => {
            if (res.status === '401') window.location.replace(sso_url);

            setLinkWidgets(res.data["LINKS"]);
            setNoteWidgets(res.data["NOTES"]);
            setClipboardWidgets(res.data["CLIPBOARD"]);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);


  function onAddNewWidget(widgetType, widgetList) {
    let newName = (widgetList.length+1).toString();

    const newWidget = {
        key: widgetList.length+1,
        w_content: "{}",
        name: "TEST Widget " + newName,
        order: widgetList.length+1,
        w_type: widgetType,
        height : 300,
        width: 300
    }
    const newWidgetList = [...widgetList];
    newWidgetList.splice(0, 0, newWidget);

    switch (widgetType) {
      case "CLIPBOARD":
        setClipboardWidgets(newWidgetList);
        //TODO: POSTing api/widgets here
        createWidget(newWidget);
        break;
      case "NOTES":
        setNoteWidgets(newWidgetList);
        //TODO: POSTing api/widgets here
        createWidget(newWidget);
        break;
      case "LINKS":
        setLinkWidgets(newWidgetList);
        //TODO: POSTing api/widgets here
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
    </React.Fragment>
  );
}



/*<React.Fragment>
  {
    Object.entries(widgetList).map( ([key,value], index) => {
      return (
        <WidgetList
          key={index}
          widgetType={key}
          widgetArray={value}
          setWidgetListState={setWidgetList}
        />
      );
    })
  }
</React.Fragment> */
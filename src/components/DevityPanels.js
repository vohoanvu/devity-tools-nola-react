import React, { useEffect, useState } from 'react';
//import Widget from './Widgets';
import axios from 'axios';
import configData from "../config.json";
import WidgetNote from './w_note';
import WidgetLink from './w_links';
import WidgetClipboard from './w_clipboard';

const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function DevityPanels(props) 
{
  const [linkWidgets, setLinkWidgets] = useState([]);
  const [noteWidgets, setNoteWidgets] = useState([]);
  const [clipboardWidgets, setClipboardWidgets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await axios.get(devity_api + '/api/widgets')
      .then((res) => {
          if (res.status === '401') window.location.replace(sso_url);

          setLinkWidgets(GetLinkWidgets(res.data));
          setNoteWidgets(GetNoteWidgets(res.data));
          setClipboardWidgets(GetClipboardWidgets(res.data));
      })
      .catch((err) => console.log(err));
  };

  function GetLinkWidgets(responseDictObject) {
    let result = [];
    Object.entries(responseDictObject).map( ([key, value]) => {
        if (key === "LINKS")
          result = value;
    });
    return result;
  }

  function GetNoteWidgets(responseDictObject) {
    let result = [];
    Object.entries(responseDictObject).map( ([key, value]) => {
        if (key === "NOTES")
          result = value;
    });
    return result;
  }

  function GetClipboardWidgets(responseDictObject) {
    let result = [];
    Object.entries(responseDictObject).map( ([key, value]) => {
        if (key === "CLIPBOARD")
          result = value;
    });
    return result;
  }

  return (
    <React.Fragment>
      <div className="w-panel">
          <span className="w-panel-title">CLIPBOARD</span>
          <WidgetClipboard clipboardWidgets={clipboardWidgets} setClipboardWidgets={setClipboardWidgets}/>
      </div>
      <div className="w-panel">
          <span className="w-panel-title">NOTES</span>
          <WidgetNote noteWidgets={noteWidgets} setNoteWidgets={setNoteWidgets}/>
      </div>
      <div className="w-panel">
          <span className="w-panel-title">LINKS</span>
          <WidgetLink linkWidgets={linkWidgets} setLinkWidgets={setLinkWidgets}/>
      </div>
    </React.Fragment>
  );

  // return (
  //   <div>
  //     {
  //       Object.entries(panels).map( ([key, value], index) => {
          
          
  //       })
  //     }
  //   </div>
  // );
}
//{ value.map((i) => <Widget key={i.id} widget={i} RerenderPanels={fetchData}/> ) }

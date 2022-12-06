import React, { useEffect, useState } from 'react';
import WidgetNote from './w_note';
import WidgetLink from './w_links';
import WidgetClipboard from './w_clipboard';
import axios from 'axios';
import configData from "../config.json";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  const [w_type, setWidgetType] = useState("");

  useEffect(() => {
      setWidgetType(props.widget.w_type);
  }, [props.widget.w_type]);

  // async function getWidgetById(w_id, widgetStateSetter) {
  //   await axios.get(devity_api + '/api/widgets/'+ w_id)
  //       .then((res) => {
  //           if (res.status === '401') window.location.replace(sso_url);

  //           widgetStateSetter(res.data);
  //   })
  //   .catch((err) => console.log(err));
  // }

  switch (w_type) {
    case "CLIPBOARD":
      return (<React.Fragment>
                <WidgetClipboard 
                    w_id={props.widget.id} 
                    w_type={w_type} 
                    w_name={props.widget.name} 
                    rerenderPanels={props.RerenderPanels}/>
              </React.Fragment>);
    case "LINKS":
      return (<React.Fragment>
                <WidgetLink 
                  w_id={props.widget.id} 
                  w_type={w_type} 
                  w_name={props.widget.name} 
                  rerenderPanels={props.RerenderPanels}/>
              </React.Fragment>);
    case "NOTES":
      return (<React.Fragment>
                <WidgetNote 
                  w_id={props.widget.id} 
                  w_type={w_type} 
                  w_name={props.widget.name} 
                  rerenderPanels={props.RerenderPanels}/>
              </React.Fragment>);
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }
}

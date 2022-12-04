import React, { useEffect, useState } from 'react';
import WidgetNote from './w_note';
import WidgetLink from './w_links';
import WidgetClipboard from './w_clipboard';
import configData from "../config.json";
import axios from 'axios';
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  const [w_type, setWidgetType] = useState("");

  useEffect(() => {
      setWidgetType(props.widget.w_type);
  }, [props.widget.w_type]);


  async function RerenderWidgets() {
    await axios.get(devity_api + '/api/widgets')
      .then((res) => {
        props.RerenderPanels(res.data);
      })
      .catch((err) => console.log(err));
  }

  switch (w_type) {
    case "CLIPBOARD":
      return (<React.Fragment>
                <WidgetClipboard w_id={props.widget.id} w_type={w_type} w_name={props.widget.name} rerenderWidgets={RerenderWidgets}/>
              </React.Fragment>);
    case "LINKS":
      return (<React.Fragment>
                <WidgetLink w_id={props.widget.id} w_type={w_type} w_name={props.widget.name} rerenderWidgets={RerenderWidgets}/>
              </React.Fragment>);
    case "NOTES":
      return (<React.Fragment>
                <WidgetNote w_id={props.widget.id} w_type={w_type} w_name={props.widget.name} rerenderWidgets={RerenderWidgets}/>
              </React.Fragment>);
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }
}

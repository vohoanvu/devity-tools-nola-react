import * as React from "react";
import configData from "../config.json";
import axios from 'axios';
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';
import $ from "jquery";
const devity_api = configData.DEVITY_API;

export default function Widget(props) 
{
  const [widgetType, setWidgetType] = React.useState("");

  React.useEffect(() => {
    setWidgetType(props.widget.w_type);
  }, [props.widget.w_type]);

  async function updateWidgetRequest(putBody, type) {
    delete putBody["key"];
    $('div[data-panel=' + type + '] .gear').addClass('rotate');
    const result = await axios.put(devity_api + "/api/widgets/", { ...putBody })
          .then(response => {
            return response.data
          })
          .then(result => {
              $('div[data-panel=' + type + '] .gear').removeClass('rotate');
              return result;
          })
          .catch(err => console.log(err));

    return result;
  }

  switch (widgetType)
  {
    case "CLIPBOARD":
      return (<WidgetClipboard widget={props.widget} callPUTRequest={updateWidgetRequest}/>);

    case "LINKS":
      return (<WidgetLink widget={props.widget} callPUTRequest={updateWidgetRequest}/>);

    case "NOTES":
      return (<WidgetNote widget={props.widget} callPUTRequest={updateWidgetRequest}/>);

    default:
      return <div className="w-container">NOTHING HERE</div>;
  }

}

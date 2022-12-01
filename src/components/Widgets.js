import React, { useEffect, useState } from 'react';
import WidgetNote from './w_note';
import WidgetLink from './w_links';
import WidgetClipboard from './w_clipboard';

export default function Widget(props) 
{
  const [w_type, setWidgetType] = useState("");

  useEffect(() => {
      setWidgetType(props.widget.w_type);
  }, [props.widget.w_type]);


  switch (w_type) {
    case "LINKS":
      return <WidgetClipboard w_id={props.widget.id} w_type={w_type} w_name={props.widget.name}/>;
    case "CLIPBOARD":
      return <WidgetLink w_id={props.widget.id} w_type={w_type} w_name={props.widget.name}/>;
    case "NOTES":
      return <WidgetNote w_id={props.widget.id} w_type={w_type} w_name={props.widget.name}/>;
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }
}

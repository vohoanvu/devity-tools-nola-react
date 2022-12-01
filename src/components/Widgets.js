import React, { useEffect, useState } from 'react';
import W_Note from './w_note';
import W_Link from './w_links';
import W_Clipboard from './w_clipboard';

export default function Widget(props) 
{
  const [w_type, setWidgetType] = useState("");

  useEffect(() => {
      setWidgetType(props.widget.w_type);
  }, []);


  switch (w_type) {
    case "LINKS":
      return <W_Clipboard w_id={props.widget.id} w_type={w_type} w_name={props.widget.name}/>;
    case "CLIPBOARD":
      return <W_Link w_id={props.widget.id} w_type={w_type} w_name={props.widget.name}/>;
    case "NOTES":
      return <W_Note w_id={props.widget.id} w_type={w_type} w_name={props.widget.name}/>;
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }
}

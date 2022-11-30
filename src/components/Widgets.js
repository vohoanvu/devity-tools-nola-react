import React, { useEffect, useState } from 'react';

export default function Widget(props) 
{
  //const [w_type, setWidgetType] = useState("");

  useEffect(() => {
      //console.log(props.widget, 2222);
  }, []);

  let widgetContainerStyle = {
    height: props.widget.height,
    width: props.widget.width
  };

  return (
    <div className="w-container" style={widgetContainerStyle}>
      <span className="w-container-title">Widget Type : {props.widget.w_type}</span>
      <span className="w-container-title">Width : {props.widget.width}</span>
      <span className="w-container-title">Height : {props.widget.height}</span>
    </div>
  );
}

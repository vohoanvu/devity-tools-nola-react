import React, { useEffect, useState } from 'react';
import Widget from './Widgets';
// import Draggable from 'react-draggable';

export default function Panels(props) 
{

  useEffect(() => {
  }, []);


  return(
    <div>
      {
        Object.entries(props.PanelsObject).map( ([key, value], index) => {
          
          return (
            <div key={index} className="w-panel">
                <span className="w-panel-title">{key}</span>
                { value.map((i) => <Widget key={i.id} widget={i}></Widget> ) }
            </div>
          );
        })
      }
    </div>
  );

}

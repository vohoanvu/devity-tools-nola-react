import React from 'react';
import Widget from './Widgets';

export default function Panels(props) 
{
  return(
    <div>
      {
        Object.entries(props.PanelsObject).map( ([key, value], index) => {
          
          return (
            <div key={index} className="w-panel">
                <span className="w-panel-title">{key}</span>
                { value.map((i) => <Widget key={i.id} widget={i} RerenderPanels={props.SetPanels}></Widget> ) }
            </div>
          );
        })
      }
    </div>
  );

}

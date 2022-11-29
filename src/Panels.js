import * as React from "react";
import { Widget } from "./Widgets";
// import Draggable from 'react-draggable';


export default ({ panels }) => (

<div>
  {
    Object.entries(panels)
    .map( ([key, value]) => 
    
    <div className="w-panel">
        <span className="w-panel-title">{key}</span>
        
        {value.map((i) => (

             <div className="w-container">
                <span className="w-container-title">NOTE: {i.name}</span>
                
             </div>
          ))
        }

    </div>
    
    )
  }
</div>

);

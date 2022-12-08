import * as React from "react";
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';
import WidgetActions from './WidgetActions';

export default function Widget(props) 
{
  const [widgetType, setWidgetType] = React.useState("");

  React.useEffect(() => {
    setWidgetType(props.widget.w_type);
  }, []);

  switch (widgetType) {
    case "CLIPBOARD":
      return (
        <React.Fragment>
              <div className="w-container">
                <span className="w-container-title">Widget Name: {props.widget.name}</span>
                <WidgetClipboard 
                  widget={props.widget} />
                <WidgetActions 
                  widgetId={props.widget.id} 
                  setWidgetObjState={props.setWidgetObjState}
                  widgetObjState={props.widgetObjState}/>
              </div>
        </React.Fragment>
      );

    case "LINKS":
      return (
        <React.Fragment>
              <div className="w-container">
                <span className="w-container-title">Widget Name: {props.widget.name}</span>
                <WidgetLink 
                  widget={props.widget} />
                <WidgetActions 
                  widgetId={props.widget.id} 
                  widgetType={props.widget.w_type}
                  setWidgetObjState={props.setWidgetObjState}
                  widgetObjState={props.widgetObjState}/>
              </div>
        </React.Fragment>
      );
      
    case "NOTES":
      return (
        <React.Fragment>
              <div className="w-container">
                <span className="w-container-title">Widget Name: {props.widget.name}</span>
                <WidgetNote widget={props.widget} />
                <WidgetActions 
                  widgetId={props.widget.id} 
                  setWidgetObjState={props.setWidgetObjState}
                  widgetObjState={props.widgetObjState}/>
              </div>
        </React.Fragment>
      );
                
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }

}

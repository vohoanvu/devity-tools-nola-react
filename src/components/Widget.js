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
  }, [props.widget.w_type]);

  switch (widgetType) {
    case "CLIPBOARD":
      return (
        <React.Fragment>
          <WidgetClipboard 
            widget={props.widget} />
          <WidgetActions 
            widgetId={props.widget.id} 
            widgetType={props.widget.w_type}
            setWidgetObjState={props.setWidgetObjState}
            widgetObjState={props.widgetObjState}/>
        </React.Fragment>
      );

    case "LINKS":
      return (
        <React.Fragment>
          <WidgetLink 
            widget={props.widget} />
          <WidgetActions 
            widgetId={props.widget.id} 
            widgetType={props.widget.w_type}
            setWidgetObjState={props.setWidgetObjState}
            widgetObjState={props.widgetObjState}/>
        </React.Fragment>
      );
      
    case "NOTES":
      return (
        <React.Fragment>
          <WidgetNote widget={props.widget} />
          <WidgetActions 
            widgetId={props.widget.id} 
            widgetType={props.widget.w_type}
            setWidgetObjState={props.setWidgetObjState}
            widgetObjState={props.widgetObjState}/>
        </React.Fragment>
      );
                
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }

}

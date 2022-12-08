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
        </React.Fragment>
      );

    case "LINKS":
      return (
        <React.Fragment>
          <WidgetLink 
            widget={props.widget} />
        </React.Fragment>
      );
      
    case "NOTES":
      return (
        <React.Fragment>
          <WidgetNote widget={props.widget} />
        </React.Fragment>
      );
                
    default:
      return <div className="w-container">NOTHING HERE</div>;
  }

}

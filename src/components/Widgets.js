import * as React from "react";
import WidgetNote from './WidgetNotes';
import WidgetLink from './WidgetLinks';
import WidgetClipboard from './WidgetClipboard';

export default function Widget(props) 
{
  const [widgetType, setWidgetType] = React.useState("");

  React.useEffect(() => {
    setWidgetType(props.widget.w_type);
  }, [props.widget.w_type]);

  switch (widgetType) 
  {
    case "CLIPBOARD":
      return (<WidgetClipboard widget={props.widget} />);

    case "LINKS":
      return (<WidgetLink widget={props.widget} />);

    case "NOTES":
      return (<WidgetNote widget={props.widget} />);

    default:
      return <div className="w-container">NOTHING HERE</div>;
  }

}

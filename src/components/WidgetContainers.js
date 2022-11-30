import * as React from "react";

export default ([widgets]) => (

<div>

  {widgets.map((i) => (
            <span>{i.name}</span>
          ))
    }

</div>

);

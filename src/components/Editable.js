import React, { useEffect, useState } from "react";

export default function Editable({
    displayText,
    inputType,
    placeholder,
    children,
    childInputRef,
    passFromChildToParent,
    ...props
})
{
    const [isEditing, setEditing] = useState(false);
    
    useEffect(()=> {
        if (childInputRef && childInputRef.current && isEditing === true) {
            childInputRef.current.focus();
        }
    },[isEditing, childInputRef]);

    const handleKeyDown = (event, type) => {
        const { key } = event;
        const keys = ["Escape", "Tab"]; // use this array to check for <textarea/> inputType
        const enterKey = "Enter";
        const allKeys = [...keys, enterKey];

        if (type !== "textarea" && allKeys.indexOf(key) > -1) {
            setEditing(false);
            passFromChildToParent(event.target);
        }
    };

    function handleInputOnBlur(e) {
        setEditing(false);
        passFromChildToParent(e.target);
    }

    return (
        <div style={{ display: 'inline-block' }} {...props}>
            {
                isEditing ? (
                    <div onBlur={(e)=> handleInputOnBlur(e)} onKeyDown={(e)=>handleKeyDown(e, inputType)}>
                        {children}
                    </div>
                ) : (
                    <div onClick={()=>setEditing(true)}>
                        { displayText }
                    </div>
                )
            }
        </div>
    );
}
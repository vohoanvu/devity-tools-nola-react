import React, { useEffect, useState } from "react";

export default function Editable({
    displayText,
    inputType,
    placeholder,
    children,
    childInputRef,
    passFromChildToParent,
    styling,
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
        const allKeys = ["Escape", "Tab", "Enter"];
        if (key === "Tab") {
            event.preventDefault();
        }

        if (type !== "textarea" && allKeys.indexOf(key) > -1) {
            handleInputOnBlur(event);
        }
    };

    function handleInputOnBlur(e) {
        setEditing(false);
        passFromChildToParent(e.target);
    }

    return (
        <div className="w-input-txt" style={styling} {...props}>
            {
                isEditing ? (
                    <div onBlur={(e)=> handleInputOnBlur(e)} onKeyDown={(e)=>handleKeyDown(e, inputType)} role="button" aria-hidden>
                        {children}
                    </div>
                ) : (
                    <div onClick={()=>setEditing(true)} role="button" aria-hidden>
                        { displayText }
                    </div>
                )
            }
        </div>
    );
}
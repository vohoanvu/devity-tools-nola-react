import React, { useEffect, useState } from "react";

export default function Editable({
    text,
    inputType,
    placeholder,
    children,
    childInputRef,
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
        const keys = ["Escape", "Tab"];
        const enterKey = "Enter";
        const allKeys = [...keys, enterKey]; // All keys array

        if (type !== "textarea" && allKeys.indexOf(key) > -1)   setEditing(false);
    };

    return (
        <section {...props}>
            {
                isEditing ? (
                    <div onBlur={()=> setEditing(false)} onKeyDown={(e)=>handleKeyDown(e, inputType)}>
                        {children}
                    </div>
                ) : (
                    <div onClick={()=>setEditing(true)}>
                        <span>{text || placeholder || "Editable Content"}</span>
                    </div>
                )
            }
        </section>
    );
}
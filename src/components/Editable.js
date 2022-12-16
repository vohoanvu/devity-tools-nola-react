import React, { useEffect, useState } from "react";
import btn_add from "../img/btn_add.png";

export default function Editable({
    text,
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
            passFromChildToParent(event.target.value);
        }
    };

    function handleInputOnBlur(e) {
        setEditing(false);
        passFromChildToParent(e.target.value);
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
                        <img style={{ width: '10px', height: '10px'}} className='add-btn' src={btn_add} alt="create widget"/>
                        <span>{text || placeholder || "Editable Content"}</span>
                    </div>
                )
            }
        </div>
    );
}
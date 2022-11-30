//props.w_type
import React, { useEffect, useState } from 'react';

export default function Note(props)
{
    //const [notes, setNotes] = useState([]);

    useEffect(() => {
    }, []);

    return(
        <div className="w-container">
            <span className="w-container-title">Widget Type : {props.w_type}</span>
            <span className="w-container-title">Widget Name : {props.w_name}</span>
        </div>
    );
}
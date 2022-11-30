//props.w_type
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const webhost = window.location.origin;


export default function Note(props)
{
    const [notes, setNotes] = useState([]);

    useEffect(() => {

    }, []);

    return(
        <div class="w-container">
            <span className="w-container-title">{props.w_type}</span>
        </div>
    );
}
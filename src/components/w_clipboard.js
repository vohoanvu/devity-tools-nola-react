import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Links(props)
{
    const [clipboardWidget, setClipBoardWidget] = useState({});

    useEffect(() => {
        getWidgetById(props.w_id)
    }, []);

    async function getWidgetById(w_id) {
        await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                setClipBoardWidget(res.data);
        })
        .catch((err) => console.log(err));
    }

    return(
        <div className="w-container">
            <span className="w-container-title">Widget Type : {clipboardWidget.w_type}</span>
            <span className="w-container-title">Widget Name : {clipboardWidget.name}</span>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Links(props)
{
    const [link, setLink] = useState({});
    const [linkContent, setLinkContent] = useState({
        hyperLink: "",
        displayName: ""
    });
    const [displayLinks, setDisplayLinks] = useState([]);

    useEffect(() => {
        (async () => {
            const widget = await getWidgetContentById(props.widget.id);

            const contentArray = JSON.parse(widget.w_content);

            const currentWidget = {
                ...widget,
                w_content: contentArray
            }

            setLink(currentWidget);
            setDisplayLinks(currentWidget.w_content);
        })();

    }, [props.widget]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                return res.data;
        }).then(result => result)
        .catch((err) => console.log(err));
    }

    function onSaveNewLink() {
        const currentDisplay = [...displayLinks];
        currentDisplay.splice(0, 0, linkContent);
        setDisplayLinks(currentDisplay);

        updateLinkContentInDb(link, currentDisplay);
    }

    async function updateLinkContentInDb(currentLink, linkContentList) {
        const putBody = {
            ...currentLink,
            w_content: JSON.stringify(linkContentList)
        }

        await props.callPUTRequest(putBody, currentLink.w_type);
    }


    function handleLinkChange(evt) {
        const value = evt.target.value;
        setLinkContent({
            ...linkContent,
            [evt.target.name]: value
        })
    }

    return (
        <div className='widget'>
            <form id="contentForm">
                <label>
                    Url: 
                    <input 
                        value={linkContent.hyperLink} 
                        type="text" 
                        name="hyperLink"
                        onChange={handleLinkChange}/>
                </label>
                <label>
                    Title: 
                    <input 
                        value={linkContent.displayName} 
                        type="text" 
                        name="displayName"
                        onChange={handleLinkChange}/>
                </label>
                <button type='button' value="Submit" onClick={onSaveNewLink}>Save</button>
            </form>
            {
                Object.entries(displayLinks).map((item, index) => 
                    <li key={index}><a href={item.hyperLink}>{item.displayName}</a></li> )
            }
        </div>
    );
}

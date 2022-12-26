import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import { format_link } from '../Utilities'



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

            const contentArray = JSON.parse(widget.w_content)
            .filter(item => item.hyperLink.length !== 0 && item.displayName.length !== 0);

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

                console.log("Get LINKS widget");
                console.log(res.data);
                return res.data;
        }).then(result => result)
        .catch((err) => console.log(err));
    }

    function onSaveNewLink() {
        displayLinks.splice(0, 0, linkContent);
        setDisplayLinks([...displayLinks]);

        updateLinkContentInDb();
    }

    async function updateLinkContentInDb() {
        const putBody = {
            ...link,
            w_content: JSON.stringify(link.w_content)
        }

        await props.callPUTRequest(putBody, link.w_type);
    }


    function handleLinkChange(evt) {
        const value = evt.target.value;
        setLinkContent({
            ...linkContent,
            [evt.target.name]: value
        })
    }

    return (
        <div className='widget w-links'>
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
                <button id='LinkContentSaving' type='button' value="Submit" onClick={onSaveNewLink}>Save</button>
            </form>
            <ul>
            {
                displayLinks.map((item, index) => {
                    return <li key={index}><a className='filterable' target="_blank" href={format_link(item.hyperLink)}>{item.displayName}</a></li>;
                })
            }
            </ul>
        </div>
    );
}

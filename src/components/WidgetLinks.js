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
        hyperLink: "www.noladigital.com",
        displayName: "NOLA Digital"
    });
    const [displayLinks, setDisplayLinks] = useState([]);

    useEffect(() => {
        (async () => {
            const content = await getWidgetContentById(props.widget.id);
            const contentArray = JSON.parse(content);
            const currentWidget = {
                ...props.widget,
                w_content: contentArray
            }

            setLink(currentWidget);
        })();

    }, [props.widget]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                return res.data.w_content;
        }).then(result => result)
        .catch((err) => console.log(err));
    }

    function onAddNewLink() {
        const currentDisplay = [...displayLinks];
        currentDisplay.splice(0, 0, linkContent);
        setDisplayLinks(currentDisplay);
    }

    function onSaveLink() {
        console.log("on saving Link Wiget Content...", link.w_content);
        console.log("on saving Current Display Links...", displayLinks);
    }

    function handleChange(evt) {
        const value = evt.target.value;
        setLinkContent({
            ...linkContent,
            [evt.target.name]: value
        })
    }

    return (
        <div className='widget'>
            {
                displayLinks.map((item, index) => 
                    <li key={index}><a href={item.hyperLink}>{item.displayName}</a></li> )
            }
            <form id="linkForm">
                <label>
                    Link Url: 
                    <input 
                        value={linkContent.hyperLink} 
                        type="text" 
                        name="hyperLink"
                        onChange={handleChange}/>
                </label>
                <label>
                    Display Name: 
                    <input 
                        value={linkContent.displayName} 
                        type="text" 
                        name="displayName"
                        onChange={handleChange}/>
                </label>
                <button type='button' value="Submit" onClick={onAddNewLink}>Add Link</button>
                <button type='button' value="Submit" onClick={onSaveLink}>Save Link</button>
            </form>
        </div>
    );
}

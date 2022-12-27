import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/buttons.css';
import { format_link } from '../Utilities'
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;



export default function Links(props)
{
    const [links, setLinks] = useState({
        inputLink: "",
        inputTitle: "",
        displayList: []
    });

    useEffect(() => {
        async function fetchWidgetContent() {
            const widget = await getWidgetContentById(props.widget.id);

            const contentArray = JSON.parse(widget.w_content)
            .filter(item => item.hyperLink.length !== 0 && item.displayName.length !== 0);

            setLinks({
                ...links,
                displayList: contentArray
            });

            return links;
        };

        fetchWidgetContent();
        
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

    function onSaveNewLinkHandler() {
        const newLink = {
            hyperLink: links.inputLink,
            displayName: links.inputTitle
        }
        links.displayList.splice(0, 0, newLink);
        setLinks({
            ...links,
            displayList: links.displayList
        });

        //updateLinkContentInDb();
        props.passContentToParent(links.displayList, "LINKS");
    };

    // async function updateLinkContentInDb(widget, displayList) {
    //     console.log('is clicked yet', 111111)
    //     const putBody = {
    //         ...widget,
    //         w_content: JSON.stringify(displayList)
    //     }
    //     await props.callPUTRequest(putBody, widget.w_type);
    // }


    function handleLinkChange(evt) {
        const value = evt.target.value;
        setLinks({
            ...links,
            [evt.target.name]: value
        });
    }
    
    return (
        <React.Fragment>
            <div className='widget w-links'>
                <form id="contentForm">
                    <label>
                        Url: 
                        <input 
                            value={links.inputLink} 
                            type="text" 
                            name="inputLink"
                            onChange={handleLinkChange}/>
                    </label>
                    <label>
                        Title: 
                        <input 
                            value={links.inputTitle} 
                            type="text" 
                            name="inputTitle"
                            onChange={handleLinkChange}/>
                    </label>
                </form>
                <button className='btn btn-primary' onClick={onSaveNewLinkHandler}>Save</button>
                <ul>
                {
                    links.displayList?.map((item, index) => {
                        return <li key={index}><a className='filterable' target="_blank" href={format_link(item.hyperLink)} rel="noreferrer">{item.displayName}</a></li>;
                    })
                }
                </ul>
            </div>
        </React.Fragment>        
    );
}

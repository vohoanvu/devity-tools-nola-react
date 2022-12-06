import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import btn_delete from "../img/cntrl_delete.jpg";
import { UserContext } from "../api-integration/UserContext";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;


export default function Links(props)
{
    const [linkList, setLinkList] = useState([]);
    const user = React.useContext(UserContext);

    useEffect(() => {
        let linksWithContent = props.linkWidgets.map(async (w, index) => {

            return {
                key: index,
                ...w, 
                w_content: await getWidgetContentById(w.id)
            };
        });

        Promise.all(linksWithContent).then(result => setLinkList(result) );
    }, [props.linkWidgets]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                return res.data.w_content;
        }).then(result => result)
        .catch((err) => console.log(err));
    }

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id);
        };
    }

    async function deleteWidget(id) {
        let newLinks = props.linkWidgets.filter((w) => w.id !== id);
        props.setLinkWidgets(newLinks);
        
        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                //do thing
            })
            .catch(err => console.log(err));
    }

    function onAddNewLink() {

        const newLink = {
            height : 300,
            id: "00000000-0000-0000-0000-000000000000",
            name: "NEW note",
            order: 0,
            user_id: user.id,
            w_content: "{empty json}",
            w_type: "NOTES",
            width: 300
        }

        const newLinkWidgets = [...props.linkWidgets];
        newLinkWidgets.splice(0, 0, newLink);
        props.newLinkWidgets(newLinkWidgets);
    }

    return(
        <div>
            <button 
                type="button"
                className='btn btn-primary'
                onClick={onAddNewLink}
            >Add New Link</button>
            {
                linkList.map((widget) => {
                    return (
                        <div key={widget.id} className="w-container">
                            <span className="w-container-title">Widget Type : {widget.w_type}</span>
                            <span className="w-container-title">Widget Name(or Content) : {widget.name}</span>
                            <div>
                                <label>Enter Widget Content : </label>
                                <textarea
                                    value={widget.w_content}
                                    rows={10}
                                    cols={30}
                                />
                            </div>
                            <button className='btn-delete' onClick={()=>DeleteWidgetHandler(widget.id)}>
                                <img src={btn_delete} alt="delete"></img>
                            </button>
                        </div>
                    );
                })
            }
        </div>
    
    );
}
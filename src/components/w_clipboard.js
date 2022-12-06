import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import btn_delete from "../img/cntrl_delete.jpg";
import { UserContext } from "../api-integration/UserContext";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;


export default function Clipboard(props)
{
    const [clipboardList, setClipBoardList] = useState([]);
    const user = React.useContext(UserContext);

    useEffect( () => {
        let clipboardsWithContent = props.clipboardWidgets.map((w) => {
            let content = getWidgetContentById(w.id);

            return {
                ...w, 
                w_content: content
            };
        });
        setClipBoardList(clipboardsWithContent);
    }, [props.clipboardWidgets]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                return res.data.w_content;
            })
            .catch((err) => console.log(err));
    }

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id);
        };
    }

    async function deleteWidget(id) {
        let newClipboards = props.clipboardWidgets.filter((w) => w.id !== id);
                    props.setClipboardWidgets(newClipboards);

        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                //do nothing
            })
            .catch(err => console.log(err));
    }

    function onClipboardEditing(e) {
        console.log(e.target);
    }

    function onAddNewClipboard() {

        const newClipboard = {
            height : 300,
            id: "00000000-0000-0000-0000-000000000000",
            name: "NEW Clipboard",
            order: 0,
            user_id: user.id,
            w_content: "{empty json}",
            w_type: "CLIPBOARD",
            width: 300
        }

        const newClipboardWidgets = [...props.clipboardWidgets];
        newClipboardWidgets.splice(0, 0, newClipboard);
        props.setClipboardWidgets(newClipboardWidgets);
    }

    return(
        <div>
            <button 
                type="button"
                className='btn btn-primary'
                onClick={onAddNewClipboard}
            >Add New Clipboard</button>
            {
                clipboardList.map((widget) => {

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
                                        onChange={(e)=>onClipboardEditing(e)}
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
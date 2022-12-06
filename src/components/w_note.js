import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import btn_delete from "../img/cntrl_delete.jpg";
import { UserContext } from "../api-integration/UserContext";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Note(props)
{
    const [noteList, setNoteList] = useState([]);
    const user = React.useContext(UserContext);

    useEffect(() => {
        let notesWithContent = props.noteWidgets.map(async (w, index) => {

            return {
                key: index,
                ...w, 
                w_content: await getWidgetContentById(w.id)
            };
        });
        
        Promise.all(notesWithContent).then(result => setNoteList(result) );
    }, [props.noteWidgets]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === '401') window.location.replace(sso_url);

                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => console.log(err));
    }

    function DeleteWidgetHandler(id) {
        if (window.confirm("Are you use you want to delete this widget?")) {
            deleteWidget(id);
        };
    }

    async function deleteWidget(id) {
        let newNotes = props.noteWidgets.filter((w) => w.id !== id);
        props.setNoteWidgets(newNotes);

        await axios.delete(devity_api + '/api/widgets/' + id)
            .then(res => {
                //do thing
            })
            .catch(err => console.log(err));
    }

    function onAddNewNote() {
        const newNote = {
            height : 300,
            id: "00000000-0000-0000-0000-000000000000",
            name: "NEW note",
            order: 0,
            user_id: user.id,
            w_content: "{empty json}",
            w_type: "NOTES",
            width: 300
        }

        const newNoteWidgets = [...props.noteWidgets];
        newNoteWidgets.splice(0, 0, newNote);
        props.setNoteWidgets(newNoteWidgets);
    }

    return(
        <div>
            <button 
                type="button"
                className='btn btn-primary'
                onClick={onAddNewNote}
            >Add New Note</button>
            {
                noteList.map((widget) => {

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
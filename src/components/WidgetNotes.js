import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import { Editor } from '@tinymce/tinymce-react';
import { log } from '../Utilities'
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Note(props)
{
    const [note, setNote] = useState({});
    const editorRef = useRef(null);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        (async () => {
            const content = await getWidgetContentById(props.widget.id);
            const noteText = JSON.parse(content)["NOTES"];
            const currentWidget = {
                ...props.widget,
                w_content: noteText
            }
            setNote(currentWidget);
            setDirty(false);
        })();

    }, [props.widget]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + '/api/widgets/'+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                console.log("Get NOTES widget");
                console.log(res.data);
                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => log(err));
    }

    const saveNoteEditor = () => {
        if (editorRef.current) {
            const noteContentText = editorRef.current.getContent();
            setDirty(false);
            editorRef.current.setDirty(false);

            updateNoteContentinDb(noteContentText);
        }
    };

    async function updateNoteContentinDb(noteContentText) {
        const jsonObj = {};
        jsonObj["NOTES"] = noteContentText;
        const putBody = {
            ...note,
            w_content: JSON.stringify(jsonObj)
        }

        await props.callPUTRequest(putBody, note.w_type);
    }


    return (
        <div className='widget notes filterable'>
            {dirty && <button className='w-notes-save-btn' onClick={saveNoteEditor} disabled={!dirty}>Save</button>}
            <div className='tiny-editor-box'>
                <Editor
                    apiKey='c706reknirqudytbeuz7vvwxpc7qdscxg9j4jixwm0zhqbo4'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={note.w_content}
                    onDirty={() => setDirty(true)}
                    init={{
                        height: 250,
                        menubar: false,
                        plugins: ['anchor','autolink','charmap', 'codesample','link','lists', 'searchreplace','table'],
                        toolbar: 'bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | removeformat | code',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        skin_url: './css/CUSTOM/skins/ui/CUSTOM'
                    }}
                />

            </div>
        </div>
    );
    
}


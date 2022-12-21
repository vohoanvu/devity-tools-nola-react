import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import configData from "../config.json";
import '../css/App.css';
import { Editor } from '@tinymce/tinymce-react';
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

                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => console.log(err));
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
        <div className='widget'>
            <button onClick={saveNoteEditor} disabled={!dirty}>Save content</button>
            {dirty && <p style={{ color: 'red'}}>You have unsaved content!</p>}
            <div className='tiny-editor-box w_overflowable'>
                <Editor
                    inline
                    apiKey='c706reknirqudytbeuz7vvwxpc7qdscxg9j4jixwm0zhqbo4'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={note.w_content}
                    onDirty={() => setDirty(true)}
                    init={{
                        height: 250,
                        menubar: false,
                        plugins: ['anchor','autolink','charmap', 'codesample', 'emoticons', 'image', 'link','lists', 'media', 'searchreplace','table', 'visualblocks', 'wordcount'],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | code',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            </div>
        </div>
    );
    
}
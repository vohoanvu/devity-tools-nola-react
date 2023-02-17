import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import configData from "../config.json";
import { Editor } from "@tinymce/tinymce-react";
import { log } from "../Utilities";
import $ from "jquery";
const sso_url = configData.SSO_URL;
const devity_api = configData.API_URL;

export default function Note(props)
{
    const [note, setNote] = useState({});
    const [noteContent, setNoteContent] = useState(null);
    const editorRef = useRef(null);

    useEffect(() => {
        const curr_view = props.activePanel;
        (async () => {
            //console.log("beginging useEffect in WidgetNotes.js");
            if ((curr_view && curr_view !== "NOTES" && curr_view !== "ALL") || 
            (curr_view === "NOTES" && note["w_content"])) return;

            const content = await getWidgetContentById(props.widget.id);
            const jsonContent = JSON.parse(content);
            setNoteContent(jsonContent.NOTES);
            const currentWidget = {
                ...props.widget,
                w_content: jsonContent
            }
            setNote(currentWidget);
        })();

        $(`#save-btn-${props.widget.id}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget, props.activePanel]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + "/api/widgets/"+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                //console.log("Get NOTES widget");
                //console.log(res.data);
                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => log(err));
    }

    return (
        <div className='widget notes filterable'>
            <div className='tiny-editor-box'>
                {
                    (note.w_content === undefined) ? (
                        <div style={{ display: "flex", justifyContent: "center"}}>
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <Editor
                            id={props.widget.id}
                            apiKey='c706reknirqudytbeuz7vvwxpc7qdscxg9j4jixwm0zhqbo4'
                            onInit={(evt, editor) => editorRef.current = editor}
                            value={ noteContent }
                            onEditorChange={(newContent) => {
                                setNoteContent(newContent);
                                $(`#save-btn-${props.widget.id}`).show();
                                note.w_content = {
                                    NOTES: newContent
                                };
                                props.sendContentToParent(note, null, null);
                            }}
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: ["anchor","autolink","charmap", "codesample","link","lists", "searchreplace","table", "autosave"],
                                toolbar: "bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | removeformat | code | autosave | restoredraft",
                                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                skin_url: "./css/CUSTOM/skins/ui/CUSTOM",
                                autosave_interval: "2s", //how often TinyMCE auto-saves a snapshot of content into local storage
                                autosave_retention: "1m", //how often TinyMCE keeps saved content in local storage before deleting it
                                autosave_ask_before_unload: false,
                                autosave_save: (editor, draft) => {
                                    console.log("Saving into local storage...");
                                }
                            }}
                        />
                    )
                }
                
            </div>
        </div>
    );
    
}

// onBlur={() => {
//     props.sendContentToParent(note, null, editorRef.current.getContent());
//     $(`#save-btn-${props.widget.id}`).show();
// }}
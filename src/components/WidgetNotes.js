import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import configData from "../config.json";
import { Editor } from "@tinymce/tinymce-react";
import { log } from "../Utilities";
import $ from "jquery";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Note(props)
{
    const [note, setNote] = useState({});
    const editorRef = useRef(null);

    useEffect(() => {
        const curr_view = props.activePanel;
        (async () => {
            console.log("beginging useEffect in WidgetNotes.js");
            if ((curr_view && curr_view !== "NOTES" && curr_view !== "ALL") || 
            (curr_view === "NOTES" && note["w_content"])) return;

            const content = await getWidgetContentById(props.widget.id);
            const noteText = JSON.parse(content)["NOTES"];

            const currentWidget = {
                ...props.widget,
                w_content: noteText
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

    // const saveNoteEditor = () => {
    //     if (editorRef.current) {
    //         const noteContentText = editorRef.current.getContent();
    //         setDirty(false);
    //         editorRef.current.setDirty(false);

    //         updateNoteContentinDb(noteContentText);
    //     }
    // };

    // async function updateNoteContentinDb(noteContentText) {
    //     const jsonObj = {};
    //     jsonObj["NOTES"] = noteContentText;
    //     const putBody = {
    //         ...note,
    //         w_content: JSON.stringify(jsonObj)
    //     }

    //     await props.callPUTRequest(putBody, note.w_type);
    // }

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
                            apiKey='c706reknirqudytbeuz7vvwxpc7qdscxg9j4jixwm0zhqbo4'
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={note.w_content}
                            onDirty={() => {
                                $(`#save-btn-${props.widget.id}`).show();
                            }}
                            onBlur={() => {
                                props.sendContentToParent(note, null, editorRef.current.getContent());
                                $(`#save-btn-${props.widget.id}`).show();
                            }}
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: ["anchor","autolink","charmap", "codesample","link","lists", "searchreplace","table", "autosave"],
                                toolbar: "bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | removeformat | code | autosave",
                                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                skin_url: "./css/CUSTOM/skins/ui/CUSTOM"
                            }}
                        />
                    )
                }
                
            </div>
        </div>
    );
    
}


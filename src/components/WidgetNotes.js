import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { log } from "../Utilities";
import $ from "jquery";

export default function Note(props)
{
    const [note, setNote] = useState({});
    const [noteContent, setNoteContent] = useState(null);
    const editorRef = useRef(null);
    const axios = props.axios;

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
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {

                //console.log("Get NOTES widget");
                //console.log(res.data);
                return res.data.w_content;
            }).then(result => {return result;} )
            .catch((err) => log(err));
    }

    function decodeHtml(html) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(html, "text/html");
        return htmlDoc.body.textContent;
    }

    return (
        <div className='widget notes filterable'>
            <div className='tiny-editor-box'>
                {
                    (note.w_content === null) ? (
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
                                if (newContent !== noteContent) {
                                    setNoteContent(newContent);
                                    if (props.widget.name !== "AI Title" || decodeHtml(newContent).replace(/\s+/g, "") !== decodeHtml(noteContent).replace(/\s+/g, "")) {
                                        $(`#save-btn-${props.widget.id}`).show();
                                        props.widget.w_content = {
                                            NOTES: newContent
                                        };
                                        console.log("Note Title to be saved...", props.widget);
                                        props.sendContentToParent(props.widget, null, null);
                                    }
                                }
                            }}
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: ["anchor","autolink","charmap", "codesample","link","lists", "searchreplace","table", "code"],
                                toolbar: "bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | removeformat | code",
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

// onBlur={() => {
//     props.sendContentToParent(note, null, editorRef.current.getContent());
//     $(`#save-btn-${props.widget.id}`).show();
// }}
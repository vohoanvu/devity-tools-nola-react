import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { log, downloadStringAsFile } from "../Utilities";
import ConfigData from "../config.json";
import $ from "jquery";
import styleAxios from "axios";

export default function Note(props)
{
    const [note, setNote] = useState({});
    const [localContent, setLocalContent] = useState(null);
    const editorRef = useRef(null);
    const axios = props.axios;
    const [customTinyStyle, setCustomTinyStyle] = useState("");
    window.addEventListener(`JsonNoteDownloadRequested-${props.widget.id}`, downloadJSONContent);
    window.addEventListener(`widgetMinimized-${props.widget.id}`, resetTinyEditorHeight);
    window.addEventListener(`widgetMaximized-${props.widget.id}`, resetTinyEditorHeight);

    useEffect(() => {
        const curr_view = props.activePanel;

        if (props.widget.name) getCustomTinyStyleText();
        (async () => {
            if ((curr_view && curr_view !== "NOTES" && curr_view !== "ALL") || 
            (curr_view === "NOTES" && note["w_content"])) return;

            const content = await getWidgetContentById(props.widget.id);
            const jsonContent = JSON.parse(content);
            
            setLocalContent(jsonContent.NOTES);
            const currentWidget = {
                ...props.widget,
                w_content: jsonContent
            }
            setNote(currentWidget);          
        })();

        $(`#save-btn-${props.widget.id}`).hide();

        
        return () => {
            window.removeEventListener(`JsonNoteDownloadRequested-${props.widget.id}`, downloadJSONContent);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget, props.activePanel, props.isAINoteCreated]);

    function resetTinyEditorHeight() {
        let isMinMode = $("[data-w_id=\"" + props.widget.id + "\"]").hasClass("min");
        if (isMinMode) {
            editorRef.current.container.style.setProperty("height", "250px");
        } else {
            editorRef.current.container.style.setProperty("height", "1000px");
        }
    }

    function downloadJSONContent() 
    {
        if (note.w_content) {
            downloadStringAsFile(JSON.stringify(note.w_content), `${props.widget.name}.json`);
            $("div[data-panel=NOTES] .gear").removeClass("rotate");
        }
    }

    async function getWidgetContentById(w_id) {
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {

                //console.log("Get NOTES widget");
                //console.log(res.data);
                return res.data.w_content;
            }).then(result => {
                return result;
            })
            .catch((err) => log(err));
    }

    function decodeHtml(html) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(html, "text/html");
        return htmlDoc.body.textContent;
    }

    async function getCustomTinyStyleText()
    {
        await styleAxios.get("/css/tiny-content-style.css")
            .then(response => {
                return response.data;
            }).then(result => {
                setCustomTinyStyle(result);
            })
            .catch(error => console.log(error.response));
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
                            apiKey={ConfigData.TINYMCE_API_KEY}
                            onInit={(evt, editor) => {
                                editorRef.current = editor;
                            }}
                            value={ localContent }
                            onEditorChange={(newContent) => {
                                if (newContent !== localContent) {
                                    setLocalContent(newContent);
                                    let AINoteTitle = localStorage.getItem("gpt-model") ?? ConfigData.OPENAI_GPT_MODEL
                                    if (props.widget.name !== AINoteTitle || decodeHtml(newContent).replace(/\s+/g, "") !== decodeHtml(localContent).replace(/\s+/g, "")) {
                                        $(`#save-btn-${props.widget.id}`).show();
                                        props.widget.w_content = {
                                            NOTES: newContent
                                        };
                                        //console.log("Note Title to be saved...", props.widget);
                                        props.sendContentToParent(props.widget);
                                    }
                                }
                            }}
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: ["anchor","autolink","charmap", "codesample","link","lists", "searchreplace","table", "code"],
                                toolbar: "bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | removeformat | code",
                                //content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                content_style: customTinyStyle,
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
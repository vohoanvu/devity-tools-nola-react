import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "../css/App.css";
import Editable from "./Editable";
import btn_add from "../img/btn_add.png";
import btn_delete_sm from "../img/btn_delete_sm.png";
import { abbriviate, currate_title, downloadStringAsFile } from "../Utilities";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


export default function Clipboard(props)
{
    const [clipboardContent, setClipboardContent] = useState({
        currentText: "",
        content: null,
        widget: {}
    });
    const inputRef = useRef();
    const axios = props.axios;
    window.addEventListener(`JsonClipboardDownloadRequested-${props.widget.id}`, downloadJSONContent);

    useEffect(() => {
        const curr_view = props.activePanel;
        const getWidgetContent = async () => {
            if ((curr_view && curr_view !== "CLIPBOARD" && curr_view !== "ALL") || 
            (curr_view === "CLIPBOARD" && clipboardContent.widget.w_content)) return;

            const widget = await getWidgetContentById(props.widget.id);
            let contentArray = [];
            if (Object.keys(JSON.parse(widget.w_content)).length !== 0) {
                contentArray = JSON.parse(widget.w_content)["CLIPBOARD"];
            }

            setClipboardContent({
                ...clipboardContent,
                content: contentArray,
                widget: widget
            });
        }

        getWidgetContent();
        $(`#save-btn-${props.widget.id}`).hide();

        return () => {
            window.removeEventListener(`JsonClipboardDownloadRequested-${props.widget.id}`, downloadJSONContent);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget.id, props.activePanel]);

    function downloadJSONContent() 
    {
        if (clipboardContent.widget.w_content) {
            downloadStringAsFile(clipboardContent.widget.w_content, `${clipboardContent.widget.name}.json`);
            $("div[data-panel=CLIPBOARD] .gear").removeClass("rotate");
        }
    }


    async function getWidgetContentById(w_id) {
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {
                //console.log("Get CLIPBOARD widget");
                //console.log(res.data);
                return res.data;
            }).then(result => result)
            .catch((err) => console.log(err));
    }

    async function onBlurClipboardContent(eventTarget) {
        if (eventTarget.value.length === 0) return;

        clipboardContent.content.splice(0, 0, eventTarget.value);
        
        setClipboardContent({
            ...clipboardContent,
            currentText: ""
        });
        console.log("New Content to be saved...", clipboardContent.content);
        await updateWidgetContent(clipboardContent.content);
    }

    async function updateWidgetContent(currentContentArray) {
        let jsonObject = JSON.parse(clipboardContent.widget.w_content);
        jsonObject["CLIPBOARD"] = currentContentArray;
        
        const putBody = {
            ...clipboardContent.widget,
            name: props.widget.name,
            w_content: JSON.stringify(jsonObject)
        };

        await props.sendContentToParent(putBody, null, null);
    }

    function handleContentOnChange(e) {
        setClipboardContent({
            ...clipboardContent,
            currentText: e.target.value
        });
        $(`#save-btn-${props.widget.id}`).show();
    }

    const handleItemClick = event => {
        var text = $(event.currentTarget).attr("data-copy");

        $(event.currentTarget).animate({ opacity: "0.1" }, "fast");
        $(event.currentTarget).animate({ opacity: "1" }, "fast");
    
        navigator.clipboard.writeText(text).then(function() {
            console.log(text);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });
    
    };

    function handleRemoveClipboard(event) {
        const index = $(event.currentTarget).parent().index();
        clipboardContent.content.splice(index, 1);
        setClipboardContent({
            ...clipboardContent
        });
        $(`#save-btn-${props.widget.id}`).show();
        updateWidgetContent(clipboardContent.content, "CLIPBOARD");
    }

    const reorder = (list, oldIndex, newIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(oldIndex, 1);
        result.splice(newIndex, 0, removed);
  
        return result;
    };

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newList = [...clipboardContent.content];
        const newItems = reorder(
            newList,
            result.source.index,
            result.destination.index
        );
        setClipboardContent({
            ...clipboardContent,
            content: newItems
        });

        $(`#save-btn-${props.widget.id}`).show();
        updateWidgetContent(newItems);
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        background: isDragging ? "lightgreen" : "none",
        ...draggableStyle
    });

    const getListStyle = (isDraggingOver) => ({
        background: isDraggingOver ? "transparent" : "none"
    });

    return (
        <DragDropContext onDragEnd={(result)=>onDragEnd(result)}>
            <Droppable droppableId="droppable" direction="vertical" style={{transform: "none"}}>
                {
                    (provided, snapshot) => (
                        <div className='w_overflowable' ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                            <div className='widget clipboard'>
                                <form className="clipboardContentForm" onSubmit={e => e.preventDefault() } autoComplete="off">
                                    <img style={{ width: "10px", height: "10px"}} className='add-btn' src={btn_add} alt="create widget"/>
                                    <Editable 
                                        displayText={<span>{clipboardContent.currentText || "Add"}</span>}
                                        inputType="input" 
                                        childInputRef={inputRef}
                                        passFromChildToParent={onBlurClipboardContent}
                                        styling={{ display: "inline-block", width: "95%" }}>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            name="clipboardContent"
                                            placeholder=""
                                            value={clipboardContent.currentText}
                                            onChange={handleContentOnChange}
                                            style={{ width: "100%" }}
                                        />
                                    </Editable>
                                </form>
                                <div className='w_overflowable'>
                                    <ul className="truncateable">
                                        {
                                            clipboardContent.content === null ? (
                                                <div style={{ display: "flex", justifyContent: "center"}}>
                                                    <div className="loader"></div>
                                                </div>
                                            ) : (
                                                clipboardContent.content.map( (data, index) => (
                                                    <Draggable key={index} index={index} draggableId={index.toString()}>
                                                        {
                                                            (provided,snapshot) => (
                                                                <li
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                                >
                                                                    <span className='w_copyable filterable truncated' title={currate_title(data)} data-copy={data} onClick={handleItemClick} aria-hidden="true" {...provided.dragHandleProps}>{abbriviate(data)}</span>
                                                                    <span className='w_copyable filterable non-truncated' style={{display:"none"}}  data-copy={data} onClick={handleItemClick} aria-hidden="true" {...provided.dragHandleProps}>{data}</span>
                                                                    <img className='img-btn delete-item' src={btn_delete_sm} title='delete' alt="delete" onClick={handleRemoveClipboard} aria-hidden="true"/>
                                                                </li>
                                                            )
                                                        }
                                                    </Draggable>
                                                ))
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    );
}
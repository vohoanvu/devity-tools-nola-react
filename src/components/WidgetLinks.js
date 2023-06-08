import React, { useEffect, useState, useRef } from "react";
import { format_link, abbriviate, currate_title, downloadStringAsFile } from "../Utilities";
import Editable from "./Editable";
import btn_add from "../img/btn_add.png";
import btn_delete_sm from "../img/btn_delete_sm.png";
import $ from "jquery";
import btn_copy from "../img/btn_copy.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


export default function Links(props)
{
    const [links, setLinks] = useState({
        inputLink: "",
        displayList: null, // [{HYPERLINK: "https://www.google.com", DISPLAYNAME: "Google"}]
        link: {},
        w_type: props.widget.w_type
    });
    const inputLinkRef = useRef(null);
    const axios = props.axios;

    useEffect(() => {
        const curr_view = props.activePanel;
        async function fetchWidgetContent() {
            if ((curr_view && curr_view !== "LINKS" && curr_view !== "ALL") || 
            (curr_view === "LINKS" && Object.keys(links.link).length !== 0)) return;
            
            const widget = await getWidgetContentById(props.widget.id);
            
            const contentArray = JSON.parse(widget.w_content)
                .filter(item => item.HYPERLINK.length !== 0 && item.DISPLAYNAME.length !== 0);

            setLinks({
                ...links,
                displayList: contentArray
            });
        }

        fetchWidgetContent();
        $(`#save-btn-${props.widget.id}`).hide();
        window.addEventListener(`JsonLinkDownloadRequested-${props.widget.id}`, downloadJSONContent);
        return () => {
            window.removeEventListener(`JsonLinkDownloadRequested-${props.widget.id}`, downloadJSONContent);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.widget, props.activePanel]);

    function downloadJSONContent() 
    {
        if (links.link.w_content) {
            downloadStringAsFile(links.link.w_content, `${props.widget.name}.json`);
            $("div[data-panel=LINKS] .gear").removeClass("rotate");
        }
    }

    async function getWidgetContentById(w_id) {
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {
                //console.log("Get LINKS widget");
                //console.log(res.data);
                return res.data;
            }).then(widget => {
                links.link["w_content"] = widget.w_content;
                return widget;
            })
            .catch((err) => console.log(err));
    }

    function onBlurNewLinkHandler() {
        if (links.inputLink.length === 0) {
            return;
        }
        if (links.inputLink.length !== 0) {
            let inputList = links.inputLink.split(",");
            const displayName = inputList.length === 1 ? format_link(inputList[0]) : 
                (inputList[1].replace(/\s/g, "").length === 0) ? 
                    format_link(inputList[0]) : inputList[1];
            const newLink = {
                HYPERLINK: format_link(inputList[0]),
                DISPLAYNAME: displayName.trim()
            }
            links.displayList.splice(0, 0, newLink);
            setLinks({
                ...links,
                displayList: links.displayList,
                inputLink: ""
            });
            sendLinkContentToParentTobeSaved(links.displayList);
        }
    }

    async function sendLinkContentToParentTobeSaved(updatedList) {
        const putBody = {
            ...props.widget,
            w_content: JSON.stringify(updatedList)
        }
        await props.sendContentToParent(putBody, null, null);
    }


    function handleLinkChange(evt) {
        const value = evt.target.value;
        setLinks({
            ...links,
            [evt.target.name]: value
        });
        $(`#save-btn-${props.widget.id}`).show();
    }

    function handleRemoveLink(event) {
        const index = $(event.currentTarget).parent().index();
        links.displayList.splice(index, 1);
        setLinks({
            ...links
        });
        $(`#save-btn-${props.widget.id}`).show();
        sendLinkContentToParentTobeSaved(links.displayList);
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

        const newList = [...links.displayList];
        const newItems = reorder(
            newList,
            result.source.index,
            result.destination.index
        );
        setLinks({
            ...links,
            displayList: newItems
        });

        $(`#save-btn-${props.widget.id}`).show();
        sendLinkContentToParentTobeSaved(newItems);
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "pointer",
        // background: isDragging ? "lightgreen" : "none",
        ...draggableStyle
    });

    const getListStyle = (isDraggingOver) => ({
        background: isDraggingOver ? "transparent" : "none"
    });

    const handleLinkCopy = (event, linkContent) => {
        $(event.currentTarget).animate({ opacity: "0.1" }, "fast");
        $(event.currentTarget).animate({ opacity: "1" }, "fast");
    
        navigator.clipboard.writeText(linkContent).then(function() {
            console.log(linkContent);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });
    };
    
    return (
        <DragDropContext onDragEnd={(result)=>onDragEnd(result)}>
            <Droppable droppableId="droppable" direction="vertical" style={{transform: "none"}}>
                {
                    (provided,snapshot) => (
                        <div className='w_overflowable' ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                            <div className='widget w-links'>
                                <form className="linkContentForm" autoComplete="off">
                                    <img style={{ width: "10px", height: "10px"}} className='add-btn' src={btn_add} alt="create widget"/>
                                    <Editable 
                                        displayText={<span>{links.inputLink || "Add"}</span>}
                                        inputType="input" 
                                        childInputRef={inputLinkRef}
                                        passFromChildToParent={onBlurNewLinkHandler}
                                        styling={{ display: "inline-block", width: "95%" }}>
                                        <input
                                            ref={inputLinkRef}
                                            type="text"
                                            name="inputLink"
                                            placeholder="www.google.com, Google"
                                            value={links.inputLink}
                                            onChange={handleLinkChange}
                                            style={{ width: "100%" }}
                                        />
                                    </Editable>
                                </form>
                                <div className='w_overflowable'>
                                    <ul className="truncateable">
                                        {
                                            links.displayList === null ? (
                                                <div style={{ display: "flex", justifyContent: "center"}}>
                                                    <div className="loader"></div>
                                                </div>
                                            ) : (
                                                links.displayList.map((item, index) => {
                                                    return (
                                                        <Draggable key={index} index={index} draggableId={index.toString()}>
                                                            {
                                                                (provided,snapshot) => (
                                                                    <li ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                                        <a className='filterable truncated' target="_blank" href={format_link(item.HYPERLINK)} title={currate_title(item.DISPLAYNAME)} rel="noreferrer" {...provided.dragHandleProps} style={{ cursor: "pointer" }}>{abbriviate(item.DISPLAYNAME)}</a>
                                                                        <a className='filterable non-truncated' style={{display:"none", cursor: "pointer"}} target="_blank" href={format_link(item.HYPERLINK)} rel="noreferrer" {...provided.dragHandleProps}>{item.DISPLAYNAME}</a>
                                                                        <img src={btn_copy} title="Copy to clipboard" alt="Copy to clipboard" style={{ width: "20px", height: "20px" }} onClick={(e) => handleLinkCopy(e, item.HYPERLINK)} aria-hidden="true"/>
                                                                        <img className='img-btn delete-item' src={btn_delete_sm} title='delete' alt="delete" onClick={handleRemoveLink} aria-hidden="true"/>
                                                                    </li>
                                                                )
                                                            }
                                                        </Draggable>
                                                    )
                                                })
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

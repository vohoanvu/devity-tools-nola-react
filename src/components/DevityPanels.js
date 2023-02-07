/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import CONFIG from "../config.json";
import WidgetActions from "./WidgetActions";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_add from "../img/btn_add.png";
import $ from "jquery";
import { log } from "../Utilities";
import W_Note from "./WidgetNotes";
import W_Link from "./WidgetLinks";
import W_Clipboard from "./WidgetClipboard";
import RssDevity from "./Widgets/RSS";
import Jira from "./Widgets/JIRA";
import { UserContext } from "../api-integration/UserContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const sso_url = CONFIG.SSO_URL;
const devity_api = CONFIG.DEVITY_API;

export default function DevityPanels(props) 
{
    const [wObject, setWObject] = useState({});
    const inputRef = useRef();
    const [isReadyToSave, setIsReadyToSave] = useState({
        isReadyToSave: false,
        putBody: {},
        type: ""
    });
    const userContext = useContext(UserContext);
    const [isDevitySubTypeAddOpen, setIsDevitySubTypeAddOpen] = useState(false);
    const [isDevitySubTypeChanged, setIsDevitySubTypeChanged] = useState({
        isRssUriChanged: false,
        isJiraConfigsChanged: false
    });

    useEffect(() => {
        async function fetchData() {
            await axios.get(devity_api + "/api/widgets").then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                console.log("Get panels data");
                console.log(res.data);
                setWObject(res.data);
            })
                .then(result => props.signalAllPanelRendered(true))
                .catch((err) => console.log(err));
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    async function w_add(widgetType, widgetList, devitySubType = null) {
        let jsonContentObject = init_w_content(widgetType, devitySubType);
        let widgetName = "";
        if (widgetType === "DEVITY" && devitySubType && devitySubType === "RSS") {
            widgetName = "RSS Reader";
        } else if (widgetType === "DEVITY" && devitySubType && devitySubType === "JIRA") {
            widgetName = "JIRA Tickets"
        } else {
            widgetName = widgetType + " Widget";
        }

        const newWidget = {
            key: widgetList.length+1,
            w_content: JSON.stringify(jsonContentObject),
            name: widgetName,
            order: widgetList.length+1,
            w_type: widgetType,
            height : 300,
            width: 300,
            w_type_sub: devitySubType
        }

        w_create(newWidget, widgetType);
    }

    function init_w_content(type, devitySubType) {
        let jsonObject = {};

        switch (type) {
        case "CLIPBOARD": //format: "{ "CLIPBOARD": [ "devitysqladmin", "Y$BH4bB96JkLY*7FVQvzfmVqHcozGTf#8" ] }"
            jsonObject["CLIPBOARD"] = [];
            return jsonObject;
        case "NOTES":
            jsonObject["NOTES"] = "<p></p>"; //format: "{ "NOTES": "<p>html-encoded-string-from-TINY-editor</p>" }"
            return jsonObject;
        case "LINKS":
            var jsonObjList = [];
            jsonObject["HYPERLINK"] = "";
            jsonObject["DISPLAYNAME"] = ""; //format: "[{ "HYPERLINK": "noladigital.net", "DISPLAYNAME": "NOLA" }]"
            jsonObjList.push(jsonObject);
            return jsonObjList;
        case "DEVITY":
            if (devitySubType && devitySubType === "RSS") {
                jsonObject["FEEDURI"] = ""; //format: "{ "FEEDURI": "https://rss.nytimes.com/services/xml/rss/nyt/US.xml" }"
            }
            if (devitySubType && devitySubType === "JIRA") {
                jsonObject["DUTY"] = "assigned"; //format: "{ DUTY: "assigned" }" or "{ DUTY: "mentioned" }"
                jsonObject["ISSUETYPES"] = []; //format: "{ ISSUETYPES: ["Bug", "Story"] }"
                jsonObject["STATUSES"] = []; //format: "{ STATUSES: ["Open", "In Progress"] }"
                jsonObject["PRIORITIES"] = []; //format: "{ PRIORITIES: ["High", "Medium"] }"
            }
            return jsonObject;
        default:
            break;
        }
    }

    async function w_create(postBody, type) {
        delete postBody["key"];
        $("div[data-panel=" + type + "] .gear").addClass("rotate");
        await axios.post(devity_api + "/api/widgets/", { ...postBody })
            .then(response => {
                return response.data
            })
            .then(result => {
                postBody["id"] = result.id;
                wObject[type].splice(0, 0, postBody);
                setWObject({...wObject});
                $("div[data-panel=" + type + "] .gear").removeClass("rotate");
                log("Created " + type + " widget.")
            })
            .catch(err => console.log(err));
    }

    async function w_update(putBody, type) {
        delete putBody["key"];
        $("div[data-panel=" + type + "] .gear").addClass("rotate");
        const result = await axios.put(devity_api + "/api/widgets", { ...putBody })
            .then(response => {
                console.log(response.status, "...on update");
                return response.data;
            })
            .then(result => {
                $("div[data-panel=" + type + "] .gear").removeClass("rotate");
                return result;
            })
            .catch(err => console.log(err));

        if (type === "DEVITY" && putBody.w_type_sub === "RSS") {
            setIsDevitySubTypeChanged({
                isRssUriChanged: !isDevitySubTypeChanged.isRssUriChanged
            });
        }
        if (type === "DEVITY" && putBody.w_type_sub === "JIRA") {
            setIsDevitySubTypeChanged({
                isJiraConfigsChanged: !isDevitySubTypeChanged.isJiraConfigsChanged
            });
        }


        return result;
    }

    async function sendPUTContentToParent(widget, setWidgetState, currentContent) {  
        let putBody = {};
    
        switch (widget.w_type)
        {
        case "CLIPBOARD":
            putBody = widget;
            break;

        case "LINKS":
            putBody = widget;
            break;

        case "NOTES":
            var jsonObj = {};
            jsonObj[widget.w_type] = currentContent;
            putBody = {
                ...widget,
                w_content: JSON.stringify(jsonObj)
            };
            break;
    
        case "DEVITY":
            putBody = widget;
            break;
        default:
            break;
        }

        setIsReadyToSave({
            isReadyToSave: true,
            putBody: putBody,
            type: widget.w_type
        });
    }

    function w_render(widget) 
    {
        const widgetType = userContext.activePanel;

        switch (widget.w_type) {
        case "CLIPBOARD":
            return <W_Clipboard 
                widget={widget} 
                sendContentToParent={sendPUTContentToParent}
                activePanel={widgetType}/>;
  
        case "LINKS":
            return <W_Link 
                widget={widget} 
                sendContentToParent={sendPUTContentToParent}
                activePanel={widgetType}/>;
  
        case "NOTES":
            return <W_Note 
                widget={widget} 
                sendContentToParent={sendPUTContentToParent} 
                activePanel={widgetType}/>;

        case "DEVITY":
            if (widget.w_type_sub === "RSS")
                return <RssDevity
                    widget={widget} 
                    sendContentToParent={sendPUTContentToParent} 
                    activePanel={widgetType}
                    isUriChanged={isDevitySubTypeChanged.isRssUriChanged}/>

            if (widget.w_type_sub === "JIRA")
                return <Jira
                    activePanel={widgetType}
                    widget={widget} 
                    sendContentToParent={sendPUTContentToParent}
                    isConfigsChanged={isDevitySubTypeChanged.isJiraConfigsChanged}/>
            break;
        default:
            return <div className="w-container">LOADING...</div>;
        }

    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
  
        return result;
    };

    const onDragEnd = (result, widgetType) => {
    // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newWidgetList = [...wObject[widgetType]];

        const newItems = reorder(
            newWidgetList,
            result.source.index,
            result.destination.index
        );
        setWObject({
            ...wObject,
            [widgetType]: newItems
        });

        if (widgetType === "NOTES") {
            console.log("TINY MCE:", $(".mce-content-body"));
            //$('.mce-content-body').activeEditor.setContent(newItems[result.destination.index].w_content);
        }

        onDragEndSaveInDb(newItems, widgetType);
    };

    async function onDragEndSaveInDb(orderedWidgetList, type) {
        console.log("new order: ", orderedWidgetList);
        let postBody = {};
        orderedWidgetList.forEach((item, index) => {
            postBody[item.id] = index;
        });
        $("div[data-panel=" + type + "] .gear").addClass("rotate");
        return await axios.post(devity_api + "/api/widgets/order", { ...postBody })
            .then(response => console.log("On Order POST Response: ", response.status))
            .then(result => $("div[data-panel=" + type + "] .gear").removeClass("rotate"))
            .catch(err => console.log(err));
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
        userSelect: "none",
        background: isDragging ? "lightgreen" : "none",
        ...draggableStyle
    });

    const getListStyle = (isDraggingOver) => ({
        background: isDraggingOver ? "transparent" : "none",
        display: "flex",
        overflow: "auto"
    });

    return (
        <React.Fragment>
            {
                Object.entries(wObject).map( ([key,value], index) => {
                    return (
                        <div key={index} className="p-panel" data-panel={key} style={{display:"none"}}>
                            <div className='p-chrome'>
                                <img src={btn_image_config} className="gear" alt="devity gear"/>
                                <span className="title">{key}</span>
                                {
                                    key === "DEVITY" ? (
                                        <img className='add' src={btn_add} onClick={() => setIsDevitySubTypeAddOpen(true)} alt="create devity" aria-hidden="true"/>
                                    ) : (
                                        <img className='add' src={btn_add} onClick={()=>w_add(key, value)} alt="create widget" aria-hidden="true"/>
                                    )
                                }
                            </div>
                            {
                                isDevitySubTypeAddOpen && (
                                    <div className="w-add-devity" style={{display:"block"}}>
                                        <div>
                                            <span>RSS</span>
                                            <img className='add-subtype' src={btn_add} onClick={()=>w_add(key, value, "RSS")} alt="create devity subtype" aria-hidden="true"/>
                                        </div>
                                        <div>
                                            <span>JIRA</span>
                                            <img className='add-subtype' src={btn_add} onClick={()=>w_add(key, value, "JIRA")} alt="create devity subtype" aria-hidden="true"/>
                                        </div>
                                    </div>
                                )
                            }
                            <DragDropContext onDragEnd={(result)=>onDragEnd(result, key)}>
                                <Droppable droppableId="droppable" direction="horizontal">
                                    {
                                        (provided, snapshot) => (
                                            <div 
                                                className='p-contents'
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}
                                                {...provided.droppableProps}
                                            >
                                                {
                                                    value.map((w, index) => {
                                                        return (
                                                            <Draggable index={index} key={w.id} draggableId={w.id}>
                                                                {
                                                                    (provided, snapshot) => (
                                                                        <div 
                                                                            data-w_id={w.id}
                                                                            className="w-container min"
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                                        >
                                                                            <div 
                                                                                className='w-chrome'
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <WidgetActions
                                                                                    widget={w}
                                                                                    setWidgetObjState={setWObject}
                                                                                    widgetObjState={wObject}
                                                                                    inputRef={inputRef}
                                                                                    callPUTRequest={w_update}
                                                                                    isReadyToSave={isReadyToSave}
                                                                                />
                                                                            </div>
                                                                            { w_render(w) }
                                                                        </div>
                                                                    )
                                                                }
                                                            </Draggable>
                                                        );
                                                    })
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )
                                    } 
                                </Droppable>
                            </DragDropContext>
                        </div>
                    )
                })
            }
        </React.Fragment>
    );
}
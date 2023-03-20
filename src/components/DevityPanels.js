/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState, useRef, useContext } from "react";
import WidgetActions from "./WidgetActions";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_add from "../img/btn_add.png";
import $ from "jquery";
import W_Note from "./WidgetNotes";
import W_Link from "./WidgetLinks";
import W_Clipboard from "./WidgetClipboard";
import RssDevity from "./Widgets/RSS";
import Jira from "./Widgets/JIRA";
import { UserContext } from "../api-integration/UserContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Cookies from "universal-cookie";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function DevityPanels({ signalAllPanelRendered, axios }) 
{
    const [wObject, setWObject] = useState({}); // { NOTES: [{}, {}], LINKS: [{}, {}], CLIPBOARD: [{}, {}] }
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
    const [isDataLimitModalOpen, setIsDataLimitModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            console.log("GET api/wigets is called...");
            await axios.get("/api/widgets").then((res) => {

                console.log("Get panels data");
                console.log(res.data);
                setWObject(res.data);
            })
                .then(result => {
                    signalAllPanelRendered(true);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        let cookie = new Cookies(); //avoid getting 401 error when rendering for the 1st time
        if (cookie.get("devity-token")) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    async function w_add(widgetType, widgetList, devitySubType = null) {
        let jsonContentObject = init_w_content(widgetType, devitySubType);

        const newWidget = {
            key: widgetList.length+1,
            w_content: JSON.stringify(jsonContentObject),
            name: "Title",
            order: widgetList.length+1,
            w_type: widgetType,
            height : 300,
            width: 300,
            w_type_sub: devitySubType
        }

        await w_create(newWidget, widgetType);
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
        await axios.post("/api/widgets/", { ...postBody })
            .then(response => {
                return response.data
            })
            .then(result => {
                postBody["id"] = result.id;
                wObject[type].splice(0, 0, postBody);
                setWObject({...wObject});
                $("div[data-panel=" + type + "] .gear").removeClass("rotate");
                console.log("Created " + type + " widget.", result);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 402) {
                    setIsDataLimitModalOpen(true);
                }
            });
    }

    async function w_update(putBody, type) {
        delete putBody["key"];
        $("div[data-panel=" + type + "] .gear").addClass("rotate");
        const result = await axios.put("/api/widgets", { ...putBody })
            .then(response => {
                console.log(response.status, "...on update");
                return response.data;
            })
            .then(result => {
                let wIndex = wObject[type].findIndex(element => element.id === result.id);
                wIndex !== -1 && (wObject[type][wIndex] = result);
                setWObject({...wObject});
                $("div[data-panel=" + type + "] .gear").removeClass("rotate");
                console.log("PUT widget result...", result);
                return result;
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 402) {
                    setIsDataLimitModalOpen(true);
                }
            });

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

    async function sendPUTContentToParent(widget, setWidgetState, currentContent) 
    {  
        setIsReadyToSave({
            isReadyToSave: true,
            putBody: {
                ...widget,
                w_content: widget.w_type === "NOTES" ? JSON.stringify(widget.w_content) : widget.w_content
            },
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
                activePanel={widgetType}
                axios={axios}/>;
  
        case "LINKS":
            return <W_Link 
                widget={widget} 
                sendContentToParent={sendPUTContentToParent}
                activePanel={widgetType}
                axios={axios}/>;
  
        case "NOTES":
            return <W_Note 
                widget={widget} 
                sendContentToParent={sendPUTContentToParent}
                activePanel={widgetType}
                axios={axios}/>;

        case "DEVITY":
            if (widget.w_type_sub === "RSS")
                return <RssDevity
                    widget={widget} 
                    sendContentToParent={sendPUTContentToParent} 
                    activePanel={widgetType}
                    isUriChanged={isDevitySubTypeChanged.isRssUriChanged}
                    axios={axios}/>

            if (widget.w_type_sub === "JIRA")
                return <Jira
                    activePanel={widgetType}
                    widget={widget} 
                    sendContentToParent={sendPUTContentToParent}
                    isConfigsChanged={isDevitySubTypeChanged.isJiraConfigsChanged}
                    axios={axios}/>
            break;
        default:
            return <div className="w-container border">LOADING...</div>;
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

        onDragEndSaveInDb(newItems, widgetType);
    };

    async function onDragEndSaveInDb(orderedWidgetList, type) {
        console.log("new order: ", orderedWidgetList);
        let postBody = {};
        orderedWidgetList.forEach((item, index) => {
            postBody[item.id] = index;
        });
        $("div[data-panel=" + type + "] .gear").addClass("rotate");
        return await axios.post("/api/widgets/order", { ...postBody })
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
            <ConfirmationDialog
                title="Data Size Limit for free account reached!"
                message="You have exceeded the maximum data size for a free account. Upgrade to paid subscription or delete some widgets."
                isDialogOpen={isDataLimitModalOpen}
                modalType={402}
            />
            {
                Object.entries(wObject).map( ([key,value], index) => {
                    return (
                        <div key={index} className="p-panel border" data-panel={key} style={{display:"none"}}>
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
                                    <div className="w-add-devity" style={{display:"flex"}}>
                                        <div>
                                            <figure>
                                                <img className='add-subtype' src={btn_add} onClick={()=>w_add(key, value, "RSS")} alt="create devity subtype" aria-hidden="true"/>
                                                <figcaption>RSS</figcaption>
                                            </figure>
                                        </div>
                                        <div>
                                            <figure>
                                                <img className='add-subtype' src={btn_add} onClick={()=>w_add(key, value, "JIRA")} alt="create devity subtype" aria-hidden="true"/>
                                                <figcaption>JIRA</figcaption>
                                            </figure>
                                        </div>
                                    </div>
                                )
                            }
                            <DragDropContext onDragEnd={(result)=>onDragEnd(result, key)}>
                                <Droppable droppableId="droppable" direction="horizontal" style={{transform: "none"}}>
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
                                                                            className="w-container min border"
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
                                                                                    axios={axios}
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
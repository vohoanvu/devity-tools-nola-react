import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import configData from "../config.json";
import { format_link, abbriviate, currate_title } from "../Utilities";
import Editable from "./Editable";
import btn_add from "../img/btn_add.png";
import btn_delete_sm from "../img/btn_delete_sm.png";
import $ from "jquery";
const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;



export default function Links(props)
{
  const [links, setLinks] = useState({
    inputLink: "",
    inputTitle: "",
    displayList: null, // [{hyperLink: "https://www.google.com", displayName: "Google"}]
    link: props.widget,
    w_type: props.widget.w_type
  });
  const inputLinkRef = useRef(null);
  const inputTitleRef = useRef(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const curr_view = props.activePanel;
    async function fetchWidgetContent() {
      if ((curr_view && curr_view !== "LINKS" && curr_view !== "ALL") || 
            (curr_view === "LINKS" && links.link["w_content"] != null)) return;

      const widget = await getWidgetContentById(props.widget.id);
            
      const contentArray = JSON.parse(widget.w_content)
        .filter(item => item.hyperLink.length !== 0 && item.displayName.length !== 0);

      setLinks({
        ...links,
        displayList: contentArray,
      });
    }

    fetchWidgetContent();
    $(`#save-btn-${props.widget.id}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.widgetm, props.activePanel]);

  async function getWidgetContentById(w_id) {
    return await axios.get(devity_api + "/api/widgets/"+ w_id)
      .then((res) => {
        if (res.status === 401) window.location.replace(sso_url);

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
      setIsEdit(false);
      return;
    }
    if (links.inputLink.length !== 0) {
      const inputTitleNode = $("div span#inputTitle").parent()[0];
      inputTitleNode.click();
    }
  }

  function onBlurNewTitleHandler() {
    let displayTextForLink = "";
    if (links.inputTitle.length === 0) {
      displayTextForLink = format_link(links.inputLink);
    } else {
      displayTextForLink = links.inputTitle;
    }

    const newLink = {
      hyperLink: links.inputLink,
      displayName: displayTextForLink
    }
    links.displayList.splice(0, 0, newLink);
    setLinks({
      ...links,
      displayList: links.displayList,
      inputLink: "",
      inputTitle: ""
    });
    setIsEdit(false);
    sendLinkContentToParentTobeSaved();
  }

  async function sendLinkContentToParentTobeSaved() {
    const putBody = {
      ...props.widget,
      w_content: JSON.stringify(links.displayList)
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

  function openEditForm() {
    setIsEdit(true);
  }

  function handleRemoveLink(event) {
    const index = $(event.currentTarget).parent().index();
    links.displayList.splice(index, 1);
    setLinks({
      ...links
    });
    $(`#save-btn-${props.widget.id}`).show();
    sendLinkContentToParentTobeSaved();
  }
    
  return (
    <React.Fragment>
      <div className='w_overflowable'>
        <div className='widget w-links'>
          {
            !isEdit && (
              <div onClick={openEditForm} role="button" aria-hidden>
                <img style={{ width: "10px", height: "10px"}} className='add-btn' src={btn_add} alt="create widget"/>
                Add
              </div>
            )
          }
          {
            isEdit ? (
              <form id="linkContentForm" autoComplete="off">
                <Editable 
                  displayText={<span>{links.inputLink || "Url"}</span>}
                  inputType="input" 
                  childInputRef={inputLinkRef}
                  passFromChildToParent={onBlurNewLinkHandler}>
                  <input
                    ref={inputLinkRef}
                    type="text"
                    name="inputLink"
                    placeholder=""
                    value={links.inputLink}
                    onChange={handleLinkChange}
                  />
                </Editable>
                <br></br>
                <Editable 
                  displayText={<span id='inputTitle'>{links.inputTitle || "Title"}</span>}
                  inputType="input" 
                  childInputRef={inputTitleRef}
                  passFromChildToParent={onBlurNewTitleHandler}>
                  <input
                    ref={inputTitleRef}
                    type="text"
                    name="inputTitle"
                    placeholder=""
                    value={links.inputTitle}
                    onChange={handleLinkChange}
                  />
                </Editable>
              </form>
            ) : null
          }
          <ul>
            {
              !links.displayList ? (
                <div style={{ display: "flex", justifyContent: "center"}}>
                  <div className="loader"></div>
                </div>
              ) : (
                links.displayList.map((item, index) => {
                  return (
                    <li key={index}>
                      <a className='filterable truncated' target="_blank" href={format_link(item.hyperLink)} title={currate_title(item.displayName)} rel="noreferrer">{abbriviate(item.displayName)}</a>
                      <a className='filterable non-truncated' style={{display:"none"}} target="_blank" href={format_link(item.hyperLink)} rel="noreferrer">{item.displayName}</a>
                      <img className='img-btn delete-item' src={btn_delete_sm} title='delete' alt="delete" onClick={handleRemoveLink} aria-hidden="true"/>
                    </li>
                  )
                })
              )
            }
          </ul>
        </div>
      </div>
    </React.Fragment>        
  );
}

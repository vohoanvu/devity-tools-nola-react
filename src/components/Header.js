import React, { useContext, useEffect, useState } from "react";
import $ from "jquery";
import logo from "../img/devity_logo.png";
import btn_image_avitar from "../img/d_btn_ctrl_user.png";
import btn_image_links from "../img/d_btn_ctrl_links.png";
import btn_image_notes from "../img/d_btn_ctrl_notes.png";
import btn_image_clipboard from "../img/d_btn_ctrl_clipboard.png";
import btn_image_lib from "../img/d_btn_ctrl_lib.png";
import chat_gpt_img from "../img/devity-gpt.png";
import btn_copy from "../img/btn_copy.png";
import { UserContext } from "../api-integration/UserContext";

export default function Header() 
{
    const userContext = useContext(UserContext);
    const [userIP, setUserIP] = useState("");

    useEffect(()=>{
        const curr_view = userContext.activePanel;
        $(".p-panel").hide();
        if(curr_view){
            onNavigate(curr_view);
        }
        else{
            onNavigate("DEVITY");
        }

        setUserIP($("span.copy-text-ip").text());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userContext]) 

    function onNavigate(target) {

        if (target === "CONSOLE") {
            $("#console_log").toggleClass("hide");
            // $("#navigation").toggleClass("nav-max");
            // $("#navigation").toggleClass("nav-min");
            // $("#console").toggleClass("console-max");
            // $("#console").toggleClass("console-min");
            $(".cmd_type_radio").toggle();
            // $('#header_container').toggleClass('display-flex');
        } else {
            $(".p-panel").hide();
            //$(".p-panel").show();
            $("div[data-panel=" + target + "]").show();
            $("#prompt_input").val("");
            $("#prompt_input").focus();
            
        }

        if (target === "CHATGPT") $(".input-prompt textarea").focus();
    }

    function onNavigateClicked(target) {
        localStorage.setItem("curr_view", target);
        if (target !== "CONSOLE") userContext.setActivePanel(target);
        if (target === "NOTES") $("#nav_notes").removeClass("lightning-animation");
        onNavigate(target);
    }


    return (<div id="navigation" className="nav">

        <header id="ribbon" className="ribbon-cntrls" >
            <button id="nav_all" onClick={()=>onNavigateClicked("DEVITY")}>
                <img src={logo}  alt="logo" /><br />
                <span>Devity</span>
            </button>

            <button id="nav_chat" onClick={()=>onNavigateClicked("CHATGPT")}>
                <img src={chat_gpt_img}  alt="ChatGPT" /><br />
                <span>OpenAI</span>
            </button>
            
            <button id='nav_links' onClick={()=>onNavigateClicked("LINKS")}>
                <img src={btn_image_links} alt="Links" /><br />
                <span>Links</span>
            </button>

            <button id="nav_clipboard" onClick={()=>onNavigateClicked("CLIPBOARD")}>
                <img  src={btn_image_clipboard} className="" alt="Clipboard" /><br />
                <span>Clipboard</span>
            </button>

            <button id='nav_notes' onClick={()=>onNavigateClicked("NOTES")}>
                <img src={btn_image_notes} alt="Notes"/><br />
                <span>Notes</span>
            </button>

            <button id='nav_libraries' onClick={()=>onNavigateClicked("LIBRARIES")}>
                <img  src={btn_image_lib} className="" alt="Libraries" /><br />
                <span>Libraries</span>
            </button>


            <button id='nav_profile' onClick={()=>onNavigateClicked("PROFILE")}>
                <img src={btn_image_avitar} className="App-avitar" alt="devity profile" /><br />
                <span title={userIP}>{userContext.userProfile.name}</span>
            </button>
            <div 
                onClick={()=> {
                    navigator.clipboard.writeText(userIP).then(function() {
                        console.log(userIP);
                    }, function(err) {
                        console.error("Async: Could not copy text: ", err);
                    });
                }} 
                role="button"
                tabIndex="0"
                onKeyDown={() => console.log("Keydown event triggered...")}
                title={userIP}
                className="copy-clipboard-btn"
                style={{ height: "20px", width: "20px", position: "absolute", right: "0px", bottom: "5px" }}>
                <img src={btn_copy} alt="Copy to clipboard" style={{ height: "100%", width: "100%" }}/>
            </div>
        </header>

    </div>);
}
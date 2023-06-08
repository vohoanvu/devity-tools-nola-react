import React, { useContext, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { setUserProfileData } from "../redux/actions/UserProfileActions";

export default function Header() 
{
    const userContext = useContext(UserContext);
    const userProfile = useSelector((state) => state.UserProfileReducer.userProfileData);
    const dispatch = useDispatch();

    useEffect(()=>{
        const curr_view = userContext.activePanel;
        $(".p-panel").hide();
        if(curr_view){
            onNavigate(curr_view);
        }else{
            onNavigate("DEVITY");
        }

        dispatch(setUserProfileData(userContext.userProfile));
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


            <button id='nav_profile'>
                <div role="button" tabIndex="0" onClick={()=>onNavigateClicked("PROFILE")} onKeyDown={() => console.log("Keydown event triggered...")} style={{ position: "relative" }}>
                    <img src={btn_image_avitar} className="App-avitar" alt="devity profile"/>
                    <br/>
                    <span title={userProfile.Ip_Address}>
                        {userContext.userProfile.name}
                    </span>
                </div>
                <div 
                    onClick={()=> {
                        navigator.clipboard.writeText(userProfile.Ip_Address).then(function() {
                            console.log(userProfile.Ip_Address);
                        }, function(err) {
                            console.error("Async: Could not copy text: ", err);
                        });
                    }} 
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => console.log("Keydown event triggered...")}
                    title={userProfile.Ip_Address}
                    className="copy-clipboard-btn"
                    style={{ height: "15px", width: "15px", position: "absolute", right: "32px", top: "77px" }}>
                    <img src={btn_copy} alt="Copy to clipboard" style={{ height: "100%", width: "100%" }}/>
                </div>
            </button>
        </header>

    </div>);
}
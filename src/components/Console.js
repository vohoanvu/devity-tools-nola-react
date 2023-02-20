import * as React from "react";
import $ from "jquery";
import axios from "axios";
import { useState, useContext } from "react";
import { log } from "../Utilities"
import CONFIG from "../config.json";
import { UserContext } from "../api-integration/UserContext";

const GOOGLE_SEARCH_API = CONFIG.GOOGLE_SEARCH_ENGINE_URL + "?key=" + CONFIG.GOOGLE_API_KEY + "&cx=" + CONFIG.GOOGLE_SEARCH_ENGINE;


const Console = (props) => 
{
    const [err, setErr] = useState("");
    const [cmd, setCmd] = useState("#filter");
    const [params, setParams] = useState(" ");
    const keys_ignore = ["Shift", "Capslock", "Alt", "Control", "Alt", "Delete", "End", "PageDown", "PageUp", "Meta", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "NumLock", "Pause", "ScrollLock", "Home", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10","F11","F12"];
    const command_ignore = ["Tab", "Escape"];
    const userContext = useContext(UserContext);

    const runCommand = async () => {

        switch(cmd) {
        case "#search":

            $(".p-panel").hide();
            $("div[data-panel=RESULTS]").show();
            $("div[data-panel=RESULTS] .gear").addClass("rotate");
            userContext.setActivePanel("RESULTS");
            if (params) {
            
                const googleSearchApi = GOOGLE_SEARCH_API + "&q=" + encodeURIComponent(params);
                await axios.get(googleSearchApi)
                    .then((res) => {
                        console.log("google search results: ", res);
                        localStorage.setItem("curr_view", "RESULTS");
                        props.passGoogleResultFromChildToParent(res.data.items);
                    
                        $("div[data-panel=RESULTS] .gear").removeClass("rotate");
                        //log('fetched google search api results for ' + params);
                    })
                    .catch((error) => {
                        setErr(error);
                        log(err);
                    });


                const youtubeSearchApi = CONFIG.YOUTUBE_API_URL 
          + encodeURIComponent(params) + "&type=video&key=" + CONFIG.YOUTUBE_API_KEY;
                await axios.get(youtubeSearchApi)
                    .then((res) => {
                        localStorage.setItem("curr_view", "RESULTS");
                        return res.data.items;
                    })
                    .then((result) => {
                        console.log("youtube search results: ", result);
                        props.passvideoResultFromChildToParent(result);
                        $("div[data-panel=RESULTS] .gear").removeClass("rotate");
                        //log('fetched youtube results for ' + params);
                    })
                    .catch((error) => console.log(error));

            } else {
                log("Attempt to search without entering search term");
            }
            break;
        case "#devity":

            if(params === "clear"){$("#console_output").empty();}
            if(params === "profile"){$("#nav_profile").trigger("click");}
            if(params === "clipboard"){$("#nav_clipboard").trigger("click");}
            if(params === "notes"){$("#nav_notes").trigger("click");}
            if(params === "links"){$("#nav_links").trigger("click");}
            if(params === "libraries"){$("#nav_libraries").trigger("click");}
            if(params === "console"){$("#nav_console").trigger("click");}
            if(params === "all"){$("#nav_all").trigger("click");}
            break;
        case "#filter":
            break;
        default:
            log(cmd + " is not a recognized command");
            break;
        }

        $("#prompt_input").val("");
        setParams("");
    };

    function handleKeyDown(e) {

        var key = e.key;
    
        if (keys_ignore.includes(key)) {
            return;
        }

        if(key === "Escape"){
            setCmd("#devity");
            setParams("");
            $(".filterable").parent().show();
            $("#prompt_input").val("");
            return;
        }
   
        if(key === " " || key === "Tab"){
            if( params === "#f" || params === "#filter" ){
                setCmd("#filter")
                setParams("");
                $("#prompt_input").val("");

            }
            if(params === "#s" || params === "#search"){
                setCmd("#search")
                setParams("");
                $("#prompt_input").val("");
                $(".filterable").parent().show();

            }
            if(params === "#d" || params === "#devity"){
                setCmd("#devity")
                setParams("");
                $("#prompt_input").val("");
                $(".filterable").parent().show();
            }
        }

        if (key==="Enter") {
            runCommand();
            return;
        }

    }

    function handleCmdChange(e) {
        setCmd("#" + e.target.value);
        $("#prompt_input").focus();
    }

    function handleKeyUp(e) {

        var key = e.key;

        if (keys_ignore.includes(key)) {
            return;
        }

        if(!command_ignore.includes(key)){
            setParams($("#prompt_input").val().toLowerCase().trim());
        }

        if(cmd === "#filter"){

            $(".filterable").filter(function() {
                return $(this).parent().toggle($(this).text().toLowerCase().indexOf(params) > -1);
            });

        }
    }

    function RadionButtonFilter(){
        if(cmd === "#filter"){
            return <input onChange={handleCmdChange} type="radio" name="cmdType" checked value="filter" />;
        }
        else{
            return <input onChange={handleCmdChange} type="radio" name="cmdType" value="filter" />;
        }
    }
    function RadionButtonSearch(){
        if(cmd === "#search"){
            return <input onChange={handleCmdChange} type="radio" name="cmdType" checked value="search" />;
        }
        else{
            return <input onChange={handleCmdChange} type="radio" name="cmdType" value="search" />;
        }
    }

    return (
        <div id="console" className="console">
            <script src="https://apis.google.com/js/api.js"></script>
            <div className='cmd_type_radio'>
                <RadionButtonFilter /><label htmlFor="opt_search">Filter</label><br />
                <RadionButtonSearch /><label htmlFor="opt_filter">Search</label>
            </div>
            <div id="prompt_container" className="border">
                <div id="console_log" className="hide">
                    <ul id="console_output" className="console">
                        <li>Welcome to devity!</li>
                        {/* {
              console.logs?.map((i, index) => { return (<li key={index}>{i}</li>); })
            } */}
                    </ul>
            
                </div>
                <span id='prompt_cmd'>{cmd}&gt;</span>
                <input 
                    onKeyDown={(e) => handleKeyDown(e)}
                    onKeyUp={(e) => handleKeyUp(e)}
                    id='prompt_input'
                    maxLength="2048" 
                    type="text" 
                    aria-autocomplete="both" 
                    aria-haspopup="false" 
                    autoCapitalize="off" 
                    autoComplete="off" 
                    autoCorrect="off"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={true}
                    role="combobox" 
                    aria-controls="prompt_input"
                    aria-expanded="true"
                    spellCheck="false" 
                    title="Search" 
                    aria-label="Search">
                </input>
                <div id="search_results"></div>
            </div>
      

        </div>
    );
   
};

export default Console;

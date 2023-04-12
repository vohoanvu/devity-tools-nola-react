import * as React from "react";
import $ from "jquery";
import { useState } from "react";
import { log } from "../Utilities";
import btn_delete_sm from "../img/btn_delete_sm.png";
import { abbreviate30Chars } from "../Utilities";
const FilterCmd = "#f";


const Console = () => 
{
    const [cmd, setCmd] = useState(FilterCmd);
    const [params, setParams] = useState(" ");
    const keys_ignore = ["Shift", "Capslock", "Alt", "Control", "Alt", "Delete", "End", "PageDown", "PageUp", "Meta", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "NumLock", "Pause", "ScrollLock", "Home", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10","F11","F12"];
    const command_ignore = ["Tab", "Escape"];
    const [filterTerm, setFilterTerm] = useState("");

    const runCommand = async () => {
        switch(cmd) 
        {
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
        case FilterCmd:
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
            $(".filterable").show();
            $(".filterable").parent().show();
            $("#prompt_input").val("");
            return;
        }
   
        if(key === " " || key === "Tab"){
            if( params === "#f" || params === FilterCmd ){
                setCmd(FilterCmd)
                setParams("");
                $("#prompt_input").val("");

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

    function clearFilterTerm() {
        setFilterTerm("");
        $(".filterable").filter(function() {
            $("#prompt_input").focus();
            return $(this).parent().show();
        });
    }

    function handleKeyUp(e) {

        var key = e.key;

        if (keys_ignore.includes(key)) {
            return;
        }

        if(!command_ignore.includes(key)){
            setParams($("#prompt_input").val().toLowerCase().trim());
        }

        if(cmd === FilterCmd){

            $(".filterable").filter(function() {
                return $(this).parent().toggle($(this).text().toLowerCase().indexOf(params) > -1);
            });

        }
    }

    return (
        <div id="console" className="console">
            <div id="prompt_container" className="border">
                <span id='prompt_cmd'>{cmd}&gt;</span>
                <input 
                    onKeyDown={(e) => handleKeyDown(e)}
                    onKeyUp={(e) => handleKeyUp(e)}
                    onChange={(e) => {
                        setFilterTerm(e.target.value);
                        $(".filterable").filter(function() {
                            return $(this).parent().toggle($(this).text().toLowerCase().indexOf(params) > -1);
                        });
                    }}
                    id="prompt_input"
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
                    aria-label="Search"
                    value={filterTerm}>
                </input>
            </div>
            {
                cmd === FilterCmd && filterTerm.length !== 0 && (
                    <button className="filter-tag"
                        onClick={clearFilterTerm}>
                        <span>{ abbreviate30Chars(filterTerm) }</span>
                        <img 
                            className='img-btn delete-item' 
                            src={btn_delete_sm} 
                            title='clear' 
                            alt="remove text" 
                            aria-hidden="true"/>
                    </button>
                )
            }
        </div>
    );
   
};

export default Console;

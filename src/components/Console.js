import * as React from "react";
import $ from "jquery";
import axios from 'axios';
import {useState} from 'react';
import { log, focus_cmd } from '../Utilities'


const Console = (props) => 
{
  const [err, setErr] = useState('');
  const [cmd, setCmd] = useState('#d ');

  const keys_ignore = ['Shift', 'Capslock', 'Alt', 'Control', 'Alt', 'Delete', 'End', 'PageDown', 'PageUp', 'Meta', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'NumLock', 'Pause', 'ScrollLock', 'Home', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10','F11','F12'];
  const command_ignore = ['Tab', 'Escape'];

  const runCcommand = async () => {

    let command = cmd.slice(0,2);
    let parameters = cmd.substring(2).trim().toLowerCase();

    switch(command) {
      case '#s':
        // search
        $('.p-panel').hide();
        $('div[data-panel=RESULTS]').show();
        $('div[data-panel=RESULTS] .gear').addClass('rotate');
      
        if (parameters) {
          $("#prompt_input").val('');
            
          let search_api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAzgX2yArFJrRogwd5GCdkjmQaUwGUWMqs&cx=b2801acca79e24323&q=" + encodeURIComponent(parameters);
            
          return await axios.get(search_api)
              .then((res) => {
                  localStorage.setItem('mostReventView', "RESULTS");
                  props.passFromChildToParent(res.data.items);
                  
                  $('div[data-panel=RESULTS] .gear').removeClass('rotate');
                  setCmd('#s ');
                  log('fetched search results for ' + parameters);
              })
              .catch((error) => {
                  setErr(error);
                  console.log(err);
                  log(err);
              })
    
        } else {
          log('Attempt to search without entering search term');
        }
        return;
      case '#d':
        if(parameters === 'clear'){
          $('#console_output').empty();
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'profile'){
          $('#nav_profile').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'clipboard'){
          $('#nav_clipboard').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'notes'){
          $('#nav_notes').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'links'){
          $('#nav_links').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'libraries'){
          $('#nav_libraries').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'console'){
          $('#nav_console').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }
        if(parameters === 'all'){
          $('#nav_all').trigger('click');
          setCmd('#d ');
          $("#prompt_input").val('');
          return;
        }

        log(command + ' is not a recognized command');
        return;
      default:
        log(command + ' is not a recognized command');
        return;
      }

  };

  function handleKeyDown(e) {

    var key = e.key;
    
    if (keys_ignore.includes(key)) {
      return;
    }

    if(key === 'Escape'){
      $("#prompt_cmd").html('D#>');
      setCmd('#d ');
      $("#prompt_input").val('');
      return;
    }

    if (key==='Enter') {
        runCcommand();
        return;
    }
    
    if (key==='Backspace') {
      let c = cmd.slice(0,-1);
      setCmd(c);
      return;
    }

    if(key === ' ' || key === 'Tab'){
      let c = cmd.charAt(0);
      if( c === "#" ){
        
        let command = cmd.toLowerCase();

        if(command === "#f" || command === "#filter"){
          $("#prompt_cmd").html('#filter>');
          $("#prompt_input").val('');
          setCmd('#f ');
          
          return;
        }
  
        if(command === "#s" || command === "#search"){
          $("#prompt_cmd").html('#search>');
          $("#prompt_input").val('');
          setCmd('#s ');
          
          return;
        }
      }
    }

    if(!command_ignore.includes(key)){
      let c = cmd + key;
      setCmd(c);
    }
          
    


  }


  function handleKeyUp(e) {

    var key = e.key;

    if (keys_ignore.includes(key)) {
      return;
    }

    let command = cmd.slice(0,2);

    if(command === '#f'){
      // Then filter page
      let parameters = cmd.substring(2).trim();
      $(".lib-tbl").find(".lib-tbl-row").find('td').filter(() => {
        return $(this).toggle( $(this).text().toLowerCase().indexOf(parameters) > -1 );
      });

      // $(".filterable_parent").find(".filterable").filter(() => {
      //   var x = $(this);
      //   var y = $(this).text().toLowerCase();
      //   return $(this).parent().toggle( $(this).text().toLowerCase().indexOf(parameters) > -1 );
      // });

    }
  }


  return (
    <div id="console" className="console-max">
    
      <div id="prompt_container">
        <div id="console_log" className="hide">
            <ul id="console_output" className="console">
              <li>Welcome to devity!</li>
            {/* {
              console.logs?.map((i, index) => { return (<li key={index}>{i}</li>); })
            } */}
            </ul>
            
        </div>
        <span id='prompt_cmd'>D#&gt;</span>
          <input 
              onKeyDown={(e) => handleKeyDown(e)}
              onKeyUp={(e) => handleKeyUp(e)}
              onClick={() => focus_cmd()}
              id='prompt_input'
              maxLength="2048" 
              type="text" 
              aria-autocomplete="both" 
              aria-haspopup="false" 
              autoCapitalize="off" 
              autoComplete="off" 
              autoCorrect="off"
              autoFocus={false}
              role="combobox" 
              aria-controls="prompt_input"
              aria-expanded="true"
              spellCheck="false" 
              title="Search" 
              aria-label="Search">
          </input>
          <div id="search_results"></div>
          <span>{cmd}</span>
      </div>

    </div>
  );
   
};

export default Console;

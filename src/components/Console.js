import * as React from "react";
import $ from "jquery";
import axios from 'axios';
import {useState} from 'react';
import { log } from '../Utilities'

const Console = (props) => 
{
  const [err, setErr] = useState('');

  const fetchData = async () => {
    $('.p-panel').hide();
    $('div[data-panel=RESULTS]').show();
    $('div[data-panel=RESULTS] .gear').addClass('rotate');

    var term = $("#prompt_input").val();
  
    if (term) {
      $("#prompt_input").val('');
        
      let search_api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAzgX2yArFJrRogwd5GCdkjmQaUwGUWMqs&cx=b2801acca79e24323&q=" + encodeURIComponent(term);
        
      return await axios.get(search_api)
          .then((res) => {
              //setData(res.data.items);
              localStorage.setItem('mostReventView', "RESULTS");
              props.passFromChildToParent(res.data.items);
              
              $('div[data-panel=RESULTS] .gear').removeClass('rotate');
              log('search for ' + term);
          })
          .catch((error) => {
              setErr(error);
              console.log(err);
              log(err);
          })

    } else {
      console.log('Attempt to search without entering search term');
    }

  };

  function handleKeyDown(e) {
    var key = e.key;
    if (key==='Enter') {
        fetchData();
    }
  }

  function scroll() {
    $('#console_log').scrollBottom($('#console_log')[0].scrollHeight);
  }

  return (
    <div id="console" className="console-max">
      
      <div id="prompt_container">
        <div id="console_log" className="hide">
            <ul id="console_output" onChange={scroll} className="console">
              <li>Welcome to devity!</li>
            {/* {
              console.logs?.map((i, index) => { return (<li key={index}>{i}</li>); })
            } */}
            </ul>
        </div>
        <span id='prompt_cmd'>D#&gt;</span>
          <input 
              onKeyDown={(e) => handleKeyDown(e)}
              id='prompt_input'
              maxLength="2048" 
              type="text" 
              aria-autocomplete="both" 
              aria-haspopup="false" 
              autoCapitalize="off" 
              autoComplete="off" 
              autoCorrect="off"
              autoFocus="" 
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

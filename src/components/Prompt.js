import * as React from "react";
import $ from "jquery";
import axios from 'axios';
import {useState} from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";




const Prompt = () => {
  const [data, setData] = useState({data: []});
  //const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchData = async () => {
    $('.p-panel').hide();
    $('div[data-panel=RESULTS]').show();
    $('div[data-panel=RESULTS] .gear').addClass('rotate');

    var term = $("#prompt_input").val();

    console.log('serach for ' + term);
  
    if(term) {
      $("#prompt_input").val('');
        let search_api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAzgX2yArFJrRogwd5GCdkjmQaUwGUWMqs&cx=b2801acca79e24323&q=" + encodeURIComponent(term);
        
        return await axios.get(search_api)
            .then((res) => {
                setData(res.data.items);
                $('div[data-panel=RESULTS] .gear').removeClass('rotate');
                console.log('search for ' + term);    
            }).catch((error) => {
                setErr(error);
                console.log(err);
            })
    } else {
      console.log('Attempt tp search without entering search term');
    }

  };

  function handleKeyPress(e) {
    var key = e.key;
    if(key==='Enter'){
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
          <ul onChange={scroll} className="console">
          {console.logs?.map(i => {
                  return (
                      <li>
                        {i}                            
                      </li>
                  );
              })}
          </ul>
      </div>
        <span id='prompt_cmd'>D#&gt;</span>
                <input 
                    onKeyPress={(e) => handleKeyPress(e)}
                    id='prompt_input'
                    maxlength="2048" 
                    type="text" 
                    aria-autocomplete="both" 
                    aria-haspopup="false" 
                    autocapitalize="off" 
                    autocomplete="off" 
                    autocorrect="off"
                    autofocus="" 
                    role="combobox" 
                    aria-controls="prompt_input"
                    aria-expanded="true"
                    spellcheck="false" 
                    title="Search" 
                    aria-label="Search">
                </input>
                <div id="search_results">

                </div>
      </div>
      <div className='p-panel results hidden' data-panel='RESULTS'>
              <div className='p-chrome'>
                <img src={btn_image_config} className='gear' alt="devity gear"/>
                <span className='p-title'>Dev-Search (Please up-vote useful results!)</span>
              </div>

                <ul>
                    {Object.entries(data).map(([key, value]) => {
                        return (
                            <li data-cacheId={value.cacheId}>
                              <span>[{value.displayLink}]</span><br></br>
                              <a target='_blank' href={value.link} rel="noreferrer">{value.title}</a> 
                            <div>
                            <span dangerouslySetInnerHTML={{__html: value.htmlSnippet}} />
                        
                            </div>
                            </li>
                        );
                    })}
                </ul>

                
      </div>
    </div>
  );
   
};

export default Prompt;

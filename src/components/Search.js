import $ from "jquery";
import axios from 'axios';
import {useState} from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";

const Search = () => {
  const [data, setData] = useState({data: []});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchData = async () => {
    $('.p-panel').hide();
    $('div[data-panel=RESULTS]').show();
    $('div[data-panel=RESULTS] .gear').addClass('rotate');

    let search_api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAzgX2yArFJrRogwd5GCdkjmQaUwGUWMqs&cx=b2801acca79e24323&q=" + encodeURIComponent($("#search_input").val());
 
    return await axios.get(search_api)
        .then((res) => {
            setData(res.data.items);
            $('div[data-panel=RESULTS] .gear').removeClass('rotate');
            
    }).catch((err) => console.log(err));

  };

  return (
    <div>
      {err && <h2>{err}</h2>}

      <div id="search_container">
                <input 
                    onBlur={fetchData}
                    id='search_input'
                    maxlength="2048" 
                    type="text" 
                    aria-autocomplete="both" 
                    aria-haspopup="false" 
                    autocapitalize="off" 
                    autocomplete="off" 
                    autocorrect="off"
                    autofocus="" 
                    role="combobox" 
                    spellcheck="false" 
                    title="Search" 
                    aria-label="Search">
                </input>
                <div id="search_results">

                </div>
            </div>

            <div className='p-panel results hidden' data-panel='RESULTS'>
              <div className='p-chrome'>
                <img  src={btn_image_config} className='gear' />
                <span className='p-title'>Developer Search</span>
              </div>

                <ul>
                    {Object.entries(data).map(([key, value]) => {
                        return (
                            <li>
                            <a target='_blank' href={value.link}>{value.title}</a>
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

export default Search;

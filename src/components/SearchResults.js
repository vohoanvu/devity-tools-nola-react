import React, { useEffect, useState } from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";


export default function SearchResults(props)
{
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setSearchResults(props.data);
    }, [props.data, searchResults]);

    return (
        <div className='p-panel results hidden' data-panel='RESULTS'>
              <div className='p-chrome'>
                <img src={btn_image_config} className='gear' alt="devity gear"/>
                <span className='p-title'>Dev-Search (Please up-vote useful results!)</span>
              </div>

                <ul>
                    {
                        Object.entries(searchResults).map(([key, value]) => {
                            return (
                                <li key={key} data-cacheid={value.cacheId}>
                                    <div className='result-container'>
                                        <div className='up-vote-btn' data-result-id={value.cacheId}>
                                            <span>0</span>
                                        </div>
                                        <div>
                                            <span>[{value.displayLink}]</span><br></br>
                                            <a target='_blank' href={value.link} rel="noreferrer">{value.title}</a> 
                                            <div>
                                                <span dangerouslySetInnerHTML={{__html: value.htmlSnippet}} />
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            );
                        })
                    }
                </ul>

      </div>
    );
}
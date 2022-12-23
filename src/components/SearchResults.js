import React, { useEffect, useState } from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";


export default function SearchResults(props)
{
    const [googleSearchResults, setGoogleSearchResults] = useState([]);
    const [youtubeSearchResults, setYoutubeSearchResults] = useState([]);

    useEffect(() => {
        setGoogleSearchResults(props.googleData);
        setYoutubeSearchResults(props.youtubeData);
    }, [props.googleData, googleSearchResults,props.youtubeData, youtubeSearchResults]);

    return (
        <div className='p-panel results hidden' data-panel='RESULTS'>
            <div id='googleSearchResult'>
                <div className='p-chrome'>
                    <img src={btn_image_config} className='gear' alt="devity gear"/>
                    <span className='p-title'>Dev-Search (Please up-vote useful results!)</span>
                </div>
                <ul>
                    {
                        googleSearchResults && Object.entries(googleSearchResults).map(([key, value]) => {
                            return (
                                <li key={key} data-cacheid={value.cacheId}>
                                    <div className='result-container filterable'>
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

            <div id='youtubeSearchResults'>
                <div className='p-chrome'>
                    <img src={btn_image_config} className='gear' alt="devity gear"/>
                    <span className='p-title'>Youtube Search (Please up-vote useful results!)</span>
                </div>
                <ul>
                    {
                        youtubeSearchResults && Object.entries(youtubeSearchResults).map(([key, value]) => {
                            const youtubeUrl = "https://www.youtube.com/watch?v=" + value.id.videoId;
                            return (
                                <li key={key} data-cacheid={value.cacheId}>
                                    <div className='result-container filterable'>
                                        <div className='up-vote-btn' data-result-id={value.cacheId}>
                                            <span>0</span>
                                        </div>
                                        <div>
                                            <span>{value.snippet.channelTitle}</span><br></br>
                                            <a target='_blank' href={youtubeUrl} rel="noreferrer">{value.snippet.title}</a> 
                                            <div>
                                                <span dangerouslySetInnerHTML={{__html: value.snippet.description}} />
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            );
                        })
                    }
                </ul>
            </div>
      </div>
    );
}
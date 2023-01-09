import React, { useEffect, useState } from "react";
import btn_image_config from "../img/d_btn_ctrl_config.png";

export default function SearchResults(props)
{
  const [googleSearchResults, setGoogleSearchResults] = useState([]);
  const [youtubeSearchResults, setYoutubeSearchResults] = useState([]);
  const [searchResultSelect, setSearchResultSelect] = useState({
    search_res_google: true,
    search_res_youtube: true
  });

  useEffect(() => {
    setGoogleSearchResults(props.searchData);
    setYoutubeSearchResults(props.videoData);
    let user_selected_gg = JSON.parse(localStorage.getItem("search_res_google"));
    let user_seletect_yt = JSON.parse(localStorage.getItem("search_res_youtube"));

    if (user_selected_gg === null && user_seletect_yt === null) return;

    setSearchResultSelect({
      search_res_google: user_selected_gg,
      search_res_youtube:  user_seletect_yt
    });

  }, [props.searchData, googleSearchResults, props.videoData, youtubeSearchResults]);


  function renderVideoFigure(videoId, descriptionText, width, height) {
    return (
      <figure>
        <iframe
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Devity Youtube Search"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <figcaption>{descriptionText}</figcaption>
      </figure>
    );
  }

  function renderYoutubeResults() {
    return (
      <div id='youtubeSearchResults'>
        <div className='p-chrome'>
          <img src={btn_image_config} className='gear' alt="devity gear"/>
          <span className='p-title'>Youtube Search (Please up-vote useful results!)</span>
        </div>
        <ul>
          {
            youtubeSearchResults && Object.entries(youtubeSearchResults).map(([key, value]) => {
              const videoWidth = value.snippet.thumbnails.medium.width;
              const videoHeight = value.snippet.thumbnails.medium.height;
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
                      {
                        renderVideoFigure(value.id.videoId, value.snippet.description, videoWidth, videoHeight)
                      }
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

  function renderGoogleResults() {
    return (
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
    );
  }

  function renderBothSearchResults()
  {
    renderGoogleResults();
    renderYoutubeResults();
  }

  function renderEmptySearchResult()
  {
    return <span>Please select your search results in Profile</span>;
  }

  return (
    <div className='p-panel results hidden' data-panel='RESULTS'>
      {
        searchResultSelect.search_res_google && searchResultSelect.search_res_youtube ? 
          renderBothSearchResults() : null
      }
      {
        !searchResultSelect.search_res_google && !searchResultSelect.search_res_youtube ?
          renderEmptySearchResult() : null
      }
      {
        searchResultSelect.search_res_google || searchResultSelect.search_res_youtube ? 
          (
            <div style={{ display: "flex" }}>
              { searchResultSelect.search_res_google ? renderGoogleResults() : null }
              { searchResultSelect.search_res_youtube ? renderYoutubeResults() : null }
            </div>
          ) : null
      }
    </div>
  );
}
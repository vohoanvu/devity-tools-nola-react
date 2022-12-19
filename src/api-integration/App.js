import React, { useState } from 'react';
import { UserProvider } from "./UserContext";
import DevityPanels  from "../components/DevityPanels";
import Libraries  from "../components/Libraries";
import Profile  from "../components/Profile";
import Console from "../components/Console";
import Header  from "../components/Header";
import configData from "../config.json";
import axios from 'axios';
import '../css/App.css';
import SearchResults from '../components/SearchResults';
import {useLocation} from 'react-router-dom';
import Cookies from 'universal-cookie';
const UserMostReventView = 'mostRecentView';
const sso_url = configData.SSO_URL;
const devity_url = configData.DEVITY;
const devity_cookie = 'devity-token';
const devity_api = configData.DEVITY_API;
const cookies = new Cookies();

export default function App() 
{
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  let bearer = cookies.get(devity_cookie);
  const [searchResultData, setSearchResultData] = useState([]);
  const [isAllPanelsRendered, setIsAllPanelsRendered] = useState(false);

  // const element = document.querySelector('#post-request-async-await .article-id');

  // console.stdlog = console.log.bind(console);
  // console.logs = [];
  // console.log = function() {
  //   let i = arguments["0"];
  //   if (typeof i === 'string' || i instanceof String) {
  //     console.logs.push(Array.from(arguments));
  //     console.stdlog.apply(console, arguments);
  //   }
  // }

  if (token) {
    (async () => {
      try{
        const tk = { token: token };
        let response = await axios.post(devity_api + '/api/sessions', tk);
        if(response.status !== 200){
          window.location.replace(sso_url);
        }
        let bearer = "Devity " + response.data.id;
        let expires = "expires="+ response.data.expires;
        axios.defaults.headers.common['Authorization'] = bearer;
        cookies.set(devity_cookie, bearer, expires, { path: '/' });
        cookies.set('devity-user', response.data.user_id, expires, { path: '/' });

        window.location.replace(devity_url);
      }
      catch(error){
        console.log(Object.keys(error), error.message);
        window.location.replace(sso_url);
      }
    })();
  } else if(bearer){
    axios.defaults.headers.common['Authorization'] = bearer;
  }
  else
  {
    window.location.replace(sso_url);
  }

  function childToParent(childResultData) {
    setSearchResultData(childResultData);
  }

  function renderSelectedPanel(isAllPanelsRendered) {
    setIsAllPanelsRendered(isAllPanelsRendered);
  }

  return (

    <div className="App">
        <UserProvider>
          <div id="header_container">
            <Header 
              mostRecentPage={localStorage.getItem(UserMostReventView) ?? ''} 
              isPanelsRendered={isAllPanelsRendered}
              UserMostReventView={UserMostReventView}></Header>
            <Console passFromChildToParent={childToParent}/>
          </div>
          <DevityPanels triggerMostRecentView={renderSelectedPanel}></DevityPanels>
          <Profile devity_cookie={devity_cookie}></Profile>
          <Libraries></Libraries>
          <SearchResults style={{display:"none;"}} data={searchResultData}/>
        </UserProvider>
    </div>
    
  );
}

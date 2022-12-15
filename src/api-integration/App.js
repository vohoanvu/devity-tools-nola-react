import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { UserProvider } from "./UserContext";
import DevityPanels  from "../components/DevityPanels";
import Libraries  from "../components/Libraries";
import Profile  from "../components/Profile";
import Console from "../components/Console";
import Header  from "../components/Header";
import '../css/App.css';
import configData from "../config.json";
import {useLocation} from 'react-router-dom';
import SearchResults from '../components/SearchResults';
const UserMostReventView = 'mostRecentView';


export default function App() {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  const cookies = new Cookies();
  const sso_url = configData.SSO_URL;
  const devity_api = configData.DEVITY_API;
  const devity_url = configData.DEVITY;
  const devity_cookie = 'devity-token';
  const [searchResultData, setSearchResultData] = useState([]);
  const [isAllPanelsRendered, setIsAllPanelsRendered] = useState(false);

  // const element = document.querySelector('#post-request-async-await .article-id');

  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function() {
    let i = arguments["0"];
    if (typeof i === 'string' || i instanceof String) {
      console.logs.push(Array.from(arguments));
      console.stdlog.apply(console, arguments);
    }
  }

  let bearer = cookies.get(devity_cookie);
  
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
            mostRecentPage={localStorage.getItem(UserMostReventView)} 
            isPanelsRendered={isAllPanelsRendered}
            UserMostReventView={UserMostReventView}></Header>
          <Console passFromChildToParent={childToParent}/>
        </div>
        <DevityPanels triggerMostRecentView={renderSelectedPanel}></DevityPanels>
        <Profile></Profile>
        <Libraries></Libraries>
        <SearchResults data={searchResultData}/>
      </UserProvider>
    </div>
    
  );
}

import * as React from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { UserProvider } from "./UserContext";
import DevityPanels  from "../components/DevityPanels";
import Libraries  from "../components/Libraries";
import Profile  from "../components/Profile";
import Search from "../components/Search";
import Header  from "../components/Header";
import '../css/App.css';
import configData from "../config.json";
import {useLocation} from 'react-router-dom';
//import $ from "jquery";

function App() {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  const cookies = new Cookies();
  const sso_url = configData.SSO_URL;
  const devity_api = configData.DEVITY_API;
  const devity_url = configData.DEVITY;
  const devity_cookie = 'devity-token';

  // const element = document.querySelector('#post-request-async-await .article-id');

  let bearer = cookies.get(devity_cookie);
  
  if(token)
  {
    (async () => {
      try{
        const tk = { token: token };
        let response = await axios.post(devity_api + '/api/sessions', tk);
        if(response.status !== '200'){
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
  }
  else if(bearer){
    axios.defaults.headers.common['Authorization'] = bearer;
  }
  else
  {
    window.location.replace(sso_url);
  }



return (

    <div className="App">
      <UserProvider>
        <Header></Header>
        <Search></Search>
        <DevityPanels></DevityPanels>
        <Profile></Profile>
        <Libraries></Libraries>
      </UserProvider>
    </div>
    
  );
}

export default App;

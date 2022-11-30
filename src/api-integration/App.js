import * as React from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
import { UserProvider } from "./UserContext";
import Devity  from "./Devity";
import Profile  from "../components/Profile";
import Header  from "../components/Header";
import '../css/App.css';
import configData from "../config.json";
import {Route, Link, Routes, useLocation, BrowserRouter} from 'react-router-dom';

function App() {
  const location = useLocation();
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');
  const cookies = new Cookies();
  const sso_url = configData.SSO_URL;
  const devity_api = configData.DEVITY_API;
  const devity_url = configData.DEVITY;
  const devity_cookie = 'devity-token';

  // const element = document.querySelector('#post-request-async-await .article-id');

  let bearer = cookies.get(devity_cookie);
  if(bearer){
  axios.defaults.headers.common['Authorization'] = bearer;
  }
  else if(token)
  {
    (async () => {
      try{
        const tk = { token: token };
        let response = await axios.post(devity_api + '/api/sessions', tk);
        if(response.status != '200'){
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
  else{
    window.location.replace(sso_url);
  }



return (

    <div className="App">
      <UserProvider>
        <Header></Header>
        <Devity></Devity>
        <Profile></Profile>
      </UserProvider>
    </div>
    
  );
}

export default App;

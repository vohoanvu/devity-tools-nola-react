import React from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import Css from '../css/Css';
import "../css/Profile.css";
import { UserContext } from "../api-integration/UserContext";


export default function Profile(props)
{
  const user = React.useContext(UserContext);



  return (
    <div className="p-panel" style={{display:'none'}} data-panel="PROFILE">
      <div className='p-chrome'>
        <img  src={btn_image_config} className="gear" alt="devity gear" />
        <span className="p-title">Profile</span>
      </div>
      <div className='p-contents'>
        <div id="ctrl_add_links" className="nav-ctrl w_ctrl_add"><Css devityCookie={props.devity_cookie}/></div>
        <div className='user-card'>
          <h1>{user.name}</h1>
          <p className="title">{user.profession}</p>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
}
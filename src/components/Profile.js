import React, { useEffect } from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import Css from '../css/Css';
import { UserContext } from "../api-integration/UserContext";


export default function Profile(props)
{
  const user = React.useContext(UserContext);

  useEffect(() => {

  });


  return (
    <div className="p-panel" data-panel="PROFILE">
      <div className='p-chrome'>
        <img  src={btn_image_config} className="gear" alt="devity gear" />
        <span className="p-title">Profile</span>
        <span className="p-title">{user.name}</span>
        <span className="p-title">{user.id}</span>
      </div>
      <div className='p-contents'>
        <div id="ctrl_add_links" className="nav-ctrl w_ctrl_add"><Css devityCookie={props.devity_cookie}/></div>
      </div>
    </div>
  );
}
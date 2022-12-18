import React, { useEffect, useRef } from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import ViewModeSelection from '../css/ViewModeSelection';
import "../css/Profile.css";
import { UserContext } from "../api-integration/UserContext";
import Editable from './Editable';

export default function Profile(props)
{
  const user = React.useContext(UserContext);
  const inputRef = useRef();
  const [userProfile, setUserProfile] = React.useState({});

  useEffect(() => {
    setUserProfile(user);
  },[user])


  function handleUsernameOnChange(newName) {
    setUserProfile({
      ...userProfile,
      name: newName
    });
  }

  function handleUserProfessionOnChange(newProfession) {
    setUserProfile({
      ...userProfile,
      profession: newProfession
    });
  }

  function handleUserEmailOnChange(newEmail) {
    setUserProfile({
      ...userProfile,
      email: newEmail
    });
  }

  function updateUserProfileOnBlur(evenTarget) {

    switch (evenTarget.name) {
      case 'userName':
        setUserProfile({
          ...userProfile,
          name: evenTarget.value
        });
        break;
      case 'userProfession':
        setUserProfile({
          ...userProfile,
          profession: evenTarget.value
        });
        break;
      case 'userEmail':
        setUserProfile({
          ...userProfile,
          email: evenTarget.value
        });
        break;
      default:
        break;
    }
    //TODO: Update user profile with PUT User API
    console.log('userProfile: ', userProfile);
  }

  return (
    <div className="p-panel" data-panel="PROFILE">
      <div className='p-chrome'>
        <img src={btn_image_config} className="gear" alt="devity gear" />
        <span className="p-title">Profile</span>
      </div>
      <div className='p-contents'>
        <div id="ctrl_add_links" className="nav-ctrl w_ctrl_add"><ViewModeSelection devityCookie={props.devity_cookie}/></div>
        <div className='user-card'>
          <Editable 
            displayText={<h1>{userProfile.name}</h1>}
            inputType="input" 
            childInputRef={inputRef}
            passFromChildToParent={updateUserProfileOnBlur}>
            <input
                ref={inputRef}
                type="text"
                name="userName"
                placeholder="Enter new username"
                value={userProfile.name}
                onChange={e => handleUsernameOnChange(e.target.value)}
            />
          </Editable>
          <Editable 
            displayText={<p className="title"> {userProfile.profession} </p>}
            inputType="input" 
            childInputRef={inputRef}
            passFromChildToParent={updateUserProfileOnBlur}>
            <select 
              ref={inputRef} 
              name='userProfession' 
              value={userProfile.profession} 
              onChange={e=>handleUserProfessionOnChange(e.target.value)}>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Infrastructure Engineer">Infrastructure Engineer</option>
                <option value="UX Engineer">UX Engineer</option>
            </select>
          </Editable>
          <Editable 
            displayText={<p>{userProfile.email}</p>}
            inputType="input" 
            childInputRef={inputRef}
            passFromChildToParent={updateUserProfileOnBlur}>
            <input 
                ref={inputRef}
                type="text"
                name="userEmail"
                placeholder="Enter new email"
                value={userProfile.email}
                onChange={e => handleUserEmailOnChange(e.target.value)}
            />
          </Editable>
        </div>
      </div>
    </div>
  );
}
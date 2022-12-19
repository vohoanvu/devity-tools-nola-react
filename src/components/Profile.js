import React, { useEffect, useRef } from 'react';
import btn_image_config from "../img/d_btn_ctrl_config.png";
import ViewModeSelection from '../css/ViewModeSelection';
import "../css/Profile.css";
import { UserContext } from "../api-integration/UserContext";
import Editable from './Editable';
import axios from 'axios';
import configData from "../config.json";
import $ from "jquery";
const devity_api = configData.DEVITY_API;

export default function Profile(props)
{
  const user = React.useContext(UserContext);
  const inputRef = useRef();
  const [userProfile, setUserProfile] = React.useState({});
  const [interestsChecked, setInterestsChecked] = React.useState({});

  useEffect(() => {
    setUserProfile(user);
    let interestsCheck = {};
    if (user.user_interests) {
      user.user_interests.forEach(i => {
        console.log("for each obj...", i);
        console.log("for each Title...", i.title); 
        console.log("for each IsUserSelected...", i.IsUserSelected);  //wtf is this?
        interestsCheck[i.title] = i.IsUserSelected;
      });
    }
    setInterestsChecked(interestsCheck);
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

    console.log('userProfile: ', userProfile);

    updateProfileInDb(userProfile);
  }

  async function updateProfileInDb(putBody) {
    $('div[data-panel=Profile] .gear').addClass('rotate');
    return await axios.put(devity_api + '/api/profile', {...putBody})
          .then((response) => {
            console.log('updateProfileInDb status: ', response.status);
            return response.data;
          }).then((result) => {
            $('div[data-panel=Profile] .gear').removeClass('rotate');
            return result;
          })
          .catch((error) => console.log(error));
  }

  return (
    <div className="p-panel" style={{display:'none'}} data-panel="PROFILE">
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
        <div className='interests-card'>
          <h2>Interests</h2>
          {
            Object.entries(interestsChecked).map(([key,value], index) => {
              return (
                  <label key={index} htmlFor={key} style={{ margin: '20px' }}>
                    {key} : <input type="checkbox" name={key} value={key} checked={value} />
                  </label>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
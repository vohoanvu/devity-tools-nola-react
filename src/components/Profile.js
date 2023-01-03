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
  const userContext = React.useContext(UserContext);
  const inputRef = useRef();
  const [userProfile, setUserProfile] = React.useState({});

  useEffect(() => {
    setUserProfile(userContext.userProfile);
  },[userContext.userProfile])


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

    updateProfileInDb(userProfile);
  }

  async function updateProfileInDb(putBody) {
    $('div[data-panel=PROFILE] .gear').addClass('rotate');
    return await axios.put(devity_api + '/api/profile', {...putBody})
          .then((response) => {
            console.log('updateProfileInDb status: ', response.status);
            return response.data;
          }).then((result) => {
            $('div[data-panel=PROFILE] .gear').removeClass('rotate');
            return result;
          })
          .catch((error) => console.log(error));
  }

  async function saveUserInterestsInDb() {
    const selectedInterests = userProfile.user_interests.filter(i => i.IsUserSelected).map(i => i.Id);
    console.log("userSeletecd Interest Ids...", selectedInterests);
    $('div[data-panel=PROFILE] .gear').addClass('rotate');

    await axios.post(devity_api + '/api/userinterests', [ ...selectedInterests ])
          .then((response) => {
            console.log('saveUserInterestsInDb status: ', response.status);
            if (response.status === 200) $('div[data-panel=PROFILE] .gear').removeClass('rotate');
          })
          .catch((error) => console.log(error));
  }

  function handleInterestsOnChange(e) {
    userProfile.user_interests.forEach(i => {
      if (i.Title === e.target.name)  i.IsUserSelected = e.target.checked;
    });
  
    setUserProfile({
      ...userProfile,
      user_interests: [
        ...userProfile.user_interests
      ]
    });
  }

  async function upgradeProfileMembership() {
    if (window.confirm("Are you sure you want to upgrade to a PAID membership?")) {
      await updateProfileInDb({...userProfile, paid: true});
    }
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
          <button type="submit" disabled={true} onClick={upgradeProfileMembership}>Upgrade</button>
        </div>
        <div className='interests-card'>
          <h3>Interests</h3>
          <ul>
            {
              userProfile.user_interests?.map((i, index) => {
                return (
                  <li key={index}>
                    <input 
                        type="checkbox" 
                        id={i.Id}
                        name={i.Title} 
                        value={i.Id} 
                        checked={i.IsUserSelected} 
                        onChange={handleInterestsOnChange}/>
                    <label htmlFor={i.Id}>{i.Title}</label>
                  </li>
                );
              })
            }
          </ul>
          <button type="submit" onClick={saveUserInterestsInDb}>Save</button>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useRef } from "react";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import ViewModeSelection from "./ViewModeSelection";
import JiraCredentials from "./JiraCredentials";
import { UserContext } from "../api-integration/UserContext";
import Editable from "./Editable";
import axios from "axios";
import configData from "../config.json";
import $ from "jquery";
import btn_save from "../img/btn_save.png";
import Cookies from "universal-cookie";
const jira_token_uri = "https://id.atlassian.com/manage-profile/security/api-tokens";
const SSO_URL = configData.SSO_URL;
const COOKIE_NAME = "devity-token";
const API_URL = configData.API_URL;
const cookies = new Cookies();

export default function Profile(props)
{
    const userContext = React.useContext(UserContext);
    const inputRef = useRef();
    const [userProfile, setUserProfile] = React.useState({});
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [searchResultSelect, setSearchResultSelect] = React.useState({
        search_res_google: JSON.parse(localStorage.getItem("search_res_google")) ?? true,
        search_res_youtube: JSON.parse(localStorage.getItem("search_res_youtube")) ?? true
    });

    useEffect(() => {
        setUserProfile(userContext.userProfile);
    },[userContext.userProfile])


    function handleUsernameOnChange(newName) {
        setUserProfile({
            ...userProfile,
            name: newName
        });
        setIsEditMode(true);
    }

    function handleUserProfessionOnChange(newProfession) {
        setUserProfile({
            ...userProfile,
            profession: newProfession
        });
        setIsEditMode(true);
    }

    // function handleUserEmailOnChange(newEmail) {
    //   setUserProfile({
    //     ...userProfile,
    //     email: newEmail
    //   });
    //   setIsEditMode(true);
    // }

    function updateUserProfileOnBlur(evenTarget) {

        switch (evenTarget.name) {
        case "userName":
            setUserProfile({
                ...userProfile,
                name: evenTarget.value
            });
            break;
        case "userProfession":
            setUserProfile({
                ...userProfile,
                profession: evenTarget.value
            });
            break;
        default:
            <div id="header_container">…</div>
            break;
        }
        setIsEditMode(false);
        updateProfileInDb(userProfile);
    }

    async function updateProfileInDb(putBody) {
        $("div[data-panel=PROFILE] .gear").addClass("rotate");
        return await axios.put(API_URL + "/api/profile", {...putBody})
            .then((response) => {
                console.log("updateProfileInDb status: ", response.status);
                return response.data;
            }).then((result) => {
                $("div[data-panel=PROFILE] .gear").removeClass("rotate");
                return result;
            })
            .catch((error) => console.log(error));
    }

    async function saveUserInterestsInDb() {
        const selectedInterests = userProfile.user_interests.filter(i => i.IsUserSelected).map(i => i.Id);
        console.log("userSeletecd Interest Ids...", selectedInterests);
        $("div[data-panel=PROFILE] .gear").addClass("rotate");

        await axios.post(API_URL + "/api/userinterests", [ ...selectedInterests ])
            .then((response) => {
                console.log("saveUserInterestsInDb status: ", response.status);
                if (response.status === 200) {
                    setIsEditMode(false);
                    $("div[data-panel=PROFILE] .gear").removeClass("rotate");
                }
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
        setIsEditMode(true);
    }

    function handleSearchResultSelectOnChange(e) {
        localStorage.setItem("search_res_google", $("#google-results").prop("checked"));
        localStorage.setItem("search_res_youtube", $("#youtube-results").prop("checked"));

        setSearchResultSelect({
            ...searchResultSelect,
            [e.target.name]: e.target.checked
        });
    }

    async function upgradeProfileMembership() {
        if (window.confirm("Are you sure you want to upgrade to a PAID membership?")) {
            await updateProfileInDb({...userProfile, paid: true});
        }
    }

    function getUTCDateTime(dateTimeString) {
        return new Date(dateTimeString).toUTCString();
    }

    async function logOutRequest() {
        await axios.delete(API_URL + "/api/sessions")
            .then(response => {
                if (response.status === 200) {
                    console.log("Successfully deleted SESSION", response.status);
                    cookies.remove(COOKIE_NAME, { path: "/" });
                    window.location.replace(SSO_URL);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="p-panel" style={{display:"none"}} data-panel="PROFILE">
            <div className='p-chrome chrome-btn-profile'>
                <img src={btn_image_config} className="gear" alt="devity gear" />
                <span className="p-title">Profile</span>
                {
                    isEditMode && (
                        <img 
                            className='img-btn save' 
                            onClick={saveUserInterestsInDb} 
                            src={btn_save} alt="save widget"
                            aria-hidden="true"/>
                    )
                }
        
            </div>
            <div className='p-contents profile'>
                <div className='settings card'>
                    <h1>Settings</h1>
                    <p>Local storage settings</p>
                    <h3>Theme</h3>
                    <ViewModeSelection devityCookie={props.COOKIE_NAME}/>
                    <div className='select-results-card'>
                        <h3>Search result types</h3>
                        <p>Select results types for search command.</p>
                        <form>
                            <ul>
                                <li>
                                    <input 
                                        onClick={() => document.getElementById("google-results").click()}
                                        type="checkbox" 
                                        id="google-results" 
                                        name="search_res_google"
                                        checked={searchResultSelect.search_res_google}
                                        onChange={handleSearchResultSelectOnChange}/>
                                    <label htmlFor="google-results">Google Search Results</label>
                                </li>
                                <li>
                                    <input 
                                        onClick={() => document.getElementById("youtube-results").click()}
                                        type="checkbox" 
                                        id="youtube-results" 
                                        name="search_res_youtube"
                                        checked={searchResultSelect.search_res_youtube}
                                        onChange={handleSearchResultSelectOnChange}/>
                                    <label htmlFor="youtube-results">Youtube Search Results</label>
                                </li>
                            </ul>
                        </form>
                    </div>
                    <div>
                        <h3>Atlassian API Credentials (Jira &amp; Confluence)</h3>
                        <p>
                            You can create a token in Atlassian Cloud 
                            <a href={jira_token_uri} target="_blank" rel="noreferrer">here</a>
                        </p>
                        <JiraCredentials />
                    </div>

                </div>
                <div className='personal card'>
                    <h1>Techical Profile</h1>
                    <p>Help the Technocore AIs help you by filling out your technical profile.</p>
                    <h2>{ userProfile.paid ? "Premium Account" : "Free Account" }</h2>
                    <button type="submit" hidden onClick={upgradeProfileMembership}>Upgrade</button>

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
                    </Editable><br />
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
                    </Editable><br />

                    <h2>Skills, Interests</h2>
                    <ul>
                        {
                            userProfile.user_interests?.map((i, index) => {
                                return (
                                    <li 
                                        key={index}
                                        onClick={() => document.getElementById(i.Id).click()}
                                        aria-hidden="true">
                                        <input 
                                            type="checkbox" 
                                            onClick={() => document.getElementById(i.Id).click()}
                                            id={i.Id}
                                            name={i.Title} 
                                            value={i.Id} 
                                            checked={i.IsUserSelected} 
                                            onChange={handleInterestsOnChange}/>
                                        <label 
                                            onClick={() => document.getElementById(i.Id).click()} htmlFor={i.Id} 
                                            aria-hidden="true">{i.Title}</label>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <br />
                    <h3>Data Analysis</h3>
                    <label> Widget Count : {userProfile.widget_count} </label>
                    <br/>
                    <label> Data Size in DB : {userProfile.datasize} </label>
                    <br/>
                    <br/>
                    <h1>Session Info</h1>
                    <label> Token Expiration Date (UTC) : {getUTCDateTime(userProfile.session_info?.expire_date)} </label>
                    <br/>
                    <button onClick={logOutRequest} className="logout-btn">
                        LOG OUT
                    </button>
                    <br/>
                    <label> Bearer Token : Devity {userProfile.session_info?.session_id} </label>
                </div>
            </div>
        </div>
    );
}
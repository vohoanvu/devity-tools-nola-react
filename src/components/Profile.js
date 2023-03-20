import React, { useEffect, useRef, useState } from "react";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_copy from "../img/btn_copy.png";
import ViewModeSelection from "./ViewModeSelection";
import { UserContext } from "../api-integration/UserContext";
import Editable from "./Editable";
import configData from "../config.json";
import $ from "jquery";
import btn_save from "../img/btn_save.png";
import Cookies from "universal-cookie";
const SSO_URL = configData.SSO_URL;
const cookies = new Cookies();

export default function Profile({ COOKIE_NAME, axios })
{
    const userContext = React.useContext(UserContext);
    const inputRef = useRef();
    const [userProfile, setUserProfile] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchResultSelect, setSearchResultSelect] = React.useState({
        search_res_google: JSON.parse(localStorage.getItem("search_res_google")) ?? true,
        search_res_youtube: JSON.parse(localStorage.getItem("search_res_youtube")) ?? true
    });
    const [openAiApiKey, setOpenAiApiKey] = useState("");

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

        updateProfileInDb(userProfile);
    }

    async function updateProfileInDb(putBody) {
        $("div[data-panel=PROFILE] .gear").addClass("rotate");
        return await axios.put("/api/profile", {...putBody})
            .then((response) => {
                console.log("updateProfileInDb status: ", response.status);
                return response.data;
            }).then((result) => {
                $("div[data-panel=PROFILE] .gear").removeClass("rotate");
                console.log("Profile Update result: ", result);
                userContext.setUserProfile({
                    ...userContext.userProfile,
                    name: result.name,
                    email: result.email,
                    profession: result.profession
                });
                return result;
            })
            .catch((error) => console.log(error));
    }

    async function saveUserInterestsInDb() {
        const selectedInterests = userProfile.user_interests.filter(i => i.IsUserSelected).map(i => i.Id);
        console.log("userSeletecd Interest Ids...", selectedInterests);
        $("div[data-panel=PROFILE] .gear").addClass("rotate");

        await axios.post("/api/userinterests", [ ...selectedInterests ])
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
        await axios.delete("/api/sessions")
            .then(response => {
                if (response.status === 200) {
                    console.log("Successfully deleted SESSION", response.status);
                    cookies.remove(COOKIE_NAME, { path: "/" });
                    localStorage.clear();
                    window.location.replace(SSO_URL);
                }
            })
            .catch(err => console.log(err));
    }

    function handleCopyClick(btnType) 
    {
        let copyData = "";
        if (btnType === "session-token-btn") {
            copyData = "Devity " + userProfile.session_info?.session_id;
        } 
        if (btnType === "ip-address-btn") {
            copyData = userProfile.Ip_Address;
        }
        if (btnType === "openai-key") {
            copyData = localStorage.getItem("openai-api-key");
        }
        $("span.copy-text-session").animate({ opacity: "0.1" }, "fast");
        $("span.copy-text-session").animate({ opacity: "1" }, "fast");

        navigator.clipboard.writeText(copyData).then(function() {
            console.log(copyData);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });
    }

    return (
        <div className="p-panel border" style={{display:"none"}} data-panel="PROFILE">
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
                    <h1>Local Settings</h1>
                    <p>Local storage settings in this column are used for security and performance. If you clear your cache they will be erased.</p>
                    <h3>Theme</h3>
                    <ViewModeSelection devityCookie={COOKIE_NAME}/>
                    <div className='select-results-card'>
                        <h3>Search result types</h3>
                        <p>Select results types for search command.</p>
                        <form>
                            <ul>
                                <li className="border">
                                    <input 
                                        onClick={() => document.getElementById("google-results").click()}
                                        type="checkbox" 
                                        id="google-results" 
                                        name="search_res_google"
                                        checked={searchResultSelect.search_res_google}
                                        onChange={handleSearchResultSelectOnChange}/>
                                    <label htmlFor="google-results">Google Search Results</label>
                                </li>
                                <li className="border">
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
                        <label>
                            OpenAI API Key:
                            <input 
                                type="new-password" 
                                value={openAiApiKey} 
                                onChange={(e) => {
                                    setOpenAiApiKey(e.target.value);
                                }} 
                                onBlur={(e) => {
                                    localStorage.setItem("openai-api-key", e.target.value);
                                    const event = new Event("storageUpdated");
                                    window.dispatchEvent(event);
                                }}/>
                        </label>
                        <br/>
                        <br/>
                        <p>You can find your API key at <a href="https://platform.openai.com/account/api-keys">https://platform.openai.com/account/api-keys.</a></p>
                    </div>
                </div>


                <div className='personal card'>
                    <h1>Profile Settings</h1>
                    <p>Help the Technocore AIs help you by filling out your technical profile! Profile settings in this column are persisted on api.devity-tools.com.</p>
                    <h2>{ userProfile.paid ? "Premium Account" : "Free Account" }</h2>
                    <p>{ userProfile.paid ? "Thanks for your support!" : "Paid accounts have higher data and rate-limits. If you enjoy the tool consider supporting it by upgrading to a paid account." }</p>
                    <label> Data: {userProfile.datasize} used of 20KB</label>
                    <br/>
                    <label> Widgets: {userProfile.widget_count} </label>
                    <br/>

                    <button type="submit" hidden onClick={upgradeProfileMembership}>Upgrade</button>

                    <h2>User Name:</h2>
                    <p>Click on your user name or profession to update.</p>
                    <Editable 
                        displayText={<label>{userProfile.name}</label>}
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
                        displayText={<label className="title"> {userProfile.profession || "Select Profession"} </label>}
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
                                    <li className="border"
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
                    
                    <div id="session_summary">
                        <h1>Session Info (<a href="https://api.devity-tools.com/">api.devity-tools.com</a>)</h1>
                        <div className="copy-container">
                            <label> Bearer Token : <span className="copy-text-session">Devity {userProfile.session_info?.session_id}</span></label>
                            <button 
                                onClick={()=> handleCopyClick("session-token-btn")} 
                                title="Copy to clipboard" 
                                style={{
                                    backgroundRepeat: "no-repeat", 
                                    backgroundSize: "contain", 
                                    backgroundColor: "transparent",
                                    width: "30px", 
                                    height: "30px",
                                    border: "none",
                                    cursor: "pointer"
                                }}>
                                <img src={btn_copy} alt="Copy to clipboard"/>
                            </button>
                        </div>
                        
                        <br/>
                        <label> Token Expiration Date (UTC) : {getUTCDateTime(userProfile.session_info?.expire_date)} </label>
                        <br/>
                        <br/>
                        <div className="copy-container">
                            <label >User IP address: <span className="copy-text-ip">{userProfile.Ip_Address}</span></label>
                            <button 
                                onClick={()=>handleCopyClick("ip-address-btn")} 
                                title="Copy to clipboard" 
                                style={{ 
                                    backgroundRepeat: "no-repeat", 
                                    backgroundSize: "contain", 
                                    backgroundColor: "transparent",
                                    width: "30px", 
                                    height: "30px",
                                    border: "none",
                                    cursor: "pointer"
                                }}>
                                <img src={btn_copy} alt="Copy to clipboard"/>
                            </button>
                        </div>
                        <br/>
                        <button onClick={logOutRequest} className="logout-btn">
                            LOG OUT & EXPIRE TOKEN
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
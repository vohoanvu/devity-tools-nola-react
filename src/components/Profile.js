import React, { useEffect, useRef } from "react";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_copy from "../img/btn_copy.png";
import ViewModeSelection from "./ViewModeSelection";
import { UserContext } from "../api-integration/UserContext";
import Editable from "./Editable";
import configData from "../config.json";
import $ from "jquery";
import Cookies from "universal-cookie";
import OpenAIModelList from "../components/OpenAiModelList";
import { useSelector, useDispatch } from "react-redux";
import { setOpenAiApiKey, setUserProfileData } from "../redux/actions/UserProfileActions";
const SSO_URL = configData.SSO_URL;
const cookies = new Cookies();

export default function Profile({ COOKIE_NAME, axios })
{
    const userContext = React.useContext(UserContext);
    const inputRef = useRef();
    const userProfile = useSelector((state) => state.UserProfileReducer.userProfileData);
    const openAIApiKey = useSelector((state) => state.UserProfileReducer.openAiApiKey);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setUserProfileData(userContext.userProfile));
    },[dispatch, userContext.userProfile])


    function handleUsernameOnChange(newName) {
        dispatch(setUserProfileData({
            ...userProfile,
            name: newName
        }));
    }

    function handleUserProfessionOnChange(newProfession) {
        dispatch(setUserProfileData({
            ...userProfile,
            profession: newProfession
        }));
    }

    function updateUserProfileOnBlur(evenTarget) {

        switch (evenTarget.name) {
        case "userName":
            dispatch(setUserProfileData({
                ...userProfile,
                name: evenTarget.value
            }));
            break;
        case "userProfession":
            dispatch(setUserProfileData({
                ...userProfile,
                profession: evenTarget.value
            }));
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
            $("span.copy-text-session").animate({ opacity: "0.1" }, "fast");
            $("span.copy-text-session").animate({ opacity: "1" }, "fast");
        } 
        if (btnType === "ip-address-btn") {
            copyData = userProfile.Ip_Address;
            $("span.copy-text-ip").animate({ opacity: "0.1" }, "fast");
            $("span.copy-text-ip").animate({ opacity: "1" }, "fast");
        }
        if (btnType === "openai-key") {
            copyData = openAIApiKey;
            $("label.copy-openai-key").animate({ opacity: "0.1" }, "fast");
            $("label.copy-openai-key").animate({ opacity: "1" }, "fast");
        }

        navigator.clipboard.writeText(copyData).then(function() {
            console.log(copyData);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });
    }

    function updateApiKeyOnBlur(target) 
    {
        localStorage.setItem("openai-api-key", target.value);
        dispatch(setOpenAiApiKey(target.value));
    }

    return (
        <div className="p-panel border" style={{display:"none"}} data-panel="PROFILE">
            <div className='p-chrome chrome-btn-profile'>
                <img src={btn_image_config} className="gear" alt="devity gear" />
                <span className="p-title">Profile</span>
        
            </div>
            <div className='p-contents profile'>
                <div className='settings card'>
                    <h1>Local Settings</h1>
                    <p>Settings in this column are persisted in local browser storage. If you clear your cache they will be erased.</p>
                    <div>
                        <h3>OpenAI API Key</h3>
                        <p>Your OpenAI key can be found <a target="_blank" href="https://platform.openai.com/account/api-keys" rel="noreferrer">here</a>.</p>
                        <div className="copy-container">
                            <Editable 
                                displayText={
                                    <label className="copy-openai-key" title="Click here to update field">{!openAIApiKey ? "000-000-000-000" : openAIApiKey}</label>
                                }
                                inputType="input" 
                                childInputRef={inputRef}
                                passFromChildToParent={updateApiKeyOnBlur}>
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    value={openAIApiKey} 
                                    onChange={(e) => {
                                        dispatch(setOpenAiApiKey(e.target.value));
                                    }}/>
                            </Editable>
                            {
                                openAIApiKey && 
                                <button 
                                    onClick={()=> handleCopyClick("openai-key")} 
                                    title="Copy to clipboard" 
                                    className="copy-clipboard-btn">
                                    <img src={btn_copy} alt="Copy to clipboard"/>
                                </button>
                            }
                        </div>
                    </div>
                    <div>
                        <h3>OpenAI GPT Model</h3>
                        <div>
                            <OpenAIModelList/>
                        </div>
                    </div>
                    <h3>Theme</h3>
                    <ViewModeSelection devityCookie={COOKIE_NAME}/>
                </div>


                <div className='personal card'>
                    <h1>Profile Settings</h1>
                    <p>Settings in this column are persisted on api.devity-tools.com.</p>
                    <h2>{ userProfile.paid ? "Premium Account" : "Free Account" }</h2>
                    <p>{ userProfile.paid ? "Thanks for your support!" : "If you enjoy the tool consider supporting it by upgrading to a paid account. Premium accounts have higher data limits." }</p>
                    <label> Data: {userProfile.datasize} used of {userProfile.datalimit}</label>
                    <br/>
                    <label> Widgets: {userProfile.widget_count} </label>
                    <br/>

                    <button type="submit" hidden onClick={upgradeProfileMembership}>Upgrade</button>

                    <h2>User</h2>
                    <p>Click on your user name or profession to update.</p>
                    <Editable 
                        displayText={<label title="Click here to update field">{userProfile.name}</label>}
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
                        displayText={<label title="Click here to update field" className="title"> {userProfile.profession || "Select Profession"} </label>}
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
                    
                    <div id="session_summary">
                        <h1>Session Info (<a href="https://api.devity-tools.com/">api.devity-tools.com</a>)</h1>
                        <div className="copy-container">
                            <label> Bearer Token : <span className="copy-text-session">Devity {userProfile.session_info?.session_id}</span></label>
                            <button 
                                onClick={()=> handleCopyClick("session-token-btn")} 
                                title="Copy to clipboard" 
                                className="copy-clipboard-btn">
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
                                className="copy-clipboard-btn">
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
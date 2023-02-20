import React, { useState } from "react";
import { UserProvider } from "./UserContext";
import DevityPanels  from "../components/DevityPanels";
import Libraries  from "../components/Libraries";
import Profile  from "../components/Profile";
import Console from "../components/Console";
import Header  from "../components/Header";
import CONFIG from "../config.json";
import DevityBaseAxios from "../components/DevityAxiosConfig";
import "../css/App.css";
import SearchResults from "../components/SearchResults";
import {useLocation} from "react-router-dom";
import Cookies from "universal-cookie";
import ConfirmationDialog from "../components/ConfirmationDialog";
const SSO_URL = CONFIG.SSO_URL;
const DEVITY_URL = CONFIG.DEVITY;
const COOKIE_NAME = "devity-token";
const cookies = new Cookies();

export default function App() 
{
    const search = useLocation().search;
    const token = new URLSearchParams(search).get("token");
    let bearer = cookies.get(COOKIE_NAME);
    const [searchResult, setSearchResult] = useState([]);
    const [videoResult, setvideoResult] = useState([]);
    const [isAllPanelRendered, setIsAllPanelRendered] = useState(false);
    const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);
    const axios = DevityBaseAxios(()=> setIsRateLimitModalOpen(true));

    if (bearer && !token) {
        axios.defaults.headers.common["Authorization"] = bearer;
    }
    if (token) {
        bearer !== null && bearer !== undefined && cookies.remove(COOKIE_NAME, { path: "/" });
        AuthenticateUser(token);
    }
    if (!token && !bearer) {
        window.location.replace(SSO_URL);
    }


    function renderResults(childResultData) {
        setSearchResult(childResultData);
    }

    function renderVideoResults(childResultData) {
        setvideoResult(childResultData);
    }

    function renderSelectedPanels(isAllPanelRendered) {
        setIsAllPanelRendered(isAllPanelRendered);
    }

    async function AuthenticateUser(inputToken)
    {
        try {
            const tk = { token: inputToken };
            let response = await axios.post(API_URL + "/api/sessions", tk);
            if (response.status !== 200) {
                console.log("POST session failed: ", response);
                window.location.replace(SSO_URL);
            }

            let bearer = "Devity " + response.data.id;
            let expires = "expires="+ response.data.expires;
            axios.defaults.headers.common["Authorization"] = bearer;
            cookies.set(COOKIE_NAME, bearer, expires, { path: "/" });

            window.location.replace(DEVITY_URL);
        }
        catch(error) {
            console.log(Object.keys(error), error.message);
            //window.location.replace(SSO_URL);
        }
    }

    return (

        <div className="App">
            <ConfirmationDialog
                title="Request Limits reached!"
                message="You have exceeded the rate limit. Please wait 5 minutes and try again."
                isDialogOpen={isRateLimitModalOpen}
            />
            <UserProvider axios={axios}>
                <div id="header_container">
                    <Console 
                        passGoogleResultFromChildToParent={renderResults}
                        passvideoResultFromChildToParent={renderVideoResults}
                    />
                    <Header isPanelsRendered={isAllPanelRendered}></Header>
                    
                </div>
                <DevityPanels signalAllPanelRendered={renderSelectedPanels} axios={axios}></DevityPanels>
                <Profile COOKIE_NAME={COOKIE_NAME} axios={axios}></Profile>
                <Libraries></Libraries>
                <SearchResults
                    searchData={searchResult}
                    videoData={videoResult}/>
            </UserProvider>
        </div>
    );
}

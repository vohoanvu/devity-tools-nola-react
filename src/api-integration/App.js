import React, { useState } from "react";
import { UserProvider } from "./UserContext";
import DevityPanels from "../components/DevityPanels.js";
import Libraries  from "../components/Libraries";
import Profile  from "../components/Profile";
import Console from "../components/Console";
import Header  from "../components/Header";
import CONFIG from "../config.json";
import DevityBaseAxios from "../components/DevityAxiosConfig";
import "../css/App.css";
import SearchResults from "../components/SearchResults";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ChatGPT from "../components/Widgets/DevityChatGPT";
const COOKIE_NAME = "devity-token";

export default function App() 
{
    const [searchResult, setSearchResult] = useState([]);
    const [videoResult, setvideoResult] = useState([]);
    const [isAllPanelRendered, setIsAllPanelRendered] = useState(false);
    const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);
    const [is401ModalOpen, setIs401ModalOpen] = useState(false);
    const axios = DevityBaseAxios(()=> setIsRateLimitModalOpen(true), ()=> setIs401ModalOpen(true));
    const [IsOpenAILoggedIn, setIsOpenAILoggedIn] = useState(false);


    function renderResults(childResultData) {
        setSearchResult(childResultData);
    }

    function renderVideoResults(childResultData) {
        setvideoResult(childResultData);
    }

    function renderSelectedPanels(isAllPanelRendered) {
        setIsAllPanelRendered(isAllPanelRendered);
    }

    function renderSSOModalMessage()
    {
        return (<>
            Your session has expired or otherwise does not exit. Visit your SSO provider to log back in:
            <br/>
            <a href={CONFIG.SSO_URL}>SSO Login</a>
        </>);
    }

    return (

        <div className="App">
            <ConfirmationDialog
                title="Request Limits reached!"
                message="You have exceeded the rate limit. Please wait 5 minutes and try again."
                isDialogOpen={isRateLimitModalOpen}
                modalType={429}
            /> 
            <ConfirmationDialog
                title="Unauthorized User!"
                message={renderSSOModalMessage()}
                isDialogOpen={is401ModalOpen}
                modalType={401}
            />
            <UserProvider axios={axios} setIs402ModalOpen={setIs401ModalOpen}>
                <div id="header_container">
                    <Console 
                        passGoogleResultFromChildToParent={renderResults}
                        passvideoResultFromChildToParent={renderVideoResults}
                    />
                    <Header 
                        isPanelsRendered={isAllPanelRendered}
                        IsOpenAILoggedIn={IsOpenAILoggedIn}
                        setIsOpenAILoggedIn={setIsOpenAILoggedIn}
                    ></Header>
                    
                </div>
                <ChatGPT
                    IsOpenAILoggedIn={IsOpenAILoggedIn}
                    setIsOpenAILoggedIn={setIsOpenAILoggedIn}/>
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

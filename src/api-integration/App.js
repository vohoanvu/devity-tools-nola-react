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
import ConfirmationDialog from "../components/ConfirmationDialog";
import ChatGPT from "../components/DevityChatGPT";
const COOKIE_NAME = "devity-token";

export default function App() 
{
    const [isAllPanelRendered, setIsAllPanelRendered] = useState(false);
    const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);
    const [is401ModalOpen, setIs401ModalOpen] = useState(false);
    const [isAINoteCreated, setIsAINoteCreated] = useState(false);
    const [isDataLimitModalOpen, setIsDataLimitModalOpen] = useState(false);
    const axios = DevityBaseAxios(()=> setIsRateLimitModalOpen(true), ()=> setIs401ModalOpen(true));


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
                    <Console />
                    <Header isPanelsRendered={isAllPanelRendered}></Header>
                </div>
                <ChatGPT 
                    axios={axios}
                    isAINoteCreated={isAINoteCreated}
                    setIsAINoteCreated={setIsAINoteCreated}
                    setIsDataLimitModalOpen={setIsDataLimitModalOpen}/>
                <DevityPanels 
                    isAINoteCreated={isAINoteCreated}
                    signalAllPanelRendered={renderSelectedPanels} 
                    axios={axios}
                    isDataLimitModalOpen={isDataLimitModalOpen}
                    setIsDataLimitModalOpen={setIsDataLimitModalOpen}></DevityPanels>
                <Profile COOKIE_NAME={COOKIE_NAME} axios={axios}></Profile>
                <Libraries></Libraries>
            </UserProvider>
        </div>
    );
}

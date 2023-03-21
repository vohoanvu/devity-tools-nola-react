import * as React from "react";
import Cookies from "universal-cookie";
import {useLocation} from "react-router-dom";
import CONFIG from "../config.json";
const cookies = new Cookies();
export const UserContext = React.createContext();


export function UserProvider({ children, axios, setIs402ModalOpen })
{
    const [userProfile, setUserProfile] = React.useState({});
    const [activePanel, setActivePanel] = React.useState(localStorage.getItem("curr_view") ?? "");
    const bearer = cookies.get("devity-token");
    const devityUrl = useLocation().search;
    const token = new URLSearchParams(devityUrl).get("token");

    React.useEffect(() => {
        //Performs ordered chaining calls for POST Session => GET Profile => GET UserInterests
        //Ensuring no 401 exception while idling the app and no requests wasted
        if (bearer && !token) {
            axios.defaults.headers.common["Authorization"] = bearer;
            fetchUser(bearer).then(async (result) => { 
                setUserProfile({
                    ...result
                });
            });
        } else if (token) {
            console.log("Before POST Session is called...");
            bearer !== null && bearer !== undefined && cookies.remove("devity-token", { path: "/" });
            AuthenticateUser(token).then(result => {
                fetchUser(bearer).then(async (result) => { 
                    setUserProfile({
                        ...result
                    });
                });
            });
        } else if (!token && !bearer) {
            setIs402ModalOpen(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bearer, localStorage.getItem("jira_token"), localStorage.getItem("jira_domain"), localStorage.getItem("jira_user_id")]);

    async function AuthenticateUser(inputToken)
    {
        const tk = { token: inputToken };
        console.log("POST api/sessions is called...");
        await axios.post("/api/sessions", tk)
            .then(response => {
                let bearer = "Devity " + response.data.id;
                let expiresDate = new Date(response.data.expires);
                axios.defaults.headers.common["Authorization"] = bearer;
                console.log("Auth User cookies Expiration: ", expiresDate);
                cookies.set("devity-token", bearer, { path: "/", expires: expiresDate });
                window.location.replace(CONFIG.DEVITY);
                return response.data;
            }).then(result => result)
            .catch(error => console.log(error, error.message))
    }

    async function fetchUser(bearer) {
        console.log("GET api/profile is called...Current bearer: ", bearer);
        return await axios.get("/api/profile")
            .then((response) => {
                //console.log("UserProfile... ", response.data);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <UserContext.Provider value={{ userProfile, activePanel, setActivePanel, setUserProfile }}>
            {children}
        </UserContext.Provider>
    );
}
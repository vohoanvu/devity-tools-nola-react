import axios from "axios";
import * as React from "react";
import configData from "../config";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const devity_api = configData.DEVITY_API;
export const UserContext = React.createContext();


export function UserProvider({ children, ...props })
{
    const [userProfile, setUserProfile] = React.useState({});
    const [activePanel, setActivePanel] = React.useState(localStorage.getItem("curr_view") ?? "DEVITY");
    const bearer = cookies.get("devity-token");

    React.useEffect(() => {

        async function fetchUser(bearer) {
            return await axios.get(devity_api + "/api/profile")
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    if (error.response.status === 401) axios.defaults.headers.common["Authorization"] = bearer;
                    console.log(error);
                });
        }

        fetchUser(bearer).then(async (result) => { 
            let userInterests = await fetchUserInterests();
            setUserProfile({
                ...result,
                user_interests: userInterests
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bearer, localStorage.getItem("jira_token"), localStorage.getItem("jira_domain"), localStorage.getItem("jira_user_id")]);

    async function fetchUserInterests() {
        return await axios.get(devity_api + "/api/userinterests")
            .then((response) => {
                return response.data;
            }).then((result) => {
                return result;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // function fetchJiraCredsFromLocalStorage() 
    // {
    //     const jiraCreds = {
    //         jiraToken : localStorage.getItem("jira_token") ?? "", //"a4EHm80xhC4csD0FXMS4051D";
    //         jiraDomain : localStorage.getItem("jira_domain") ?? "", //"devity-tools.atlassian.net";
    //         jiraUserId : localStorage.getItem("jira_user_id") ?? "" //"vu@noladigital.net";
    //     };

    //     return jiraCreds;
    // }


    return (
        <UserContext.Provider value={{ userProfile, activePanel, setActivePanel}}>
            {children}
        </UserContext.Provider>
    );
}
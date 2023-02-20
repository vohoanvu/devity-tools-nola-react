import axios from "axios";
import * as React from "react";
import configData from "../config.json";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const devity_api = configData.API_URL;
export const UserContext = React.createContext();


export function UserProvider({ children, ...props })
{
    const [userProfile, setUserProfile] = React.useState({});
    const [activePanel, setActivePanel] = React.useState(localStorage.getItem("curr_view") ?? "");
    const bearer = cookies.get("devity-token");

    React.useEffect(() => {
        async function fetchUser(bearer) {
            return await axios.get(devity_api + "/api/profile")
                .then((response) => {
                    if (response.status === 401) {
                        axios.defaults.headers.common["Authorization"] = bearer;
                        return;
                    }
                    return response.data;
                })
                .catch((error) => {
                    console.log(error);
                    window.location.replace(configData.SSO_URL);
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
                if (response.status === 401) {
                    axios.defaults.headers.common["Authorization"] = cookies.get("devity-token");
                    return;
                }
                return response.data;
            }).then((result) => {
                return result;
            })
            .catch((error) => {
                console.log(error);
            });
    }


    return (
        <UserContext.Provider value={{ userProfile, activePanel, setActivePanel}}>
            {children}
        </UserContext.Provider>
    );
}
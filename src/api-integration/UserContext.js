import axios from "axios";
import * as React from "react";
import configData from "../config.json";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const devity_api = configData.DEVITY_API;
export const UserContext = React.createContext();


export function UserProvider({ children, ...props })
{
  const [userProfile, setUserProfile] = React.useState({});
  const bearer = cookies.get('devity-token');
  
  async function fetchUserInterests() {

    return await axios.get(devity_api + '/api/userinterests')
        .then((response) => {
          return response.data;
        }).then((result) => {
          return result;
        })
        .catch((error) => {
          console.log(error);
        });
  }

  React.useEffect(() => {
    async function fetchUser(bearer) {

      return await axios.get(devity_api + '/api/profile')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response.status === 401) axios.defaults.headers.common['Authorization'] = bearer;
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
  },[bearer]);



  return (
    <UserContext.Provider value={userProfile}>
      {children}
    </UserContext.Provider>
  );
}
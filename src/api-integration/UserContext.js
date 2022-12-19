import axios from "axios";
import * as React from "react";
import configData from "../config.json";
const devity_api = configData.DEVITY_API;



export const UserContext = React.createContext();

async function fetchUser() {
  return await axios.get(devity_api + '/api/profile')
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}


export function UserProvider({ children })
{
  const [userProfile, setUserProfile] = React.useState({});

  React.useEffect(() => {
    fetchUser().then((result) => { 
      setUserProfile(result);
    });
  },[]);

  async function fetchAllInterests() {
      return await axios.get(devity_api + '/api/userinterests/all')
          .then((response) => {
            return response.data;
          }).then((result) => {
            return result;
          })
          .catch((error) => {
            console.log(error);
          });
  }

  return (
    <UserContext.Provider value={userProfile}>
      {children}
    </UserContext.Provider>
  );
}
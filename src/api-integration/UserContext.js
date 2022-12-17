import axios from "axios";
import * as React from "react";
import configData from "../config.json";
import Cookies from 'universal-cookie';
const devity_api = configData.DEVITY_API;



export const UserContext = React.createContext();

async function fetchUser() {
  const cookies = new Cookies();
  const userId = cookies.get('devity-user');
  return await axios.get(devity_api + '/api/users/' + userId)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}

export function UserProvider({ children, ...props }) 
{
  const [userProfile, setUserProfile] = React.useState({});

  React.useEffect(() => {
    fetchUser().then((result) => { 
      setUserProfile(result) 
    });
  },[]);


  return (
    <UserContext.Provider value={userProfile}>
      {children}
    </UserContext.Provider>
  );
}

// return new Promise((resolve) => {
//   setTimeout(() => {
//     resolve({ id: 1, name: "Ben" });
//   }, 1000);
// });
import axios from "axios";
import * as React from "react";
import configData from "../config.json";
import Cookies from 'universal-cookie';
const devity_api = configData.DEVITY_API;



export const UserContext = React.createContext();

async function fetchUser() {
  // const cookies = new Cookies();
  // const userId = cookies.get('devity-user');
  // return await axios.get(devity_api + '/api/users/' + userId)
  // .then((response) => {
  //   return response.data;
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
  var user = {};
  user.name = "Ben";
  return user;
}


export function UserProvider({ children })
{
  const [userProfile, setUserProfile] = React.useState({});

  React.useEffect(() => {
    fetchUser().then((result) => { 
      setUserProfile(result);
    });
  },[]);


  return (
    <UserContext.Provider value={userProfile}>
      {children}
    </UserContext.Provider>
  );
}
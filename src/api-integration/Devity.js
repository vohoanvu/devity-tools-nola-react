import React, { useEffect, useState } from 'react';
import Panels from "../components/Panels";
import axios from 'axios';
import configData from "../config.json";

const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

export default function Devity(props) 
{
  const [panels, setPanels] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await axios.get(devity_api + '/api/widgets')
      .then((res) => {
          if (res.status === '401') window.location.replace(sso_url);

          setPanels(res.data);
      })
      .catch((err) => console.log(err));
  };


  return (<Panels PanelsObject={panels} SetPanels={setPanels}/>);
}

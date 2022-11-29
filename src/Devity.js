import * as React from "react";
import Panels from "./Panels";
import axios from 'axios';
import configData from "./config.json";

const sso_url = configData.SSO_URL;
const devity_api = configData.DEVITY_API;

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {

      (async () => {
        let response = await axios.get(devity_api + '/api/widgets');
        if(response.status == '401'){
          window.location.replace(sso_url);
        }
        resolve(response.data);
    })();
    }, 500);
  });
}

class Devity extends React.Component {
  state = { panels: {} };

  componentDidMount() {
    fetchData().then((panels) => this.setState({ panels }));
  }

  render() {
    return <Panels {...this.state} />;
  }
}

export default Devity;

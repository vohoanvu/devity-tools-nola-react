import * as React from "react";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import Css from '../css/Css';


function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["My Profile"]);
    }, 2000);
  });
}

class Profile extends React.Component {
  state = { items: [] };

  componentDidMount() {
    fetchData().then((items) => this.setState({ items }));
  }

  render() {
    return <div className="p-panel" data-panel="PROFILE">
              <div className='p-chrome'>
                <img  src={btn_image_config} className="gear" alt="devity gear" />
                <span className="p-title">Profile</span>
              </div>
              <div className='p-contents'>
                <div id="ctrl_add_links" className="nav-ctrl w_ctrl_add"><Css /></div>
              </div>
            </div>;
  }
}

export default Profile;

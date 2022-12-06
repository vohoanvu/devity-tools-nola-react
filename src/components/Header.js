import * as React from "react";
import Css from '../css/Css';
import logo from "../img/devity_logo.png";
import btn_image_avitar from "../img/d_btn_ctrl_user.png";
import btn_image_links from "../img/d_btn_ctrl_links.png";
import btn_image_notes from "../img/d_btn_ctrl_notes.png";
import btn_image_clipboard from "../img/d_btn_ctrl_clipboard.png";

import btn_image_config from "../img/d_btn_ctrl_config.png";
import btn_image_code from "../img/d_btn_ctrl_code.png";
import { UserContext } from "../api-integration/UserContext";



class Header extends React.Component {
    render() {
    return <header className="App-header">

    <button className="nav-ctrl">
      <img  src={logo} className="App-logo" alt="logo" />
    </button>


    <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_links} className="" alt="Links" />
      <figcaption>Links</figcaption>
      </figure>
    </button>

    <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_clipboard} className="" alt="Clipboard" />
      <figcaption>Clipboard</figcaption>
      </figure>
    </button>

    <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_notes} className="" alt="Notes" />
      <figcaption>Notes</figcaption>
      </figure>
    </button>

    <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_code} className="" alt="Libraries" />
      <figcaption>Libraries</figcaption>
      </figure>
    </button>


    <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_avitar} className="App-avitar" alt="{user.name}" />
      <figcaption><Username /></figcaption>
      </figure>
    </button>

    <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_config} className="" alt="Configuration" />
      <figcaption>Config.</figcaption>
      </figure>
    </button>
    
    <div id="ctrl_add_links" className="nav-ctrl w_ctrl_add"><Css /></div>
      
  </header>

    }
}

function Username() {
    const user = React.useContext(UserContext);
  
    return (
      <span>
        {user.name}
      </span>
    );
  }
  

export default Header;
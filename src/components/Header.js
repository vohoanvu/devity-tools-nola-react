import * as React from "react";
import $ from "jquery";

import logo from "../img/devity_logo.png";
import btn_image_avitar from "../img/d_btn_ctrl_user.png";
import btn_image_links from "../img/d_btn_ctrl_links.png";
import btn_image_notes from "../img/d_btn_ctrl_notes.png";
import btn_image_clipboard from "../img/d_btn_ctrl_clipboard.png";
import btn_image_code from "../img/d_btn_ctrl_code.png";
import { UserContext } from "../api-integration/UserContext";



class Header extends React.Component {

    render() {
    return <header className="App-header">

    <button className="nav-ctrl" onClick={()=>onNavigate('')}>
      <img  src={logo} className="App-logo" alt="logo" />
    </button>


    <button className="nav-ctrl" onClick={()=>onNavigate('LINKS')}>
      <figure>
      <img  src={btn_image_links} className="" alt="Links" />
      <figcaption>Links</figcaption>
      </figure>
    </button>

    <button className="nav-ctrl" onClick={()=>onNavigate('CLIPBOARD')}>
      <figure>
      <img  src={btn_image_clipboard} className="" alt="Clipboard" />
      <figcaption>Clipboard</figcaption>
      </figure>
    </button>

    <button className="nav-ctrl" onClick={()=>onNavigate('NOTES')}>
      <figure>
      <img  src={btn_image_notes} className="" alt="Notes" />
      <figcaption>Notes</figcaption>
      </figure>
    </button>

    <button className="nav-ctrl" onClick={()=>onNavigate('LIBRARIES')}>
      <figure>
      <img  src={btn_image_code} className="" alt="Libraries" />
      <figcaption>Libraries</figcaption>
      </figure>
    </button>


    <button className="nav-ctrl" onClick={()=>onNavigate('PROFILE')}>
      <figure>
      <img  src={btn_image_avitar} className="App-avitar" alt="{user.name}" />
      <figcaption><Username /></figcaption>
      </figure>
    </button>

    {/* <button className="nav-ctrl">
      <figure>
      <img  src={btn_image_config} className="" alt="Configuration" />
      <figcaption>Config.</figcaption>
      </figure>
    </button> */}
    
    
      
  </header>

    }
}


function onNavigate(target) {


$('.p-panel').hide();
if(target === ''){
  $('.p-panel').show();
}
else{
  $('div[data-panel=' + target + ']').show();
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
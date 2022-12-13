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
    return <div id="navigation" className="nav-max">

    <div id="logo">
      <button onClick={()=>onNavigate('')}>
        <img  src={logo} className="logo" alt="logo" />
      </button>
    </div>
    
    <header id="ribbon" className="ribbon-cntrls" >
      <button onClick={()=>onNavigate('LINKS')}>
        <img  src={btn_image_links}alt="Links" /><br />
        <span>Links</span>
      </button>

      <button onClick={()=>onNavigate('CLIPBOARD')}>
        <img  src={btn_image_clipboard} className="" alt="Clipboard" /><br />
        <span>Clipboard</span>
      </button>

      <button onClick={()=>onNavigate('NOTES')}>
        <img  src={btn_image_notes} className="" alt="Notes" /><br />
        <span>Notes</span>
      </button>

      <button onClick={()=>onNavigate('LIBRARIES')}>
        <img  src={btn_image_code} className="" alt="Libraries" /><br />
        <span>Libraries</span>
      </button>

      <button id="console_btn" onClick={()=>onNavigate('CONSOLE')}>
        <img  src={btn_image_code} className="" alt="Console" /><br />
        <span>Console</span>
      </button>


      <button onClick={()=>onNavigate('PROFILE')}>
        <img  src={btn_image_avitar} className="App-avitar" alt="{user.name}" /><br />
        <Username />
      </button>
    </header>

    
    </div>
    }


}



function onNavigate(target) {

  if(target === "CONSOLE"){
    $('#console_log').toggleClass('hide');
    $('#navigation').toggleClass('nav-max');
    $('#navigation').toggleClass('nav-min');
    $('#console').toggleClass('console-max');
    $('#console').toggleClass('console-min');
    // $('#header_container').toggleClass('display-flex');

  }
  else{
    $('.p-panel').hide();
    if(target === ''){
      $('.p-panel').show();
    }
    else{
      $('div[data-panel=' + target + ']').show();
      $("#search_input").val('');
    }
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
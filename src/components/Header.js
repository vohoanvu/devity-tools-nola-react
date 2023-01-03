import React, { useContext, useEffect } from "react";
import $ from "jquery";
import logo from "../img/devity_logo.png";
import btn_image_avitar from "../img/d_btn_ctrl_user.png";
import btn_image_links from "../img/d_btn_ctrl_links.png";
import btn_image_notes from "../img/d_btn_ctrl_notes.png";
import btn_image_clipboard from "../img/d_btn_ctrl_clipboard.png";
import btn_image_code from "../img/d_btn_ctrl_code.png";
import btn_image_lib from "../img/d_btn_ctrl_lib.png";
import { UserContext } from "../api-integration/UserContext";


export default function Header(props) 
{
  const userContext = useContext(UserContext);

  useEffect(()=>{
    const mostRecentView = userContext.activePanel;
    $('.p-panel').hide();
    if(mostRecentView){
      onNavigate(mostRecentView);
    }
    else{
      onNavigate("ALL");
    }
  },[userContext]) 

  function onNavigate(target) {

      if (target === "CONSOLE") {
        $('#console_log').toggleClass('hide');
        $('#navigation').toggleClass('nav-max');
        $('#navigation').toggleClass('nav-min');
        $('#console').toggleClass('console-max');
        $('#console').toggleClass('console-min');
        $('#cmd_type_radio').toggle();
        // $('#header_container').toggleClass('display-flex');
      } else {
        $('.p-panel').hide();
    
        if (target === 'ALL') {
          $('.p-panel').show();
        } else {
          $('div[data-panel=' + target + ']').show();
          $("#search_input").val('');
        }
      }
    }

    function onNavigateClicked(target) {
      localStorage.setItem('mostRecentView', target);
      userContext.setActivePanel(target);
      onNavigate(target);
    }


  return (<div id="navigation" className="nav-max">

      <div id="logo">
        <button id="nav_all" onClick={()=>onNavigateClicked('ALL')}>
          <img src={logo} className="logo" alt="logo" />
        </button>
      </div>
      
      <header id="ribbon" className="ribbon-cntrls" >
        <button id='nav_links' onClick={()=>onNavigateClicked('LINKS')}>
          <img src={btn_image_links} alt="Links" /><br />
          <span>Links</span>
        </button>

        <button id="nav_clipboard" onClick={()=>onNavigateClicked('CLIPBOARD')}>
          <img  src={btn_image_clipboard} className="" alt="Clipboard" /><br />
          <span>Clipboard</span>
        </button>

        <button id='nav_notes' onClick={()=>onNavigateClicked('NOTES')}>
          <img  src={btn_image_notes} className="" alt="Notes" /><br />
          <span>Notes</span>
        </button>

        <button id='nav_libraries' onClick={()=>onNavigate('LIBRARIES')}>
          <img  src={btn_image_lib} className="" alt="Libraries" /><br />
          <span>Libraries</span>
        </button>

        <button id="nav_console" onClick={()=>onNavigate('CONSOLE')}>
          <img  src={btn_image_code} className="" alt="Console" /><br />
          <span>Console</span>
        </button>


        <button id='nav_profile' onClick={()=>onNavigate('PROFILE')}>
          <img  src={btn_image_avitar} className="App-avitar" alt="{user.name}" /><br />
          <Username />
        </button>
      </header>

      </div>);
}


//another component
function Username() {
  const userContext = React.useContext(UserContext);

  return (
    <span>
      {userContext.userProfile.name}
    </span>
  );
}
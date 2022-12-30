import * as React from "react";
import $ from "jquery";
import logo from "../img/devity_logo.png";
import btn_image_avitar from "../img/d_btn_ctrl_user.png";
import btn_image_links from "../img/d_btn_ctrl_links.png";
import btn_image_notes from "../img/d_btn_ctrl_notes.png";
import btn_image_clipboard from "../img/d_btn_ctrl_clipboard.png";
import btn_image_code from "../img/d_btn_ctrl_code.png";
import btn_image_lib from "../img/d_btn_ctrl_lib.png";
import { UserContext } from "../api-integration/UserContext";
import { log } from '../Utilities'


class Header extends React.Component {
    constructor(props) {
      super(props);
      this.onNavigate = this.onNavigate.bind(this);
    }

    componentDidUpdate() {
      $('.p-panel').hide();
      let mostReventView = localStorage.getItem('mostRecentView');

      if(mostReventView){
        this.onNavigate(mostReventView);
      }
      else{
        this.onNavigate("ALL");
      }
    }

    onNavigate(target) {
      let recentView = target ?? 'ALL';
      localStorage.setItem('mostRecentView', recentView);
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


    render() 
    {
      return <div id="navigation" className="nav-max">

      <div id="logo">
        <button id="nav_all" onClick={()=>this.onNavigate('ALL')}>
          <img src={logo} className="logo" alt="logo" />
        </button>
      </div>
      
      <header id="ribbon" className="ribbon-cntrls" >
        <button id='nav_links' onClick={()=>this.onNavigate('LINKS')}>
          <img src={btn_image_links} alt="Links" /><br />
          <span>Links</span>
        </button>

        <button id="nav_clipboard" onClick={()=>this.onNavigate('CLIPBOARD')}>
          <img  src={btn_image_clipboard} className="" alt="Clipboard" /><br />
          <span>Clipboard</span>
        </button>

        <button id='nav_notes' onClick={()=>this.onNavigate('NOTES')}>
          <img  src={btn_image_notes} className="" alt="Notes" /><br />
          <span>Notes</span>
        </button>

        <button id='nav_libraries' onClick={()=>this.onNavigate('LIBRARIES')}>
          <img  src={btn_image_lib} className="" alt="Libraries" /><br />
          <span>Libraries</span>
        </button>

        <button id="nav_console" onClick={()=>this.onNavigate('CONSOLE')}>
          <img  src={btn_image_code} className="" alt="Console" /><br />
          <span>Console</span>
        </button>


        <button id='nav_profile' onClick={()=>this.onNavigate('PROFILE')}>
          <img  src={btn_image_avitar} className="App-avitar" alt="{user.name}" /><br />
          <Username />
        </button>
      </header>

      </div>
    }

}


//another component
function Username() {
  const user = React.useContext(UserContext);

  return (
    <span>
      {user.name}
    </span>
  );
}
  

export default Header;
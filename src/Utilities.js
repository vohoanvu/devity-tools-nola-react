import $ from "jquery";

export function log(value) {
    console.log(value);
    $('#console_output').append('<li>' + value + '</li>');
    var objDiv = document.getElementById("console_log");
    objDiv.scrollTop = objDiv.scrollHeight;
    return true;
  }

  export function focus_cmd() {
    document.getElementById("prompt_input").focus({focusVisible: true});
  }
  
  export function format_link(link) {
    if( link.toLowerCase().indexOf("http") === -1){
      return "http://" + link;
    }
    return link;
  }
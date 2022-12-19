import $ from "jquery";


export function log(value) {
    $('#console_output').append('<li>' + value + '</li>');
    return true;
  }
  

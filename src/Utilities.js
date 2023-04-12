export function log(value) {
    console.log(value);
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

export function abbriviate(value) {
    var count = 30;
    if(value.length > count){
        return value.substring(0, count) + "...";
    }
    return value;
}

export function currate_title(value) {
    
    if(value.length > 32){
        return value
    }
    return "";
}

export function abbreviate30Chars(value) {
    
    if(value.length > 30){
        return value.substring(0, 30) + "...";
    }
    return value;
}

import { combineReducers } from "redux";
import UserProfileReducer from "./UserProfileReducer";
import WidgetNotesReducer from "./WidgetNotesReducer";

export default combineReducers({ 
    UserProfileReducer,
    WidgetNotesReducer
});
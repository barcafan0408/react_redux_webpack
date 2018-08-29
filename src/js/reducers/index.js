import { combineReducers } from "redux";
import transportReducer from "./transportReducer";

export default combineReducers({ transportList: transportReducer });

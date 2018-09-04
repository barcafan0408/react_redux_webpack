import { combineReducers } from "redux";
import transportReducer from "./transportReducer";
import storageReducer from "./storageReducer";

export default combineReducers({ transportList: transportReducer, storagesList: storageReducer });

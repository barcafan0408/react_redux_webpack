import { combineReducers } from "redux";
import transportReducer from "./transportReducer";
import storageReducer from "./storageReducer";
import tariffReducer from "./tariffReducer";

export default combineReducers({ 
	transportList: transportReducer, 
	storagesList: storageReducer,
	tariffsList: tariffReducer,
});

import { createStore } from "redux";
import rootReducer from "../reducers/index";
import axios from 'axios';

const store = createStore(
  rootReducer  
);

export default store;

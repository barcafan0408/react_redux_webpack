import { ADD_STORAGE, ADD_STORAGES_LIST, REMOVE_STORAGE } from "../constants/action-types";

const storageReducer = (state = { list:[] }, action) => {
  switch (action.type) {        
    case ADD_STORAGE: {
      let _list;
      _list = [...state.list];
      _list.push(action.payload);
      return { ...state, list: _list };
    }
    case ADD_STORAGES_LIST:    
      return { ...state, list: action.payload };   
    case REMOVE_STORAGE: {
      let id = action.payload;
      let _list = [...state.list];  
      let index = _list.findIndex((element) =>
        element.id === id 
        );
      _list.splice(index, 1);
      return { ...state, list: _list };
    } 
    default:
      return state;
  }
};

export default storageReducer;

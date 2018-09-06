import { ADD_TARIFF, ADD_TARIFFS_LIST, REMOVE_TARIFF } from "../constants/action-types";

const tariffReducer = (state = { list:[] }, action) => {
  switch (action.type) {        
    case ADD_TARIFF: {
      let _list;
      _list = [...state.list];
      _list.push(action.payload);
      return { ...state, list: _list };
    }
    case ADD_TARIFFS_LIST:    
      return { ...state, list: action.payload };   
    case REMOVE_TARIFF: {
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

export default tariffReducer;
import { ADD_ROUTE_LIST, ADD_ROUTES_LIST, REMOVE_ROUTE_LIST } from "../constants/action-types";

const routeListReducer = (state = { list:[] }, action) => {
  switch (action.type) {        
    case ADD_ROUTE_LIST: {
      let _list;
      _list = [...state.list];
      _list.push(action.payload);
      return { ...state, list: _list };
    }
    case ADD_ROUTES_LIST:    
      return { ...state, list: action.payload };   
    case REMOVE_ROUTE_LIST: {
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

export default routeListReducer;

import { ADD_TRANSPORT, ADD_TRANSPORT_LIST, REMOVE_TRANSPORT } from "../constants/action-types";

const articleReducer = (state = { list:[] }, action) => {
  switch (action.type) {    
    case ADD_TRANSPORT: {
      let _list;
      _list = [...state.list];
      _list.push(action.payload);
      return { ...state, list: _list };
    }
    case ADD_TRANSPORT_LIST:    
      return { ...state, list: action.payload };
    case REMOVE_TRANSPORT: {
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

export default articleReducer;

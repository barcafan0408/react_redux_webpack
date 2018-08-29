import { ADD_TRANSPORT, ADD_TRANSPORT_LIST } from "../constants/action-types";

const articleReducer = (state = { list:[] }, action) => {
  switch (action.type) {
    case ADD_TRANSPORT:
      //return [...state, action.payload];
      const _list = [...state.list];
      _list.push(action.payload);
      return { ...state, list: _list };
    case ADD_TRANSPORT_LIST:    
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

export default articleReducer;

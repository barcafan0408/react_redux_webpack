import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addTransportList } from "../actions/index";

const mapStateToProps = state => {  
  return { transportList: state.transportList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addTransportList: data => dispatch(addTransportList(data))
  };
};

class ConnectedList extends React.Component{
  componentDidMount() {
    axios.get('http://localhost:3000/transport')
    .then(response => {
      this.props.addTransportList(response.data);
    });
  }
  render() {
  	return (
	  <ul className="list-group list-group-flush">
	    {this.props.transportList.map(el => (
	      <li className="list-group-item" key={el.id}>
	        <div className="row align-items-center">
	          <div className="col-7">
	        	{el.name} {'(volume: ' + el.volume + ', max weight: ' + el.maxWeight + ', speed: ' + el.speed + ')'}
	          </div>
	          <button className="col-2 btn btn-danger btn-sm">
	        	Delete
	          </button>
	          <button className="col-2 btn btn-warning btn-sm offset-1">
	        	Change
	          </button>
	        </div>
	      </li>
	    ))}
	  </ul>
	)
  }  
};

const List = connect(mapStateToProps,mapDispatchToProps)(ConnectedList);

ConnectedList.propTypes = {
  transportList: PropTypes.array.isRequired
};

export default List;

import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addTransportList } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';

import EditTransport from './EditTransport';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapStateToProps = state => {  
  return { transportList: state.transportList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addTransportList: data => dispatch(addTransportList(data))
  };
};

class ConnectedList extends React.Component{
  
  constructor(props) {
    super(props);          
    
    this.state = {
      show: false,
      showEdit: false,
      editEl: {},
    };    
  }

  componentDidMount() {
    this.getTransportList();
  }

  handleDelete = () => {
    this.setState({ show: false });   
    const id = this.state.deleteId;    
    axios.delete(`${config.path}/transport/${id}`)
      .then(res => {
        this.getTransportList();
      });
  }
  
  handleClose = () => {
    this.setState({ show: false });
  }  

  handleShow(id) {
    this.setState({ show: true, deleteId: id });
  }

  handleShowEdit(el) {
    this.setState({ showEdit: true, editEl: el });
  }

  getTransportList = () => {
    axios.get(`${config.path}/transport`)
    .then(res => {
      this.props.addTransportList(res.data);
    }); 
  }

  editModalClose = () => {
  	this.setState({ showEdit: false });
  	this.getTransportList();	
  }
  
  render() {	
  	return (
  	  <div>  	
	    <ul className="list-group list-group-flush">
	      {this.props.transportList.map(el => (
	        <li className="list-group-item" key={el.id}>
	          <div className="row align-items-center">
	            <div className="col-7">
	        	  <b>{el.name}</b> <br /> {'Volume: ' + el.volume} <br /> {'Max. weight: ' + el.maxWeight} <br /> {'Speed: ' + el.speed}
	            </div>
	            <button 
	              className="col-2 btn btn-danger btn-sm"
	              onClick={this.handleShow.bind(this, el.id)}
	            >
	        	  Delete
	            </button>
	            <button 
	              className="col-2 btn btn-warning btn-sm offset-1"
	              onClick={this.handleShowEdit.bind(this, el)}
	            >
	              Change
	            </button>
	          </div>
	        </li>
	      ))}
	    </ul>
	  	<Modal show={this.state.show} onHide={this.handleClose}>
		  <Modal.Header>
			<Modal.Title>Delete item</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
		    <h3>Are you sure?</h3>
		  </Modal.Body>
		  <Modal.Footer>
		    <Button 
		      bsStyle="primary" 
		      onClick={this.handleDelete}
		    >
		      Delete
		    </Button>
			<Button
			  onClick={this.handleClose}
			>
			  Cancel
			</Button>
          </Modal.Footer>
		</Modal>
		{this.state.showEdit ?		
		  <EditTransport show={this.state.showEdit} onHide={this.editModalClose} transport={this.state.editEl}/>	
		: null}	
      </div>
	)
  }  
};

const List = connect(mapStateToProps,mapDispatchToProps)(ConnectedList);

ConnectedList.propTypes = {
  transportList: PropTypes.array.isRequired
};

export default List;

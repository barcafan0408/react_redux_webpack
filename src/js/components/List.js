import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addTransportList, removeTransport } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';

import EditTransport from './EditTransport';

const mapStateToProps = state => {  
  return { transportList: state.transportList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addTransportList: data => dispatch(addTransportList(data)),
    removeTransport: id => dispatch(removeTransport(id))
  };
};

class ConnectedList extends React.Component{
  
  constructor() {
    super();    
    
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);    
    
    this.state = {
      show: false,
      showEdit: false,
      editEl: {},
    };    
  }

  componentDidMount() {
    axios.get('http://localhost:3000/transport')
    .then(response => {
      this.props.addTransportList(response.data);
    });
  }

  handleDelete() {
    this.setState({ show: false });   
    const id = this.state.deleteId;
    console.log(id);
    axios.delete(`http://localhost:3000/transport/${id}`)
      .then(res => {
        this.props.removeTransport(id);
      });
  }
  
  handleClose() {
    this.setState({ show: false });
  }  

  handleShow(id) {
    this.setState({ show: true, deleteId: id });
  }

  handleShowEdit(el) {
    this.setState({ showEdit: true, editEl: el });
  }  
  
  render() {  
    let editModalClose = () => this.setState({ showEdit: false });	
  	return (
  	  <div>  	
	    <ul className="list-group list-group-flush">
	      {this.props.transportList.map(el => (
	        <li className="list-group-item" key={el.id}>
	          <div className="row align-items-center">
	            <div className="col-7">
	        	  {el.name} {'(volume: ' + el.volume + ', max weight: ' + el.maxWeight + ', speed: ' + el.speed + ')'}
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
		  <EditTransport show={this.state.showEdit} onHide={editModalClose} transport={this.state.editEl}/>	
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

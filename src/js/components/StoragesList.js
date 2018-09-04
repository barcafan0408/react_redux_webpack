import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addStoragesList, removeStorage } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';



const mapStateToProps = state => {  
  return { storagesList: state.storagesList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addStoragesList: data => dispatch(addStoragesList(data)),
    removeStorage: id => dispatch(removeStorage(id))
  };
};

class ConnectedList extends React.Component{
  
  constructor() {
    super(); 

    this.state = {
      show: false,
    };    
  
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);  
  }

  componentDidMount() {
    axios.get('http://localhost:3000/storages')
    .then(response => {
      this.props.addStoragesList(response.data);
    });
  }

  handleDelete() {
    this.setState({ show: false });   
    const id = this.state.deleteId;
    console.log(id);
    axios.delete(`http://localhost:3000/storages/${id}`)
      .then(res => {
        this.props.removeStorage(id);
      });
  }

  handleClose() {
    this.setState({ show: false });
  }  

  handleShow(id) {
    this.setState({ show: true, deleteId: id });
  }
  
  render() {  
    	
  	return (
  	  <div>  	
	    <ul className="list-group list-group-flush">
	      {this.props.storagesList.map(el => (
	        <li className="list-group-item" key={el.id}>
	          <div className="row align-items-center">
	            <div className="col-7">
	        	  {el.name} {'(country: ' + el.country + ', region: ' + el.region + ', city: ' + 
	        	  el.city + ', street: ' + el.street + ', house: ' + el.house + ', type: ' + el.storageType + ')'}
	            </div>
	            <button 
	              className="col-2 btn btn-danger btn-sm"
	              onClick={this.handleShow.bind(this, el.id)}
	            >
	        	  Delete
	            </button>
	            <button 
	              className="col-2 btn btn-warning btn-sm offset-1"
	              
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
      </div>
	)
  }  
};

const List = connect(mapStateToProps,mapDispatchToProps)(ConnectedList);

ConnectedList.propTypes = {
  storagesList: PropTypes.array.isRequired
};

export default List;
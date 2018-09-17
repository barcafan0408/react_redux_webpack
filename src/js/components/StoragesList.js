import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addStoragesList } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapStateToProps = state => {  
  return { storagesList: state.storagesList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addStoragesList: data => dispatch(addStoragesList(data))
  };
};

class ConnectedList extends React.Component{
  
  constructor(props) {
    super(props); 

    this.state = {
      show: false,
    }; 
  }

  componentDidMount() {
    this.getStoragesList();
  }

  handleDelete = () => {
    this.setState({ show: false });   
    const id = this.state.deleteId;
    console.log(id);
    axios.delete(`${config.path}/storages/${id}`)
      .then(res => {
        this.getStoragesList();
      });
  }

  handleClose = () => {
    this.setState({ show: false });
  }  

  handleShow(id) {
    this.setState({ show: true, deleteId: id });
  }

  getStoragesList = () => {
    axios.get(`${config.path}/storages`)
    .then(res => {
      this.props.addStoragesList(res.data);
    }); 
  }
  
  render() {  
    	
  	return (
  	  <div>  	
	    <ul className="list-group list-group-flush">
	      {this.props.storagesList.map(el => (
	        <li className="list-group-item" key={el.id}>
	          <div className="row align-items-center">
	            <div className="col-7">
	        	  <b>{el.name}</b> 
	        	  <br />
	        	  {el.country}
	        	  <br />
	        	  {el.region + ', ' + el.city}
				  <br />
	        	  {el.street + ', ' + el.house}
				  <br />
	        	  {el.storageType.replace(/_/g," ")}
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

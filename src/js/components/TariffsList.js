import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addTariffsList } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';
import EditTariff from './EditTariff';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapStateToProps = state => {  
  return { tariffsList: state.tariffsList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addTariffsList: data => dispatch(addTariffsList(data))
  };
};

class ConnectedList extends React.Component{
  
  constructor() {
    super(); 

    this.state = {
      show: false,
      showEdit: false,
      editEl: {},
    };  
  }

  componentDidMount() {
    this.getTariffsList();
  }

  handleDelete = () => {
    this.setState({ show: false });   
    const id = this.state.deleteId;
    axios.delete(`${config.path}/tariffs/${id}`)
      .then(res => {
        this.getTariffsList();
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

  getTariffsList = () => {
    axios.get(`${config.path}/tariffs`)
    .then(res => {
      this.props.addTariffsList(res.data);
    }); 
  }
  
  editModalClose = () => {
  	this.setState({ showEdit: false });
  	this.getTariffsList();	
  }

  render() {  
    	
  	return (
  	  <div>  	
	    <ul className="list-group list-group-flush">
	      {this.props.tariffsList.map(el => (
	        <li className="list-group-item" key={el.id}>
	          <div className="row align-items-center">
	            <div className="col-7">
	        	  <p>
	        	    {'date: ' + new Date(el.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' })}
	        	  </p>
	        	  <p>
	        	    {'sender: ' + el.storageSenderName + ', receiver: ' + el.storageReceiverName}
	        	  </p>
	        	  <p>
	        	    {'minWeight: ' + el.minWeight + ', maxWeight: ' + el.maxWeight}
	        	  </p>
	        	  <p>
	        	     {'fragile: '} {el.fragile ? 'yes' : 'not'} {', price: ' + el.price}
	        	  </p>
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
		  <EditTariff show={this.state.showEdit} onHide={this.editModalClose} tariff={this.state.editEl}/>	
		: null}	
      </div>
	)
  }  
};

const List = connect(mapStateToProps,mapDispatchToProps)(ConnectedList);

ConnectedList.propTypes = {
  tariffsList: PropTypes.array.isRequired
};

export default List;

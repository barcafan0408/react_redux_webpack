import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addStoragesList, addTariffsList, removeTariff } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';

const mapStateToProps = state => {
  const {list} = state.storagesList;  
  const tariffsList = state.tariffsList.list.map(el => {
  	const indexSender = list.findIndex((element) =>
      element.id === el.idStorageSender 
    );
    const indexReceiver = list.findIndex((element) =>
      element.id === el.idStorageReceiver 
    );
    const StorageSenderName = list[indexSender].name;
    const StorageReceiverName = list[indexReceiver].name;
    return { id: el.id, date: el.date, idStorageSender: el.idStorageSender, idStorageReceiver: el.idStorageReceiver, StorageSenderName, StorageReceiverName,
      minWeight: el.minWeight, maxWeight: el.maxWeight, fragile: el.fragile, price: el.price };     
  });  
  return { tariffsList };
};

const mapDispatchToProps = dispatch => {
  return {
    addStoragesList: data => dispatch(addStoragesList(data)),
    addTariffsList: data => dispatch(addTariffsList(data)),
    removeTariff: id => dispatch(removeTariff(id))
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
    axios.get('http://localhost:3000/tariffs')
    .then(response => {
      this.props.addTariffsList(response.data);
    });
  }

  handleDelete() {
    this.setState({ show: false });   
    const id = this.state.deleteId;
    console.log(id);
    axios.delete(`http://localhost:3000/tariffs/${id}`)
      .then(res => {
        this.props.removeTariff(id);
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
	      {this.props.tariffsList.map(el => (
	        <li className="list-group-item" key={el.id}>
	          <div className="row align-items-center">
	            <div className="col-7">
	        	  <p>
	        	    {'date: ' + new Date(el.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' })}
	        	  </p>
	        	  <p>
	        	    {'sender: ' + el.StorageSenderName + ', receiver: ' + el.StorageReceiverName}
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
  tariffsList: PropTypes.array.isRequired
};

export default List;
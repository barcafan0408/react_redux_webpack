import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import SelectComponent from './SelectComponent';
import { addSending } from "../actions/index";
import {Overlay, Tooltip, Button, Modal} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import async from 'async';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapDispatchToProps = dispatch => {
  return {
    addSending: sending => dispatch(addSending(sending))
  };
};

class SendingComponent extends Component {
	
  constructor(props) {
    super(props);    

    this.state = {       
      coment: '',
      weight: 0,
      amount: 0,
      fragile: false,
      cost: 0,  
      idStorageSender: null,
      idStorageReceiver: null,
      idUserSender: '',
      idUserReceiver: '',
      sender: {
      	senderName: '',
      	senderPhone: '',
      	senderEmail: '',	
      },
      receiver: {
      	receiverName: '',
      	receiverPhone: '',
      	receiverEmail: '',	
      },
      show: false,
      newSendingId: '',
      showError: false,
    };  
  }  

  getTariff = () => {
  	this.setState((prevState) => {
  	  if (prevState.idStorageSender !== '' && prevState.idStorageReceiver !== '' ) {
  	    axios.get(`${config.path}/tariffs/price`, {
		    params: {
		      idStorageSender: prevState.idStorageSender,
		      idStorageReceiver: prevState.idStorageReceiver,
		      weight: prevState.weight,
		      fragile: prevState.fragile,
		    }
		  })
		  .then(response => {
		  	const tariffCost = response.data.length ? response.data[0].price : 0; 
	        this.setState({cost: tariffCost});
	      })
		  .catch(error => {
		    console.log(error);
		  });
  	  } else {
  	    return { cost: 0 };
  	  }
  	});
  }

  getSenderByPhone = () => {
  	const phone = this.state.sender.senderPhone.replace(/-/g,"");
    axios.get(`${config.path}/users/phone/${phone}`)	
      .then(res => {
      	if (res !== undefined && res.data !== '') {
  	      this.setState({
  	        sender: Object.assign({}, this.state.sender, {
		      senderName: res.data.name,
		      senderEmail: res.data.email,
		    })
		  })  	      
  	   	}
	  })
  }

  getReceiverByPhone = () => {
  	const phone = this.state.receiver.receiverPhone.replace(/-/g,"");
    axios.get(`${config.path}/users/phone/${phone}`)	
      .then(res => {
      	if (res !== undefined && res.data !== '') {
  	      this.setState({
  	        receiver: Object.assign({}, this.state.receiver, {
		      receiverName: res.data.name,
		      receiverEmail: res.data.email,
		    })
		  })  	      
  	   	}
	  })
  }

  handleFragileChange = event => {
  	this.setState({ [event.target.id]: event.target.checked });
  	this.getTariff();
  }

  handleStorageSenderChange = (e) => {    
    if (e === null) {
      this.setState({	
      	idStorageSender: null,
      })
    } else {
      this.setState({	
      	idStorageSender: e.value,
      });      
    }
    this.getTariff();
  };

  handleStorageReceiverChange = (e) => {
    if (e === null) {
      this.setState({	
      	idStorageReceiver: null,
      })
    } else {
      this.setState({	
      	idStorageReceiver: e.value,
      });	
    }
    this.getTariff();
  };

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
    if (event.target.id === 'weight') {
      this.getTariff();	
    }
  }

  handleSenderChange = (event) => {   	
  	this.setState({
	  sender: Object.assign({}, this.state.sender, {
	    [event.target.id]: event.target.value,
	  }),
	});    
  }

  handleSenderBlur = () => {
  	this.getSenderByPhone();	
  }

  handleReceiverBlur = () => {
  	this.getReceiverByPhone();	
  }

  handleReceiverChange = (event) => {
  	this.setState({
	  receiver: Object.assign({}, this.state.receiver, {
	    [event.target.id]: event.target.value,
	  }),
	});
  }

  handleClose = () => {
    this.setState({ show: false, showError: false });
  }
  
  handleSubmit = (event) => {
  	event.preventDefault();

  	const { coment, weight, amount, fragile, cost } = this.state;
  	const { senderName, senderEmail } = this.state.sender;
    const { receiverName, receiverEmail } = this.state.receiver;
    const senderPhone = this.state.sender.senderPhone.replace(/-/g,"");
    const receiverPhone = this.state.receiver.receiverPhone.replace(/-/g,"");

	this.createQuery(senderPhone)
		.then(res => this.getUserSender(res))
		.then(() => this.createUserSender(senderName, senderPhone, senderEmail))
		.then(res => this.getUserSender(res))
		.catch(err => this.createErrorMessage())
		.then(() => this.createQuery(receiverPhone))
		.then(res => this.getUserReceiver(res))
		.then(() => this.createUserReceiver(receiverName, receiverPhone, receiverEmail))
		.then(res => this.getUserReceiver(res))
		.catch(err => this.createErrorMessage())
		.then(() => this.createSending())
		.then(() => this.clearState());
  }

  createErrorMessage = () => {
  	this.setState({
  		showError: true,
  	});
  }

  createQuery = (phone) => {
  	//console.log("createQuery");
  	return axios.get(`${config.path}/users/phone/${phone}`);	
  }

  getUserSender = (res) => {
  	//console.log("getUserSender");
  	if (res !== undefined && res.data !== '') {
  	  this.setState( {idUserSender: res.data.id });
  	}
  }

  createUserSender = (userName, phone, email) => {
  	//console.log("createUserSender");
  	if (this.state.idUserSender === '') {
  	  return axios.post(`${config.path}/users`, email === '' ? { userName, phone } : { userName, phone, email })
  	}
  }

  getUserReceiver = (res) => {
  	//console.log("getUserReceiver");
  	if (res !== undefined && res.data !== '') {
  	  this.setState( {idUserReceiver: res.data.id });
  	}
  }

  createUserReceiver = (userName, phone, email) => {
  	//console.log("createUserReceiver");
  	if (this.state.idUserReceiver === '') {
  	  return axios.post(`${config.path}/users`, email === '' ? { userName, phone } : { userName, phone, email })
  	}
  }

  createSending = () => {
  	//console.log("createUserSender");
  	const { coment, weight, amount, fragile, cost, idStorageSender, idStorageReceiver, idUserSender, idUserReceiver } = this.state;  	
  	if (idUserSender !== '' && idUserReceiver !== '') {
  	  axios.post(`${config.path}/sendings`, { date: new Date(), status: 'in_processing', number: Math.floor(Math.random() * 10000000000).toString(),
  	   coment, weight, amount, fragile, cost, idStorageSender, idStorageReceiver, idUserSender, idUserReceiver })
  	    .then(res => {  
  	      //console.log(res);
	      this.setState({newSendingId: res.data.number, show: true});
	    })
	    .catch(err => this.createErrorMessage())
  	}	
  }

  clearState = () => {
  	//console.log("clearState");
  	this.setState({       
      coment: '',
      weight: 0,
      amount: 0,
      fragile: false,
      cost: 0,  
      idStorageSender: null,
      idStorageReceiver: null,
      idUserSender: '',
      idUserReceiver: '',
      sender: {
      	senderName: '',
      	senderPhone: '',
      	senderEmail: '',	
      },
      receiver: {
      	receiverName: '',
      	receiverPhone: '',
      	receiverEmail: '',	
      }
    });
  } 

  render() {  	
    const { coment, weight, amount, fragile, cost } = this.state;
    const { senderName, senderPhone, senderEmail } = this.state.sender;
    const { receiverName, receiverPhone, receiverEmail } = this.state.receiver;
  	return (
  	  <div>
  	  <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="panel panel-default">
          	<div className="panel-heading">
          	  <h3 className="panel-title">Sender information</h3>
  			</div>          
          	<div className="panel-body row mt-1">                    
	          <div className="col-4">
		        <label htmlFor="title">Phone</label>
		        <div className="row">
		          <div className="col-2 align-self-end">
				    <label htmlFor="title">(+380)</label>
		          </div>
		          <div className="col-10">
		            <input
	                  type="text"
	                  className="form-control"
	                  id="senderPhone"
	                  placeholder='Enter phone like 98-765-4321'
           		      pattern="[0-9]{2}-[0-9]{3}-[0-9]{4}"
	                  required='true'              
	                  value={senderPhone}
	                  onChange={this.handleSenderChange}
	                  onBlur={this.handleSenderBlur}
	                />
	              </div>
	            </div>
		      </div>
	          <div className="col-4">
		      	<label htmlFor="title">Name</label>
		      	<input
	              type="text"
	              className="form-control"
	              id="senderName"
	              placeholder='Enter sender name'
	              required='true'
	              pattern='^[a-zA-ZА-Яа-яЁёЇїІіЄєҐґ\s\-]{3,50}'              
	              value={senderName}
	              onChange={this.handleSenderChange}
	          	/>
		      </div>		      
		      <div className="col-4">
		        <label htmlFor="title">Email</label>
		        <input
	              type="email"
	              className="form-control"
	              id="senderEmail"
	              placeholder='Enter email like example@gmail.com'              
	              value={senderEmail}
	              onChange={this.handleSenderChange}
	            />
		      </div>
		    </div>
		  </div>
		  <div className="panel panel-default">
          	<div className="panel-heading">
          	  <h3 className="panel-title">Receiver information</h3>
  			</div>		  
            <div className="panel-body row mt-1">                    
	          <div className="col-4">
		        <label htmlFor="title">Phone</label>
		        <div className="row">
		          <div className="col-2 align-self-end">
				    <label htmlFor="title">(+380)</label>
		          </div>
		          <div className="col-10">
		            <input
	                  type="text"
	                  className="form-control"
	                  id="receiverPhone"
	                  placeholder='Enter phone like 98-765-4321'
           		      pattern="[0-9]{2}-[0-9]{3}-[0-9]{4}"
	                  required='true'              
	            	  value={receiverPhone}
	            	  onChange={this.handleReceiverChange}
	            	  onBlur={this.handleReceiverBlur}
	                />
	              </div>
	            </div>
		      </div>
	          <div className="col-4">
		        <label htmlFor="title">Name</label>
		        <input
	              type="text"
	              className="form-control"
	              id="receiverName"
	              placeholder='Enter receiver name'
	              required='true'         
	              pattern='^[a-zA-ZА-Яа-яЁёЇїІіЄєҐґ\s\-]{3,50}'     
	              value={receiverName}
	              onChange={this.handleReceiverChange}
	            />
		      </div>		      
		      <div className="col-4">
		        <label htmlFor="title">Email</label>
		        <input
	              type="email"
	              className="form-control"
	              id="receiverEmail"
	              placeholder='Enter email like example@gmail.com'             
	              value={receiverEmail}
	              onChange={this.handleReceiverChange}
	            />
		      </div>
		    </div>
		  </div>
		  <div className="panel panel-default">
          	<div className="panel-heading">
          	  <h3 className="panel-title">Detail information</h3>
  			</div>          
          	<div className="panel-body">
          	  <label htmlFor="title">Coment</label>
          	  <input
            	type="text"
            	className="form-control"
            	id="coment"
            	placeholder='Enter coment'
            	maxLength="255"            
            	value={coment}
	        	onChange={this.handleChange}            
          	  />
          	  <div className="row mt-2">                    
	            <div className="col-4">
          	      <label htmlFor="title">Weight</label>
          	      <div className="input-group">
                    <input
            	      type="number"
            	      className="form-control"
            		  id="weight"
            		  step='1'
            		  min='1'
            		  max='10000'
            		  value={weight}
	        		  onChange={this.handleChange}
          	        />
          	        <span className="input-group-addon">kg</span>
                  </div>
          	    </div>
          	    <div className="col-4">
          	  	  <label htmlFor="title">Amount</label>
          	  	  <div className="input-group">
              	    <input
            		  type="number"
            		  className="form-control"
            		  id="amount"
            		  step='10'
            		  min='10'
            		  max='1000000'
            		  value={amount}
	        		  onChange={this.handleChange}
          	 	    />
          	 	    <span className="input-group-addon">uah</span>
                  </div>
          	    </div>
          	    <div className="col-4 align-self-end">
                  <div className="checkbox">
			        <label>
			          <input
			      		type="checkbox"
			      		id="fragile"
			      		value={fragile}
			      		checked={fragile}
	        	  		onChange={this.handleFragileChange}
			    	  />
			      	  Fragile
			    	</label>
	          	  </div>
	          	</div>
	          </div>
	          <div className="row mt-2">
	            <div className="col-12">
	          	  <label htmlFor="title">Storage sender</label>
              	  <SelectComponent
          	        id="StorageSender"
          	        idStorage={this.state.idStorageSender}
	                ref={select => {
	                  this.target1 = select;
	              	}}                        
                	handleOnChange={this.handleStorageSenderChange}
                  />
                </div>
              </div>
              <div className="row mt-2">
	            <div className="col-12">
              	  <label htmlFor="title">Storage receiver</label>
              	  <SelectComponent
                	id="StorageReceiver"
                	idStorage={this.state.idStorageReceiver}
	              	ref={select => {
	               	  this.target2 = select;
	              	}} 
                	handleOnChange={this.handleStorageReceiverChange}
                  />
                </div>
              </div>
              <div className="row mt-2">
	            <div className="col-12">
	          	  <label htmlFor="title">Cost</label>
              	  <input
            		type="number"
            		className="form-control"
            		id="cost"
            		min='1'
            		required='true'
	        		disabled='true'
            		value={cost}	        
              	  />
            	</div>
          	  </div>
          	</div>
          </div>
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          SAVE
        </button>        
      </form>
      <Modal show={this.state.show}>
		<Modal.Header>
		  <Modal.Title>Success</Modal.Title>
		</Modal.Header>
		  <Modal.Body>
		    <h3>You have created a new sending!</h3>
		    <p>Sending number: {this.state.newSendingId}</p>
		    <p>You can find out about your sending using this number</p>
		    <p>Also we sent this number on your email</p>
		  </Modal.Body>
		  <Modal.Footer>		    
			<Button
			  bsStyle="primary" 
			  onClick={this.handleClose}
			>
			  OK
			</Button>
          </Modal.Footer>
		</Modal>
		<Modal show={this.state.showError}>
		<Modal.Header>
		  <Modal.Title>Error</Modal.Title>
		</Modal.Header>
		  <Modal.Body>
		    <h3>Something went wrong. Sorry!</h3>		    
		  </Modal.Body>
		  <Modal.Footer>		    
			<Button
			  bsStyle="primary" 
			  onClick={this.handleClose}
			>
			  OK
			</Button>
          </Modal.Footer>
		</Modal>
	  </div>
    );
  }
}

const AddSendingComponent = connect(null, mapDispatchToProps)(SendingComponent);

SendingComponent.propTypes = {
  addSending: PropTypes.func.isRequired
};

export default AddSendingComponent;
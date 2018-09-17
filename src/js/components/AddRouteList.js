import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import SelectTransportComponent from './SelectTransportComponent';
import SelectSendingComponent from './SelectSendingComponent';
import SelectComponent from './SelectComponent';
import { addRoutesList } from "../actions/index";
import {Overlay, Tooltip, Button, Modal} from 'react-bootstrap';
import ReactDOM from 'react-dom';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapDispatchToProps = dispatch => {
  return {
    addRoutesList: data => dispatch(addRoutesList(data))
  };
};

class RouteListComponent extends Component {
	
  constructor(props) {
    super(props);    

    this.state = {       
      date: '',
      expectingDate: '',  
      idStorageSender: null,
      idStorageReceiver: null,
      idTransport: null,
      maxWeight: 0,
      sendings: [],
      showValidationErrorTransport: false,
      showValidationErrorWeight: false,
      showValidationErrorSendings: false,
    };  
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });    
  }

  handleTransportChange = (e) => {    
    if (e === null) {
      this.setState({	
      	idTransport: null,
      	maxWeight: 0,
      })
    } else {
      this.setState({	
      	idTransport: e.value,
      	maxWeight: e.maxWeight,
      });      
    }
  }

  handleStorageSenderChange = (e) => {    
    if (e === null) {
      this.setState({	
      	idStorageSender: null,
      	sendings: [],
      })
    } else {
      this.setState({	
      	idStorageSender: e.value,
      	sendings: [],
      });      
    }
  }

  handleStorageReceiverChange = (e) => {
    if (e === null) {
      this.setState({	
      	idStorageReceiver: null,
      	sendings: [],
      })
    } else {
      this.setState({	
      	idStorageReceiver: e.value,
      	sendings: [],
      });	
    }    
  }

  handleSendingChange = (e) => {
  	if (e === null) {
      this.setState({	
      	sendings: [],
      })
    } else {
      this.setState({	
      	sendings: e,
      });	
    }	
  } 

  handleSubmit = (event) => {
  	event.preventDefault();
  	const currentWeight = this.state.sendings.reduce((sum, current) => {
	  return sum + current.weight;
	}, 0);
  	if (this.state.idTransport == null) {
  	  this.setState({ 
  		showValidationErrorTransport: true,
      })
  	}  	
  	else if (this.state.maxWeight < currentWeight) {
  	  this.setState({ 
  		showValidationErrorWeight: true,
      })
  	}
  	else if (this.state.sendings.length === 0) {
  	  this.setState({ 
  		showValidationErrorSendings: true,
      })
  	} else {
	  const { date, expectingDate, idStorageSender, idStorageReceiver, idTransport, sendings } = this.state;
	    
	  axios.post(`${config.path}/routeLists`, { date, expectingDate, idTransport, idStorageSender, idStorageReceiver, sendings })
	    .then(res => {
	      this.getRoutesList();
	    })        
	    .catch(err =>
	      console.error(err)
	    );

	  this.setState({ 
	    date: '',
        expectingDate: '',  
        idStorageSender: null,
        idStorageReceiver: null,
        idTransport: null,
        maxWeight: 0,
        sendings: [], 
	  });
  	}
  }

  getRoutesList = () => {
    axios.get(`${config.path}/routeLists`)
    .then(res => {
      this.props.addRoutesList(res.data);
    }); 
  }

  render() {
  	const { date, expectingDate, idTransport, maxWeight, idStorageSender, idStorageReceiver, sendings } = this.state;
	const currentWeight = sendings.reduce((sum, current) => {
	  return sum + current.weight;
	}, 0);	
	const validationDate = new Date().toISOString().substr(0,10);
	return (
	  <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div className="panel panel-default">
          	  <div className="panel-heading">
          	    <h3 className="panel-title">Route list information</h3>
  			  </div>          
          	  <div className="panel-body">
          	    <div className="row mt-2">
          	      <div className="col-4">
		      	    <label htmlFor="title">Date</label>
		      	    <input
	                  type="date"
	                  className="form-control"
	                  id="date"
	                  placeholder='Enter date'
	                  required='true'
	                  min={validationDate}            
	                  value={date}
	                  onChange={this.handleChange}
	          	    />
		          </div>
		          <div className="col-4 offset-md-2">
		      	    <label htmlFor="title">Expecting date</label>
		      	    <input
	                  type="date"
	                  className="form-control"
	                  id="expectingDate"
	                  placeholder='Enter expecting date'
	                  required='true'
	                  min={validationDate}             
	                  value={expectingDate}
	                  onChange={this.handleChange}
	          	    />
		          </div>
		        </div>
		        <div className="row mt-4">
	              <div className="col-8">
	          	    <label htmlFor="title">Transport</label>
              	    <SelectTransportComponent
          	          id="Transport"
          	          idTransport={idTransport}
	                  ref={select => {
	                    this.target1 = select;
	              	  }}                        
                	  handleOnChange={this.handleTransportChange}
                    />
                  </div>
                  <div className="col-3 offset-md-1 align-self-end">
                    <label>max weight: {maxWeight}</label>
                  </div>
                </div>
                <div className="row mt-4">
	              <div className="col-12">
	          	    <label htmlFor="title">Storage sender</label>
              	    <SelectComponent
          	          id="StorageSender"
          	          idStorage={idStorageSender}	                                         
                	  handleOnChange={this.handleStorageSenderChange}
                    />
                  </div>
                </div>
                <div className="row mt-4">
	              <div className="col-12">
              	    <label htmlFor="title">Storage receiver</label>
              	    <SelectComponent
                	  id="StorageReceiver"
                	  idStorage={idStorageReceiver}	              	   
                	  handleOnChange={this.handleStorageReceiverChange}
                    />
                  </div>
                </div>
                <div className="row mt-4">	              
              	  <div className="col-6">
              	    <label >Sending(s)</label>
              	  </div>
              	  <div className="col-6">
              	    <label >total weight: {currentWeight}</label>
              	  </div>
              	</div>
              	<div className="row mt-1">
              	  <div className="col-12">  
              	    <SelectSendingComponent
                      id="Sending"
                	  sendingsList={sendings}
                	  idStorageSender={idStorageSender}
                	  idStorageReceiver={idStorageReceiver}
	              	  ref={select => {
	               	    this.target2 = select;
	              	  }} 
                	  handleOnChange={this.handleSendingChange}
                    />
                  </div>
                </div>
          	  </div>
          	</div>
          </div>
          <button 
            type="submit" 
            className="btn btn-success btn-lg"          	
	      >
            SAVE
          </button>
          <Overlay
            show={this.state.showValidationErrorTransport}
            rootClose={true}
            onHide={() => this.setState({ showValidationErrorTransport: false })}
            placement="bottom"
            container={this.refs.target}
            target={() => ReactDOM.findDOMNode(this.target1)}
          >
            <Tooltip id="overload-bottom">Please fill out this field.</Tooltip>
          </Overlay>
          <Overlay
            show={this.state.showValidationErrorWeight || this.state.showValidationErrorSendings}
            rootClose={true}
            onHide={() => this.setState({ showValidationErrorWeight: false, showValidationErrorSendings: false })}
            placement="bottom"
            container={this.refs.target}
            target={() => ReactDOM.findDOMNode(this.target2)}
          >
            {this.state.showValidationErrorWeight ?
              <Tooltip id="overload-bottom">Total weight can't be more than max weight.</Tooltip>
            : <Tooltip id="overload-bottom">You must choose at least one sending.</Tooltip>} 
          </Overlay>
        </form>
	  </div>
	)
  }

} 

const AddRouteListComponent = connect(null, mapDispatchToProps)(RouteListComponent);

RouteListComponent.propTypes = {
  addRouteList: PropTypes.func.isRequired
};

export default AddRouteListComponent;
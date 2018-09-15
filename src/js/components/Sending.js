import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addStoragesList, addTariffsList, removeTariff } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

export default class ConnectedList extends React.Component{

  constructor(props) {
    super(props);    

    this.state = {       
      sendingNumber: '',
      sending: null,      
    };  
  }

  handleChange = (event) => {
  	this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit = (event) => {
  	event.preventDefault();
  	axios.get(`${config.path}/sendings/number/${this.state.sendingNumber}`)
  	  .then(res => {
	      this.setState({
	      	sending: Object.assign({}, this.state.sending, res.data),
	      });
	    })
	    .catch(err => console.log(err))
  }

  handleReset = (event) => {
  	event.preventDefault();
  	this.setState({
      sendingNumber: '',
      sending: null,      
    });
  }

  render() {  
  	const { sending } = this.state;
   	return (
  	  <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div className="panel panel-default">
          	  <div className="panel-body row mt-1">                    
	            <div className="col-8">
		      	  <label htmlFor="title">Number</label>
		      	  <input
	                type="number"
	                className="form-control"
	                id="sendingNumber"
	                placeholder='Enter sending number'
	                required='true'
	                size='10'              
	              	value={this.state.sendingNumber}
	              	onChange={this.handleChange}
	          	  />
		        </div>
		        <div className="col-2 align-self-end">
		          <Button 
				    type="submit" 
				    className="btn btn-success btn-large"
				  >
				    Find
				  </Button>					
		        </div>
		        <div className="col-2 align-self-end">
		          <Button
		            className="btn btn-warning btn-large"		            
				    onClick={this.handleReset}
				  >
				    Reset
				  </Button>
		        </div>
		      </div>
		    </div>
  	      </div>
  	    </form>
  	  

  	    {this.state.sending !== null ?
  	  	  <div>
  	  	    <div className="panel panel-default">
          	  <div className="panel-heading">
          	    <h3 className="panel-title">Sending information</h3>
  			  </div>
  			  <div className="panel-body row mt-1">                    
	          	<div className="col">
  			  	  <p>
	        	    {'date: ' + new Date(sending.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' }) + ', number: ' + sending.number}
	        	  </p>
	        	  <p>
	        	    {'status: ' + sending.status.replace(/_/g," ") + ', cost: ' + sending.cost}
	        	  </p>	        	  
	        	  <p>
	        	    {'senser: ' + sending.sender}
	        	  </p>
	        	  <p>
	        	    {'receiver: ' + sending.receiver}
	        	  </p>
	        	  <p>
	        	    {'storage: ' + sending.storage}
	        	  </p>
	        	</div>
              </div>
  			</div>
  	  	  </div>
  	    : null
  	    }
  	  </div>
  	)
  }
}

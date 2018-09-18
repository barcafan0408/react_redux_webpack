import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import SelectComponent from './SelectComponent';
import { addTariffsList } from "../actions/index";
import {Overlay, Tooltip} from 'react-bootstrap';
import ReactDOM from 'react-dom';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapDispatchToProps = dispatch => {
  return {
    addTariffsList: data => dispatch(addTariffsList(data))
  };
};

class TariffComponent extends Component {

  constructor(props) {
    super(props);    

    this.state = { 
      date: '',
      idStorageSender: null,
      idStorageReceiver: null,
      minWeight: 0,
      maxWeight: 0,
      fragile: false,
      price: 0,
      showValidationErrorSender: false,
      showValidationErrorReceiver: false,
      showValidationErrorSameStores: false,
    };    
  }  

  handleStorageSenderChange = e => {    
    if (e === null) {
      this.setState({	
      	idStorageSender: null,
      })
    } else {
      this.setState({	
      	idStorageSender: e.value,
      })	
    }
  }

  handleStorageReceiverChange = e => {
    if (e === null) {
      this.setState({	
      	idStorageReceiver: null,
      })
    } else {
      this.setState({	
      	idStorageReceiver: e.value,
      })	
    }
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleFragileChange = event => {
  	this.setState({ [event.target.id]: event.target.checked });  	
  }

  handleSubmit = event => {
  	event.preventDefault();
  	if (this.state.idStorageSender == null) {
  	  this.setState({ 
  		showValidationErrorSender: true,
      })
  	}
  	else if (this.state.idStorageReceiver == null) {
  	  this.setState({ 
  		showValidationErrorReceiver: true,
      })
    }
    else if (this.state.idStorageSender === this.state.idStorageReceiver) {
  	  this.setState({ 
  		showValidationErrorSameStores: true,
      })
  	} else {  		
	  const { date, idStorageSender, idStorageReceiver, minWeight, maxWeight, fragile, price } = this.state;
	    
	  axios.post(`${config.path}/tariffs`, { date, idStorageSender, idStorageReceiver, minWeight, maxWeight, fragile, price })
	    .then(res => {
	      this.getTariffsList();
	    })
	    .catch(err =>
	      console.error(err)
	    );

	  this.setState({ 
	    date: '',
	    idStorageSender: null,
	    idStorageReceiver: null,
	    minWeight: 0,
	    maxWeight: 0,
	    fragile: false,
	    price: 0, 
	  });
  	}
  }

  getTariffsList = () => {
    axios.get(`${config.path}/tariffs`)
    .then(res => {
      this.props.addTariffsList(res.data);
    }); 
  }

  render() {  	
    const { date, minWeight, maxWeight, fragile, price } = this.state;
  	return (
  	  <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="row mt-4">
            <div className="col-12">
	          <label htmlFor="title">Date</label>
	          <input
	            type="date"
	            className="form-control"
	            id="date"
	            placeholder='Enter date'
	            required='true'
	            value={date}
		        onChange={this.handleChange}            
	          />
	        </div>
          </div>          
	      <div className="row mt-4">
            <div className="col-12">
	          <label htmlFor="title">Min weight</label>
	          <div className="input-group">
	            <input
	              type="number"
	              className="form-control"
	              id="minWeight"
	              step='1'
	              min='1'
	              max='10000'
	              value={minWeight}
		          onChange={this.handleChange}
	            />
	            <span className="input-group-addon">kg</span>
              </div>              
	        </div>
	      </div>
	      <div className="row mt-4">
            <div className="col-12">
	          <label htmlFor="title">Max weight</label>
	          <div className="input-group">
	            <input
	              type="number"
	              className="form-control"
	              id="maxWeight"
	              step='1'
	              min='1'
	              max='10000'
	              value={maxWeight}
		          onChange={this.handleChange}
	            />
	            <span className="input-group-addon">kg</span>
              </div>
	        </div>
	      </div>
	      <div className="row mt-4">
            <div className="col-12">                  
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
	      <div className="row mt-4">
            <div className="col-12">     
	          <label htmlFor="title">Price</label>
	          <div className="input-group">
	            <input
	              type="number"
	              className="form-control"
	              id="price"
	              step="1"
	              min='1'
	              max='1000000'
	              value={price}
		          onChange={this.handleChange}
	            />
	            <span className="input-group-addon">uah</span>
              </div>
	        </div>
		  </div>
		  <div className="row mt-4">
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
	      <div className="row mt-4">
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
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          SAVE
        </button>
        <Overlay
          show={this.state.showValidationErrorSender}
          rootClose={true}
          onHide={() => this.setState({ showValidationErrorSender: false })}
          placement="bottom"
          container={this.refs.target}
          target={() => ReactDOM.findDOMNode(this.target1)}
        >
          <Tooltip id="overload-bottom">Please fill out this field.</Tooltip>
        </Overlay>
        <Overlay
          show={this.state.showValidationErrorReceiver}
          rootClose={true}
          onHide={() => this.setState({ showValidationErrorReceiver: false })}
          placement="bottom"
          container={this.refs.target}
          target={() => ReactDOM.findDOMNode(this.target2)}
        >
          <Tooltip id="overload-bottom">Please fill out this field.</Tooltip>
        </Overlay>
        <Overlay
          show={this.state.showValidationErrorSameStores}
          rootClose={true}
          onHide={() => this.setState({ showValidationErrorSameStores: false })}
          placement="bottom"
          container={this.refs.target}
          target={() => ReactDOM.findDOMNode(this.target2)}
        >
          <Tooltip id="overload-bottom">Storages can not be the same</Tooltip>
        </Overlay>
      </form>
    );
  }
}

const AddTariffComponent = connect(null, mapDispatchToProps)(TariffComponent);

TariffComponent.propTypes = {
  addTariffsList: PropTypes.func.isRequired
};

export default AddTariffComponent;
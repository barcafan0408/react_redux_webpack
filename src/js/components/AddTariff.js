import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import SelectComponent from './SelectComponent';
import { addTariff } from "../actions/index";
import {Overlay, Tooltip} from 'react-bootstrap';
import ReactDOM from 'react-dom';

const mapDispatchToProps = dispatch => {
  return {
    addTariff: tariff => dispatch(addTariff(tariff))
  };
};

class TariffComponent extends Component<*, State> {

  constructor(props) {
    super(props);    

    this.state = { 
      date: '',
      idStorageSender: '',
      idStorageReceiver: '',
      minWeight: 0,
      maxWeight: 0,
      fragile: false,
      price: 0,
      showValidationErrorSender: false,
      showValidationErrorReceiver: false,
    };

    this.handleStorageSenderChange = this.handleStorageSenderChange.bind(this);
    this.handleStorageReceiverChange = this.handleStorageReceiverChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }  

  handleStorageSenderChange (e) {    
    if (e === null) {
      this.setState({	
      	idStorageSender: '',
      })
    } else {
      this.setState({	
      	idStorageSender: e.value,
      })	
    }
  };

  handleStorageReceiverChange (e) {
    if (e === null) {
      this.setState({	
      	idStorageReceiver: '',
      })
    } else {
      this.setState({	
      	idStorageReceiver: e.value,
      })	
    }
  };

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
  	event.preventDefault();
  	if (this.state.idStorageSender == '') {
  	  this.setState({ 
  		showValidationErrorSender: true,
      })
  	}
  	else if (this.state.idStorageReceiver == '') {
  	  this.setState({ 
  		showValidationErrorReceiver: true,
      })
  	} else {  		
	  const { date, idStorageSender, idStorageReceiver, minWeight, maxWeight, fragile, price } = this.state;
	    
	  axios.post(`http://localhost:3000/tariffs`, { date, idStorageSender, idStorageReceiver, minWeight, maxWeight, fragile, price })
	    .then(res => {
	      console.log(res);
	      console.log(res.data);
	      this.props.addTariff({ date, idStorageSender, idStorageReceiver, minWeight, maxWeight, fragile, price, id: res.data.id });
	    })        
	    .catch(err =>
	      console.error(err)
	    );

	  this.setState({ 
	    date: '',
	    idStorageSender: '',
	    idStorageReceiver: '',
	    minWeight: 0,
	    maxWeight: 0,
	    fragile: false,
	    price: 0, 
	  });
  	}
  }

  render() {  	
    const { date, minWeight, maxWeight, fragile, price } = this.state;
  	return (
  	  <form onSubmit={this.handleSubmit}>
        <div className="form-group">
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
          <label htmlFor="title">Storage sender</label>
          <SelectComponent
          	id="StorageSender"
	        ref={select => {
	          this.target1 = select;
	        }}                        
            handleOnChange={this.handleStorageSenderChange}
          />
          <label htmlFor="title">Storage receiver</label>
          <SelectComponent
          id="StorageReceiver"
	        ref={select => {
	          this.target2 = select;
	        }} 
            handleOnChange={this.handleStorageReceiverChange}
          />
          <label htmlFor="title">Min weight</label>
          <input
            type="number"
            className="form-control"
            id="minWeight"
            step='100'
            min='100'
            max='10000'
            value={minWeight}
	        onChange={this.handleChange}
          />
          <label htmlFor="title">Max weight</label>
          <input
            type="number"
            className="form-control"
            id="maxWeight"
            step='100'
            min='100'
            max='10000'
            value={maxWeight}
	        onChange={this.handleChange}
          />                     
		  <div className="checkbox">
			<label>
			  <input
			    type="checkbox"
			    id="fragile"
			    value={fragile}
	        	onChange={this.handleChange}
			  />
			  Fragile
			</label>
	      </div>	        
          <label htmlFor="title">Price</label>
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
      </form>
    );
  }
}

const AddTariffComponent = connect(null, mapDispatchToProps)(TariffComponent);

TariffComponent.propTypes = {
  addTariff: PropTypes.func.isRequired
};

export default AddTariffComponent;
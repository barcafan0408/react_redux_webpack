import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

class SelectSendingComponent extends Component {
  
  constructor(props) {
    super(props); 
    
  	this.state = { 
      sendings: [],
    };  	
  }

  getSendings = () => {
    axios.get(`${config.path}/sendings/betweenStorages`, {
        params: {
          idStorageSender: this.props.idStorageSender,
          idStorageReceiver: this.props.idStorageReceiver,
        }
      })
      .then(res => {
        this.setState({
          sendings: res.data.map(sending => ({ label: sending.number, value: sending.id, weight: sending.weight }))
        })
      })
  }
  
  render() {  	  	
    return (
      <div>
        <Select          
          name="form-field-name"          
          value={this.props.sendingsList === null || this.props.sendingsList === undefined ? null : this.props.sendingsList}
          onChange={this.props.handleOnChange}          
          isClearable='true'
          isSearchable='true'
          isMulti='true'
          onFocus={this.getSendings}
          options={this.state.sendings}                  
        />
      </div>
    );
  }
}

export default SelectSendingComponent;
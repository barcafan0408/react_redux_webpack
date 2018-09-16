import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

class SelectTransportComponent extends Component {
  
  constructor(props) {
    super(props); 
    
  	this.state = { 
      transport: [],
    };  	
  }

  componentDidMount() {
    axios.get(`${config.path}/transport`)
      .then(res => {
        this.setState({
          transport: res.data.map(car => ({ label: car.name, value: car.id, maxWeight: car.maxWeight }))
        })
      })
  }
  
  render() {  	
  	const index = this.state.transport.findIndex((element) =>
      element.value === this.props.idTransport 
    );
    return (
      <div>
        <Select          
          name="form-field-name"
          value={this.props.idTransport === null || this.props.idTransport === undefined ? null : this.state.transport[index]}
          onChange={this.props.handleOnChange}          
          isClearable='true'
          isSearchable='true'
          options={this.state.transport}                  
        />
      </div>
    );
  }
}

export default SelectTransportComponent;
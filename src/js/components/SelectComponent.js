import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

class SelectComponent extends Component {
  
  constructor(props) {
    super(props); 
    
  	this.state = { 
      storages: [],
    };  	
  }

  componentDidMount() {
    axios.get(`${config.path}/storages`)
      .then(res => {
        this.setState({
          storages: res.data.map(store => ({ label: store.name, value: store.id }))
        })
      })
  }
  
  render() {  	
  	const index = this.state.storages.findIndex((element) =>
      element.id === this.props.idStorage 
    );
    return (
      <div>
        <Select          
          name="form-field-name"
          value={this.props.idStorage === null || this.props.idStorage === undefined ? null : this.state.storages[index]}
          onChange={this.props.handleOnChange}          
          isClearable='true'
          isSearchable='true'
          options={this.state.storages}                  
        />
      </div>
    );
  }
}

export default SelectComponent;
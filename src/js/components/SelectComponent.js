import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios';

class SelectComponent extends Component {
  
  constructor(props) {
    super(props); 
    
  	this.state = { 
      storages: [],
    };  	
  }

  componentDidMount() {
    axios.get('http://localhost:3000/storages')
      .then(res => {
        this.setState({
          storages: res.data.map(store => ({ label: store.name, value: store.id }))
        })
      })
  }
  
  render() {
    return (
      <div>
        <Select          
          name="form-field-name"
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
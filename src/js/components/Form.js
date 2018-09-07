import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addTransport } from "../actions/index";

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapDispatchToProps = dispatch => {
  return {
    addTransport: transport => dispatch(addTransport(transport))
  };
};

class ConnectedForm extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      volume: 0,
      maxWeight: 0,
      speed: 0,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, volume, maxWeight, speed } = this.state;
    
    axios.post(`${config.path}/transport`, { transportName:name, volume, maxWeight, speed})
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.props.addTransport({ name, volume, maxWeight, speed, id: res.data.id });
      })        
      .catch(err =>
        console.error(err)
      );

    this.setState({ 
      name: "",
      volume: 0,
      maxWeight: 0,
      speed: 0, 
    });
  }

  render() {
    const { name, volume, maxWeight, speed } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder='Enter transport name'
            required='true'
            pattern='^[a-zA-Z0-9\s_\\-\\#№]{3,255}'
            value={name}
            onChange={this.handleChange}
          />
          <label htmlFor="title">Volume</label>
          <input
            type="number"
            className="form-control"
            id="volume"
            step='10'
            min='10'
            max='1000'
            value={volume}
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
          <label htmlFor="title">Speed</label>
          <input
            type="number"
            className="form-control"
            id="speed"
            step='5'
            min='5'
            max='200'            
            value={speed}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          SAVE
        </button>
      </form>
    );
  }
}

const Form = connect(null, mapDispatchToProps)(ConnectedForm);

ConnectedForm.propTypes = {
  addTransport: PropTypes.func.isRequired
};

export default Form;

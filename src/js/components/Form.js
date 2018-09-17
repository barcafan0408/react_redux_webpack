import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addTransportList } from "../actions/index";

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapDispatchToProps = dispatch => {
  return {    
    addTransportList: data => dispatch(addTransportList(data)),
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
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, volume, maxWeight, speed } = this.state;
    
    axios.post(`${config.path}/transport`, { transportName:name, volume, maxWeight, speed})
      .then(res => {
        this.getTransportList();
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

  getTransportList = () => {
    axios.get(`${config.path}/transport`)
    .then(res => {
      this.props.addTransportList(res.data);
    }); 
  }

  render() {
    const { name, volume, maxWeight, speed } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="row mt-2">
            <div className="col-12">
             <label htmlFor="title">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder='Enter transport name'
                required='true'
                pattern='^[a-zA-Z0-9\s_\-#№]{3,255}'
                value={name}
                onChange={this.handleChange}
              />
            </div>
          </div>    
          <div className="row mt-4">
            <div className="col-12">      
              <label htmlFor="title">Volume</label>          
              <div className="input-group">          
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
                <span className="input-group-addon">m<sup>3</sup></span>            
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
                  step='100'
                  min='100'
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
              <label htmlFor="title">Speed</label>
              <div className="input-group">
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
                <span className="input-group-addon">km/h</span>
              </div>
            </div>
          </div>
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
  addTransportList: PropTypes.func.isRequired
};

export default Form;

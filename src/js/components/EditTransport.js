import React from "react";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

class EditModal extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.transport.name,
      volume: this.props.transport.volume,
      maxWeight: this.props.transport.maxWeight,
      speed: this.props.transport.speed,
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit = (event) => {    
  	event.preventDefault();
    const { name, volume, maxWeight, speed } = this.state;    
    const id = this.props.transport.id;    
    axios.put(`${config.path}/transport/${id}`, { transportName:name, volume, maxWeight, speed})
      .then(res => {      	  
      	this.props.onHide();
      })
      .catch(err =>
        console.error(err)
      );
  }

  render() {
  	return (
  	  <div>
        <Modal {...this.props} >
		  <Modal.Header>
			<Modal.Title>Change item</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
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
		              value={this.state.name}
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
		                value={this.state.volume}
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
			            value={this.state.maxWeight}
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
			            value={this.state.speed}
			            onChange={this.handleChange}
			          />
			          <span className="input-group-addon">km/h</span>
		        	</div>
		          </div>
		        </div>
		      </div>	
		      <button type="submit" className="btn btn-success btn-lg">
		        Save new properties
		      </button>
		    </form>
		  </Modal.Body>
		  <Modal.Footer>			
			<Button
			  onClick={this.props.onHide}  
			>
			  Cancel
			</Button>
          </Modal.Footer>
		</Modal>
  	  </div>
  	)
  }

}

export default EditModal;
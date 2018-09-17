import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import {withGoogleMap, Marker, GoogleMap} from "react-google-maps";
import { addStoragesList } from "../actions/index";

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapDispatchToProps = dispatch => {
  return {
    addStoragesList: data => dispatch(addStoragesList(data))
  };
};

const GoogleMapComponent = withGoogleMap(props => 
  <GoogleMap
    defaultZoom={8}    
    center={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
  >
    {props.isMarkerShown && 
      <Marker 
    	position={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }} 
    	draggable={true} 
    	onDragEnd={props.onDragEnd}    	
      />}
  </GoogleMap>///
);

class StorageComponent extends Component {  
  
  constructor(props) {
    super(props);    

    this.state = {
      name: "",
      address: {
      	country: "",
      	region: "",
        city: "",
        street: "",
      	house: "",
      },
      type: "less than 30",
      isMarkerShown: true,
      currentLatLng: {
        lat: 49.232957,
        lng: 28.468102,
      },                
    };  
  }
  
  handleMarkerDrop = (e) => {
    this.setState({
      currentLatLng: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
      address: {
	   	country: "",
	   	region: "",
	    city: "",
	    street: "",
	   	house: "",
	  }
    })     
    const addressTest = { country: "", region: "", city: "", street: "", house: "", };   
    let geocoder = new window.google.maps.Geocoder();
    geocoder.geocode( { 'location': this.state.currentLatLng }, function(results, status) {
      if (status == 'OK') {
        console.log('here result of geocoder', results);        
        if (results.length > 0){
		  const point = results[0];
		    for (const key in point.address_components) {
			  const component = point.address_components[key];
			  if (component.types.length > 0) {
                const type = component.types[0];
				if (type === "country"){
				  addressTest.country = component.long_name      									    	  			
				} else if (type === "administrative_area_level_1"){
				  addressTest.region = component.long_name				  		    		
				} else if (type === "locality"){
				  addressTest.city = component.long_name				  		    		
				} else if (type === "route"){
				  addressTest.street = component.long_name				  
				} else if (type === "street_number"){
				  addressTest.house = component.long_name				  
				}						    	
			  }						    
			}	
		  }
		this.setState({
      	  address: addressTest
      	})
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    }.bind(this));    
  }  

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { country, region, city, street, house } = this.state.address;
  	const { name} = this.state;
    const type = this.state.type.replace(/ /g,"_");

    axios.post(`${config.path}/storages`, { storageName:name, country, region, city, street, house, storageType:type })
      .then(res => {
        this.getStoragesList();
      })        
      .catch(err =>
        console.error(err)
      );

    this.setState({ 
      name: "",
      address: {
	   	country: "",
	   	region: "",
	    city: "",
	    street: "",
	   	house: "",
	  },
	  type: "less than 30", 
    });
  }

  getStoragesList = () => {
    axios.get(`${config.path}/storages`)
    .then(res => {
      this.props.addStoragesList(res.data);
    }); 
  }

  render() {
  	const { country, region, city, street, house } = this.state.address;
  	const { name, type } = this.state;
    return (
      <div className="row mt-4">
        <div className="col-5">
	      <form onSubmit={this.handleSubmit}>
	        <div className="form-group">
	          <div className="row mt-4">
            	<div className="col-12">
		          <label htmlFor="title">Name</label>
		          <input
		            type="text"
		            className="form-control"
		            id="name"
		            placeholder='Enter transport name'
		            required='true'
		            pattern='^[a-zA-Z0-9\s_\-#№]{2,255}'
		            value={name}
		            onChange={this.handleChange}
		          />
		        </div>
          	  </div>
          	  <div className="row mt-4">
            	<div className="col-12">
		          <label htmlFor="title">Country</label>
		          <input
		            type="text"
		            className="form-control"
		            id="country"
		            placeholder='Enter country'
		            required='true'
		            disabled='true'
		            value={country}
		          />
		        </div>
          	  </div>
          	  <div className="row mt-4">
            	<div className="col-12">
		          <label htmlFor="title">Region</label>
		          <input
		            type="text"
		            className="form-control"
		            id="region"
		            placeholder='Enter region'
		            required='true'
		            disabled='true'
		            value={region}	            
		          />
		        </div>
          	  </div>
          	  <div className="row mt-4">
            	<div className="col-12">
		          <label htmlFor="title">City</label>
		          <input
		            type="text"
		            className="form-control"
		            id="city"
		            placeholder='Enter city'
		            required='true'
		            disabled='true'
		            value={city}	            
		          />
		        </div>
          	  </div>
          	  <div className="row mt-4">
            	<div className="col-12">
		          <label htmlFor="title">Street</label>
		          <input
		            type="text"
		            className="form-control"
		            id="street"
		            placeholder='Enter street'
		            required='true'
		            disabled='true'
		            value={street}	            
		          />
		        </div>
          	  </div>
          	  <div className="row mt-4">
            	<div className="col-12">
		          <label htmlFor="title">House</label>
		          <input
		            type="text"
		            className="form-control"
		            id="region"
		            placeholder='Enter house number'
		            required='true'
		            disabled='true'
		            value={house}	            
		          />
		        </div>
          	  </div>
          	  <div className="row mt-4 mb-2">
            	<div className="col-12">
		          <label htmlFor="title">Type</label>
		          <select
	                className="form-control"
		            id="type"
		            required='true'
		            value={type}
		            onChange={this.handleChange}
		          > 
		            <option>less than 30</option>
	  				<option>more than 30</option>
		          </select>
		        </div>
          	  </div>
	        </div>
	        <button type="submit" className="btn btn-success btn-lg">
	          SAVE
	        </button>
	      </form>
        </div>
        <div className="col-7">
          <GoogleMapComponent
            isMarkerShown={this.state.isMarkerShown}
            currentLocation={this.state.currentLatLng}
            onDragEnd={this.handleMarkerDrop}        
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `600px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    )
  }
}

const AddStorageComponent = connect(null, mapDispatchToProps)(StorageComponent);

StorageComponent.propTypes = {
  addStoragesList: PropTypes.func.isRequired
};

export default AddStorageComponent;

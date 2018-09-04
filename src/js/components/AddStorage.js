import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import {withGoogleMap, Marker, GoogleMap} from "react-google-maps";
import { addStorage } from "../actions/index";

const mapDispatchToProps = dispatch => {
  return {
    addStorage: storage => dispatch(addStorage(storage))
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
      type: "less_than_30",
      isMarkerShown: true,
      currentLatLng: {
        lat: 49.232957,
        lng: 28.468102,
      },                
    };    
    
    this.handleMarkerDrop = this.handleMarkerDrop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleMarkerDrop(e) {
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

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { country, region, city, street, house } = this.state.address;
  	const { name, type } = this.state;
    
    axios.post(`http://localhost:3000/storages`, { storageName:name, country, region, city, street, house, storageType:type })
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.props.addStorage({ name, country, region, city, street, house, storageType:type, id: res.data.id });
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
	  type: "less_than_30", 
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
	          <label htmlFor="title">Name</label>
	          <input
	            type="text"
	            className="form-control"
	            id="name"
	            placeholder='Enter transport name'
	            required='true'
	            pattern='^[a-zA-Z0-9\s_\\-\\#№]{2,255}'
	            value={name}
	            onChange={this.handleChange}
	          />
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
	          <label htmlFor="title">Type</label>
	          <select
                className="form-control"
	            id="type"
	            required='true'
	            value={type}
	            onChange={this.handleChange}
	          > 
	            <option>less_than_30</option>
  				<option>more_than_30</option>
	          </select>
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
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      </div>
      </div>
    )
  }
}

const AddStorageComponent = connect(null, mapDispatchToProps)(StorageComponent);

StorageComponent.propTypes = {
  addStorage: PropTypes.func.isRequired
};

export default AddStorageComponent;

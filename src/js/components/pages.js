import React from 'react';
import List from "./List";
import Form from "./Form";

import AddStorage from "./AddStorage";
import StoragesList from "./StoragesList";

import AddTariff from "./AddTariff";

import {withGoogleMap, Marker, GoogleMap} from "react-google-maps";

const MyGoogleMapComponent = withGoogleMap(props => 
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
  </GoogleMap>
)


export const Home = () => (
  <div>
    <h1>Admin delivery settings</h1>
  </div>
)

export const TransportPage = () => (
  <div className="row mt-4">
    <div className="col-6">
      <h2>Transport list</h2>
      <List />
    </div>
    <div className="col-4 offset-md-1">
      <h2>Add new transport</h2>
      <Form />
    </div>
  </div>
)

export const StoragePage = () => (
  <div className="row mt-4">
    <div className="col-4">
      <h2>Storages list</h2>
      <StoragesList />
    </div>
    <div className="col-7 offset-md-1">
      <h2>Add new storage</h2>
      <AddStorage />
    </div>
  </div>
)

export const TariffPage = () => (
  <div className="row mt-4">
    <div className="col-6">
      <h2>Tariffs list</h2>

    </div>
    <div className="col-4 offset-md-1">
      <h2>Add new tariff</h2>
      <AddTariff />
    </div>
  </div>
)

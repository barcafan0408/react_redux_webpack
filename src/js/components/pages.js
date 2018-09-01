import React from 'react';
import List from "./List";
import Form from "./Form";

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
  <div>
    <h1>StoragePage</h1>
  </div>
)

export const TariffPage = () => (
  <div>
    <h1>TariffPage</h1>
  </div>
)

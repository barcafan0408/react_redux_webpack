import React from "react";
import List from "./List";
import Form from "./Form";

const App = () => (
  <div className="container-fluid">
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
  </div>
);

export default App;

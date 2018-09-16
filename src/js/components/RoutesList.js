import React from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { addRoutesList } from "../actions/index";
import { Button, Modal } from 'react-bootstrap';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.js`)[env];

const mapStateToProps = state => {    
  return { routesList: state.routesList.list };
};

const mapDispatchToProps = dispatch => {
  return {
    addRoutesList: data => dispatch(addRoutesList(data)),    
  };
};

class RoutesList extends React.Component{

  constructor(props) {
    super(props); 
      
  }

  componentDidMount() {
    axios.get(`${config.path}/routeLists`)
    .then(res => {
      this.props.addRoutesList(res.data);
    });    
  }

  render() {  
      
    return (
      <div>   
        <ul className="list-group list-group-flush">
          {this.props.routesList.map(el => (
            <li className="list-group-item" key={el.id}>
              <div className="row align-items-center">
                <div className="col-7">
                  <p>
                    {'id: ' + el.id}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const List = connect(mapStateToProps,mapDispatchToProps)(RoutesList);

RoutesList.propTypes = {
  routesList: PropTypes.array.isRequired
};

export default List;
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
      
    this.state = {
      showDelete: false,
      showChange: false,
    };
  }

  componentDidMount() {
    this.getRoutesList();    
  }

  getRoutesList = () => {
    axios.get(`${config.path}/routeLists`)
    .then(res => {
      this.props.addRoutesList(res.data);
    }); 
  }

  handleClose = () => {
    this.setState({ showDelete: false, showChange: false, });
  }  

  handleShowModalDelete = (e) => {
    this.setState({ showDelete: true, deleteId: e.target.id });
  }

  handleDelete = () => {    
    this.setState({ showDelete: false });   
    const id = this.state.deleteId;
    axios.delete(`${config.path}/routeLists/${id}`)
      .then(res => {
        this.getRoutesList();
      });
  }

  handleShowModalChangeStatus= (e) => {
    this.setState({ showChange: true, changeId: e.target.id });
  }

  handleChangeStatus = () => {
    this.setState({ showChange: false });  
    const id = this.state.changeId;
    axios.put(`${config.path}/routeLists/${id}`, {complete: true})
      .then(res => {
        this.getRoutesList();
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
                    {'date: ' + new Date(el.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' })}
                    <br />
                    {'expecting date: ' + new Date(el.expectingDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' })}
                    <br />
                    {'transport: ' + el.transport}
                  </p>
                  <p>
                    {'storage sender: ' + el.sender}
                    <br />
                    {'storage receiver: ' + el.receiver}
                  </p>
                  <p>
                    {'sendings:'}
                    <br />
                    {el.sendings.map(sending => (                     
                      <span>{sending}<br /></span>
                    ))}
                  </p>                  
                </div>
                <button 
                  className="col-2 btn btn-danger btn-sm"
                  id={el.id}
                  onClick={this.handleShowModalDelete}
                >
                  Delete
                </button>
                <button 
                  className="col-2 btn btn-warning btn-sm offset-1"
                  id={el.id}
                  onClick={this.handleShowModalChangeStatus}
                >
                  Change status
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Modal show={this.state.showDelete} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>Delete item</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <h3>Are you sure?</h3>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                bsStyle="primary" 
                onClick={this.handleDelete}
              >
                Delete
              </Button>
            <Button
              onClick={this.handleClose}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showChange} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>Change status</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <h3>Status of all sendings in the route list will be set as 'ready to giving'.<br/> Are you sure?</h3>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                bsStyle="primary" 
                onClick={this.handleChangeStatus}
              >
                Yes
              </Button>
            <Button
              onClick={this.handleClose}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const List = connect(mapStateToProps,mapDispatchToProps)(RoutesList);

RoutesList.propTypes = {
  routesList: PropTypes.array.isRequired
};

export default List;
import React from "react";
import { Switch, Route, Link } from 'react-router-dom';
import { Home, TransportPage, StoragePage, TariffPage, SendingPage, RouteListPage } from './pages';
import './style.css';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/1' component={TransportPage}/>
      <Route exact path='/2' component={StoragePage} />
      <Route exact path='/3' component={TariffPage} />
      <Route exact path='/4' component={SendingPage} />
      <Route exact path='/5' component={RouteListPage} />
    </Switch>
  </main>
)

class NavLink extends React.Component {

  render() {
    return (
      <li className={"nav-item" + (this.props.isActive ? "active": "")}>
        <Link 
          className="nav-link" 
          to={this.props.path}
          onClick={() => this.props.onClick()}
        >
        {this.props.text}</Link>
      </li>
    );
  }
}

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      links: [
        {path: "/1", text: "Transport", isActive: false},
        {path: "/2", text: "Storage", isActive: false},
        {path: "/3", text: "Tariff", isActive: false},
        {path: "/4", text: "Sending", isActive: false},
        {path: "/5", text: "Routes list", isActive: false},
      ]
    }
  }

  handleClick(i) {
    const links = this.state.links.slice(); 
    for (const j in links) {
      links[j].isActive = i == j ;
    }
    this.setState({links: links});
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-static-top navbar-expand-lg navbar-dark bg-primary">
          <Link className="navbar-brand" to="/">Home</Link>
          <ul className="navbar-nav mr-auto">
            {this.state.links.map((link, i) => 
              <NavLink 
                path={link.path} 
                text={link.text} 
                isActive={link.isActive}
                key={link.path} 
                onClick={() => this.handleClick(i)}
              /> 
            )}
          </ul>
        </nav>
      </div>
    );
  }
}

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
);

export default App;

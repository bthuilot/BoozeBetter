import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Container from "react-bootstrap/Container";

class App extends Component {
  render() {
    const App = () => (
      <Container className="d-flex h-100 w-100">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
        </Switch>
      </Container>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;

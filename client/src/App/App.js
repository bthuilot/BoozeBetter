import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import NewRecipe from "./pages/Recipes/New";
import About from "./pages/About";
import { NoMatch } from "./pages/404";

class App extends Component {
  render() {
    const App = () => (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/recipe/new" component={NewRecipe} />
          <Route path="/about" component={About} />
          <Route component={NoMatch} />
        </Switch>
      </React.Fragment>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;

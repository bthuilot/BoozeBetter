import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Search from './pages/Search';
import NewRecipe from './pages/Recipes/New';
import ViewRecipe from './pages/Recipes/View';
import About from './pages/About';
import Account from './pages/Users/Account';
import EditAccount from './pages/Users/Edit';
import Login from './pages/Users/Login';
import Register from './pages/Users/Register';
import { NoMatch } from './pages/404';
import EditRecipe from './pages/Recipes/Edit';

function App() {
  return (
    <>
      <Switch>
        {/* General pages  */}
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/about" component={About} />
        {/* Recipe routes */}
        <Route exact path="/recipes/new" component={NewRecipe} />
        <Route exact path="/recipes/:id" component={ViewRecipe} />
        <Route exact path="/recipes/:id/edit" component={EditRecipe} />
        {/* Account pages  */}
        <Route exact path="/account/edit" component={EditAccount} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        {/* Fall back */}
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}

export default App;

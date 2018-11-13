import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Notes from './components/Notes';
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Notes} />
      </Switch>
    );
  }
}

export default App;

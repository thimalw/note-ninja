import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Notes from './components/Notes';
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <ProtectedRoute path="/" component={Notes} />
      </Switch>
    );
  }
}

export default App;

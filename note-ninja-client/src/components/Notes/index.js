import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Note from './Note';
import NotesList from './NotesList';

class Notes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/notes/:id" component={Note} />
        <Route exact path="/" component={NotesList} />
      </Switch>
    );
  }
}

export default Notes;
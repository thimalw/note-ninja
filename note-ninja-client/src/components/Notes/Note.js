import React, { Component } from 'react';
import Titlebar from '../Titlebar';

class Note extends Component {
  render() {
    return (
      <div className="app-outer">
        <Titlebar>
          <button className="btn btn-secondary">Back</button>
          <button className="btn btn-danger">Delete</button>
        </Titlebar>
        <main className="app-main">
          <span>Note</span>
        </main>
      </div>
    );
  }
}

export default Note;
import React, { Component } from 'react';
import Titlebar from '../Titlebar';
import NotesAPI from '../../api/notes.api';
import NotesListItem from './NotesListItem';
import './NotesList.css';

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  async componentDidMount() {
    try {
      const res = await NotesAPI.list();
      this.setState({
        notes: res.data.data.notes
      });
    } catch (err) {
      console.log(err.response);
    }
  }
  
  render() {
    return (
      <div className="app-outer">
        <Titlebar />
        <main className="app-main">
          <div className="notes-list">
            {this.state.notes.map(note =>
              <NotesListItem
                key={note._id}
                note={note} />
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default NotesList;
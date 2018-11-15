import React, { Component } from 'react';
import Titlebar from '../Titlebar';
import NotesAPI from '../../api/notes.api';
import NotesListItem from './NotesListItem';
import AuthContext from '../../contexts/AuthContext';
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
      if (typeof (err.response.status) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }
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

NotesList.contextType = AuthContext;

export default NotesList;
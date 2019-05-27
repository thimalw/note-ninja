import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
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
    const notes = await this.loadNotes();
    this.setState({
      notes
    });
  }

  loadNotes = async () => {
    try {
      const res = await NotesAPI.list();
      const notes = res.data.data.notes;
      await notes.map(async note => {
        note.title = await CryptoJS.AES.decrypt(note.title, this.context.key).toString(CryptoJS.enc.Utf8);
        note.excerpt = await CryptoJS.AES.decrypt(note.excerpt, this.context.key).toString(CryptoJS.enc.Utf8);

        return note;
      });

      return notes;
    } catch (err) {
      if (typeof (err.response.status) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }
      console.log(err); // TODO
    }
  };
  
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

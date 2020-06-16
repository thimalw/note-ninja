import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CryptoJS from 'crypto-js';
import Titlebar from '../Titlebar';
import NotesAPI from '../../api/notes.api';
import NotesListItem from './NotesListItem';
import AuthContext from '../../contexts/AuthContext';
import typewriterImg from '../../assets/img/typewriter.svg';
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

  handleNoteCreate = async () => {
    try {
      const res = await NotesAPI.add({
        title: '',
        body: ''
      });
      const note = res.data.data.note;
      this.props.history.push(`/notes/${note._id}`);
    } catch (err) {
      console.log(err);
      if (typeof (err.response) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }
    }
  };
  
  render() {
    return (
      <div className="app-outer">
        <Titlebar />
        <main className="app-main">
          {this.state.notes.length > 0 &&
            <div className="notes-list">
              {this.state.notes.map(note =>
                <NotesListItem
                  key={note._id}
                  note={note} />
              )}
            </div>
          }

          {this.state.notes.length <= 0 &&
            <div className="notes-list-empty">
              <img src={typewriterImg} alt="" />
              <p className="notes-list-empty-message">Looks like you don't have any notes yet. Why not create one now?</p>
              <button
                className="btn btn-primary btn-icon-left"
                onClick={this.handleNoteCreate}
              >
                <FontAwesomeIcon icon="plus" />
                New Note
              </button>
            </div>
          }
        </main>
      </div>
    );
  }
}

NotesList.contextType = AuthContext;

export default NotesList;

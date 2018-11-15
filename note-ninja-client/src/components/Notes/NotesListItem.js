import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NotesListItem.css';

class NotesListItem extends Component {
  render() {
    const note = this.props.note;
    return (
        <Link
          to={`/notes/${note._id}`}
          className="notes-list-item"
        >
          <div className="note-title">
            {note.title}
          </div>
          <div className="note-body">
            This is the excerpt from the note...
          </div>
        </Link>
    );
  }
}

export default NotesListItem;
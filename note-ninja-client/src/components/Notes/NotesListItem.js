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
          {note.title.trim() !== '' &&
            <div className="note-title">
              {note.title}
            </div>
          }
          <pre className="note-body">
            {note.excerpt}
          </pre>
        </Link>
    );
  }
}

export default NotesListItem;
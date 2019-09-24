import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NotesListItem.css';

class NotesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: this.props.note
    }
  }

  render() {
    return (
        <Link
          to={`/notes/${this.state.note._id}`}
          className="notes-list-item"
        >
          {this.state.note.title.trim() !== '' &&
            <div className="note-title">
              {this.state.note.title}
            </div>
          }
          {this.state.note.title.trim() == '' && this.state.note.excerpt.trim() == '' &&
            <div className="note-title note-title-empty">
              Untitled
            </div>
          }
          <div
            className="note-body"
            dangerouslySetInnerHTML={{ __html: this.state.note.excerpt }}
          >
          </div>
        </Link>
    );
  }
}

export default NotesListItem;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContentEditable from 'react-contenteditable';
import CryptoJS from 'crypto-js';
import EditorButton from './EditorButton';
import NotesAPI from '../../api/notes.api';
import Titlebar from '../Titlebar';
import AuthContext from '../../contexts/AuthContext';
import './Note.css';

class Note extends Component {
  constructor(props) {
    super(props);

    this.contentEditable = React.createRef();

    this.state = {
      note: {
        _id: this.props.match.params.id,
        title: '',
        body: '',
        excerpt: ''
      },
      plainText: '',
      saved: 1
    };
  }

  async componentDidMount() {
    this.mounted = true;
    this.timer = setInterval(() => {
      if (this.state.saved !== 1) {
        this.setState({
          saved: 2
        }, () => {
          this.updateRemote();
        });
      }
    }, 8000);
    
    try {
      const res = await NotesAPI.get(this.props.match.params.id);
      const note = res.data.data.note;
      note.title = await CryptoJS.AES.decrypt(note.title, this.context.key).toString(CryptoJS.enc.Utf8);
      note.body = await CryptoJS.AES.decrypt(note.body, this.context.key).toString(CryptoJS.enc.Utf8);
      note.excerpt = await CryptoJS.AES.decrypt(note.excerpt, this.context.key).toString(CryptoJS.enc.Utf8);

      this.setState({
        note
      });
    } catch (err) {
      if (typeof(err.response) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }

      console.log(err);
    }
  }

  async componentWillUnmount() {
    clearInterval(this.timer);
    this.mounted = false;
    await this.updateRemote();
  }

  handleTitleChange = e => {
    const title = e.target.value;
    this.setState(state => ({
      note: {
        ...state.note,
        title
      },
      saved: 0
    }));
  };

  handleBodyChange = e => {
    const body = e.target.value;
    const plainText = (new DOMParser()).parseFromString(body, "text/html").documentElement.textContent;
    this.setState(state => ({
      note: {
        ...state.note,
        body
      },
      plainText,
      saved: 0
    }));
  };

  updateRemote = async () => {
    if (typeof(this.state.saved) === 'undefined' || this.state.saved === 1) {
      if (this.mounted) {
        this.setState({
          saved: 1
        })
      }

      return true;
    }

    // generate note excerpt
    let excerpt;
    if (this.state.plainText.length > 100) {
      excerpt = this.state.plainText.substring(0, 97) + '...';
    } else {
      excerpt = this.state.plainText;
    }

    // encrypt note title, body and excerpt
    const title_e = await CryptoJS.AES.encrypt(this.state.note.title, this.context.key).toString();
    const body_e = await CryptoJS.AES.encrypt(this.state.note.body, this.context.key).toString();
    const excerpt_e = await CryptoJS.AES.encrypt(excerpt, this.context.key).toString();

    // create final note object for posting
    const note_e = {
      ...this.state.note,
      title: title_e,
      body: body_e,
      excerpt: excerpt_e
    };

    // try and submit the encrypted note
    try {
      await NotesAPI.update(
        this.state.note._id,
        note_e
      );

      if (this.mounted) {
        this.setState({
          saved: 1
        });
      }
    } catch (err) {
      if (typeof (err.response) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }

      if (this.mounted) {
        this.setState({
          saved: -1
        });
      }

      console.log(err.response); // TODO
    }
  };

  handleNoteDelete = async () => {
    try {
      await NotesAPI.remove(this.state.note._id);
      this.props.history.push('/');
    } catch (err) {
      console.log(err); // TODO
      if (typeof(err.response) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }
    }
  };

  switchSaveIndicator = () => {
    switch (this.state.saved) {
      case 0:
        return <button className="btn btn-link" onClick={this.updateRemote}>Save</button>
      case 1:
        return <span>Saved</span>
      case 2:
        return <span>Saving...</span>
      case -1:
      default:
        return <span>Error</span>
    }
  };
  
  render() {    
    return (
      <div className="app-outer">
        <Titlebar>
          <Link
            className="btn btn-secondary btn-icon-left"
            to="/"
          >
            <FontAwesomeIcon icon="chevron-left" />
            Back
          </Link>
          <button
            className="btn btn-danger"
            onClick={this.handleNoteDelete}
          >
            <FontAwesomeIcon icon="trash-alt" />
          </button>
          <span className="save-indicator">
            {this.switchSaveIndicator()}
          </span>
        </Titlebar>
        <main className="app-main">
          <div className="note-editor">
            <div className="container container-text note-editor-inner">
              <div className="note-title-outer RichEditor-root">
                <input
                  className="note-title"
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={this.state.note.title}
                  onChange={this.handleTitleChange}
                />
              </div>
              <div>
                <ContentEditable
                  className="note-body"
                  innerRef={this.contentEditable}
                  html={this.state.note.body}
                  disabled={false}
                  onChange={this.handleBodyChange}
                  tagName="div"
                  placeholder="Type here..."
                />
              </div>
            </div>
            <div className="note-toolbar">
              <div className="container container-text note-toolbar-inner">
                <div className="toolbar-row">
                  <EditorButton
                    command="formatBlock"
                    blockStyle="h2"
                    icon="heading"
                  />
                  <EditorButton
                    command="formatBlock"
                    blockStyle="p"
                    icon="paragraph"
                  />
                  <div className="toolbar-sep"></div>
                  <EditorButton
                    command="bold"
                    icon="bold"
                  />
                  <EditorButton
                    command="italic"
                    icon="italic"
                  />
                  <EditorButton
                    command="underline"
                    icon="underline"
                  />
                  <div className="toolbar-sep"></div>
                  <button
                    className="btn toolbar-command"
                    value="unordered-list-item"
                    onMouseDown={this.handleBlockStyle}>
                    <FontAwesomeIcon icon="list-ul" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="ordered-list-item"
                    onMouseDown={this.handleBlockStyle}>
                    <FontAwesomeIcon icon="list-ol" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

Note.contextType = AuthContext;

export default Note;

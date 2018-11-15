import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'draft-js/dist/Draft.css';
import NotesAPI from '../../api/notes.api';
import Titlebar from '../Titlebar';
import AuthContext from '../../contexts/AuthContext';
import './Note.css';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note: {
        _id: this.props.match.params.id,
        title: '',
        body: ''
      },
      saved: 1,
      editorState: EditorState.createEmpty()
    };

    this.onChange = (editorState) => {
      const contentState = editorState.getCurrentContent();
      this.handleContentChange(contentState);
      this.setState({ editorState });
    };
  }

  async componentDidMount() {
    this.timer = setInterval(() => this.updateRemote(), 2500);
    this.mounted = true;
    
    try {
      const res = await NotesAPI.get(this.props.match.params.id);
      const note = res.data.data.note;

      if (note.body !== '') {
        var editorState = null;
        const contentState = convertFromRaw(JSON.parse(note.body));
        editorState = EditorState.createWithContent(contentState);
        this.setState({
          note,
          editorState
        });
      }
    } catch (err) {
      if (typeof(err.response) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }

      console.log(err);
    }
  }

  componentWillUnmount() {
    this.timer = null;
    this.mounted = false;
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    } else {
      return 'not-handled';
    }
  };

  handleBlockStyle = (e) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, e.target.value));
  };

  handleInlineStyle = (e) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.value));
  };

  handleContentChange = (contentState) => {
    const contentStateRaw = convertToRaw(contentState);
    this.setState(state => ({
      note: {
        ...state.note,
        body: JSON.stringify(contentStateRaw)
      },
      saved: 0
    }), () => {
      // this.updateRemote();
    });
  };

  handleTitleChange = (e) => {
    const title = e.target.value;
    this.setState(state => ({
      note: {
        ...state.note,
        title: title,
      },
      saved: 0
    }), () => {
      // this.updateRemote();
    });
  };
  
  updateRemote = () => {
    if (!this.state.saved && this.mounted) {
      this.setState({
        saved: 2
      }, async () => {
        try {
          const res = await NotesAPI.update(
            this.state.note._id,
            this.state.note.title,
            this.state.note.body
          );
          if (this.mounted) {
            this.setState({
              saved: 1
            });
          }
          console.log(res);
        } catch (err) {
          if (typeof(err.response) !== 'undefined'
            && err.response.status === 401) {
            this.context.logout();
          }
          console.log(err.response);
        }
      });
    }
  };

  handleNoteDelete = async () => {
    try {
      await NotesAPI.remove(this.state.note._id);
      this.props.history.push('/');
    } catch (err) {
      console.log(err);
      if (typeof(err.response) !== 'undefined'
        && err.response.status === 401) {
        this.context.logout();
      }
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
          {this.state.saved}
        </Titlebar>
        <main className="app-main">
          <div className="note-editor">
            <div className="container container-text note-editor-inner">
              <div className="note-title-outer">
                <input
                  className="note-title"
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={this.state.note.title}
                  onChange={this.handleTitleChange}
                />
              </div>
              <Editor
                className="note-body"
                placeholder="Type here..."
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
              />
            </div>
            <div className="note-toolbar">
              <div className="container container-text note-toolbar-inner">
                <div className="toolbar-row">
                  <button
                    className="btn toolbar-command"
                    value="header-two"
                    onClick={this.handleBlockStyle}>
                    <FontAwesomeIcon icon="heading" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="paragraph"
                    onClick={this.handleBlockStyle}>
                    <FontAwesomeIcon icon="paragraph" />
                  </button>
                  <div className="toolbar-sep"></div>
                  <button
                    className="btn toolbar-command"
                    value="BOLD"
                    onClick={this.handleInlineStyle}>
                    <FontAwesomeIcon icon="bold" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="ITALIC"
                    onClick={this.handleInlineStyle}>
                    <FontAwesomeIcon icon="italic" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="UNDERLINE"
                    onClick={this.handleInlineStyle}>
                    <FontAwesomeIcon icon="underline" />
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
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
        body: '',
        excerpt: ''
      },
      saved: 1,
      editorState: EditorState.createEmpty()
    };

    this.focus = () => this.refs.editor.focus();

    this.onChange = (editorState) => {
      const contentState = editorState.getCurrentContent();
      this.handleContentChange(contentState);
      this.setState({ editorState });
    };
  }

  async componentDidMount() {
    this.timer = setInterval(() => this.updateRemote(), 3000);
    this.mounted = true;
    
    try {
      const res = await NotesAPI.get(this.props.match.params.id);
      const note = res.data.data.note;

      this.setState({
        note
      });

      if (note.body !== '') {
        var editorState = null;
        const contentState = convertFromRaw(JSON.parse(note.body));
        editorState = EditorState.createWithContent(contentState);
        this.setState({
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
      return true;
    } else {
      return false;
    }
  };

  onTab = (e) => {
    e.preventDefault();
    const newEditorState = RichUtils.onTab(
      e,
      this.state.editorState,
      4, /* maxDepth */
    );
    if (newEditorState !== this.state.editorState) {
      this.onChange(newEditorState);
    }
  };

  handleBlockStyle = e => {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, e.target.value));
  };

  handleInlineStyle = e => {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.value));
  };

  handleContentChange = (contentState) => {
    const plainText = contentState.getPlainText();
    const excerpt = plainText.length > 100 ? plainText.substring(0, 97).trim() + "..." : plainText;
    const contentStateRaw = convertToRaw(contentState);
    this.setState(state => ({
      note: {
        ...state.note,
        body: JSON.stringify(contentStateRaw),
        excerpt
      },
      saved: 0
    }), () => {
      // this.updateRemote();
    });
  };

  handleTitleChange = e => {
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
            this.state.note
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
          if (this.mounted) {
            this.setState({
              saved: -1
            });
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

  switchSaveIndicator = () => {
    switch (this.state.saved) {
      case 0:
        return <button className="btn btn-link" onClick={this.updateRemote}>Save</button>
      case 1:
        return <span>Saved</span>
      case 2:
        return <span>Saving...</span>
      case -1:
        return <span>Error</span>
      default:
        return <span>Error</span>
    }
  };
  
  render() {
    let className = 'note-editor-wrap';
    var contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' hide-placeholder';
      }
    }
    
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
              <div
                className={className}
                onClick={this.focus}
              >
                <Editor
                  className="note-body"
                  placeholder="Type here..."
                  editorState={this.state.editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onTab={this.onTab}
                  onChange={this.onChange}
                  ref="editor"
                  spellCheck={true}
                />
              </div>
            </div>
            <div className="note-toolbar">
              <div className="container container-text note-toolbar-inner">
                <div className="toolbar-row">
                  <button
                    className="btn toolbar-command"
                    value="header-two"
                    onMouseDown={this.handleBlockStyle}>
                    <FontAwesomeIcon icon="heading" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="paragraph"
                    onMouseDown={this.handleBlockStyle}>
                    <FontAwesomeIcon icon="paragraph" />
                  </button>
                  <div className="toolbar-sep"></div>
                  <button
                    className="btn toolbar-command"
                    value="BOLD"
                    onMouseDown={this.handleInlineStyle}>
                    <FontAwesomeIcon icon="bold" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="ITALIC"
                    onMouseDown={this.handleInlineStyle}>
                    <FontAwesomeIcon icon="italic" />
                  </button>
                  <button
                    className="btn toolbar-command"
                    value="UNDERLINE"
                    onMouseDown={this.handleInlineStyle}>
                    <FontAwesomeIcon icon="underline" />
                  </button>
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
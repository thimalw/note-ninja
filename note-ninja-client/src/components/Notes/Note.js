import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContentEditable from 'react-contenteditable';
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
      saved: 1
    };
  }

  async componentDidMount() {
    this.mounted = true;
    this.timer = setInterval(() => {
      this.setState({
        saved: 2
      }, () => {
        const updated = this.updateRemote();
        if (updated) {
          this.setState({
            saved: 1
          });
        }
      });
    }, 2500);
    
    try {
      const res = await NotesAPI.get(this.props.match.params.id);
      const note = res.data.data.note;

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
    this.timer = null;
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
    this.setState(state => ({
      note: {
        ...state.note,
        body
      },
      saved: 0
    }));
  };

  handleEditorButton = e => {
    const control = e.target;
    console.log(control.getAttribute('data-command'));
  };

  updateRemote = async () => {
    if (this.state.saved) {
      return true;
    }

    let excerpt;
    if (this.state.note.body.length > 100) {
      excerpt = this.state.note.body.substring(0, 97) + '...';
    } else {
      excerpt = this.state.note.body;
    }

    const _note = {
      ...this.state.note,
      excerpt
    };

    if (this.mounted) {
      this.setState(state => ({
        note: {
          ...state.note,
          excerpt
        }
      }));
    }

    try {
      await NotesAPI.update(
        this.state.note._id,
        _note
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
      console.log(err.response);
    }
  };
  
  // _updateRemote = async () => {
  //   if (!this.state.saved) {
  //     this.setState(state => {
  //       let excerpt;
  //       if (state.note.body.length > 100) {
  //         excerpt = state.note.body.substring(0, 97) + '...';
  //       } else {
  //         excerpt = state.note.body;
  //       }
        
  //       return {
  //         note: {
  //           ...state.note,
  //           excerpt
  //         },
  //         saved: 2
  //       };
  //     }, async () => {
  //       try {
  //         await NotesAPI.update(
  //           this.state.note._id,
  //           this.state.note
  //         );
  //         if (this.mounted) {
  //           this.setState({
  //             saved: 1
  //           });
  //         }
  //       } catch (err) {
  //         if (typeof(err.response) !== 'undefined'
  //           && err.response.status === 401) {
  //           this.context.logout();
  //         }
  //         if (this.mounted) {
  //           this.setState({
  //             saved: -1
  //           });
  //         }
  //         console.log(err.response);
  //       }
  //     });
  //   }
  // };

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
                {/* <div
                  className="note-body"
                  contentEditable
                  placeholder="Type here..."
                  onInput={this.handleBodyChange}
                  dangerouslySetInnerHTML={{__html: this.state.note.body}}>
                </div> */}
                {/* <ContentEditable
                  tagName="p"
                  className="note-body"
                  content={this.state.note.body}
                  editable={true}
                  multiLine={true}
                  onChange={this.handleBodyChange}
                /> */}
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

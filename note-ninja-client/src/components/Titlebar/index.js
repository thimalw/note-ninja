import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Titlebar.css';
import NotesAPI from '../../api/notes.api';
import { AuthConsumer } from '../../contexts/AuthContext';
import { withRouter } from 'react-router-dom';

class Titlebar extends Component {
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
      if (typeof(err.response) !== 'undefined'
          && err.response.status === 401) {
        this.context.logout();
      }
    }
  };
  
  render() {
    return (
      <div className="titlebar">
        <div className="titlebar-inner">
          <div className="titlebar-left">
            {this.props.children}
          </div>
          <AuthConsumer>
            {({ isLoggedIn, login, logout }) => {
              if (isLoggedIn) {
                return (
                  <div className="titlebar-right">
                    <button
                      className="btn btn-primary btn-icon-left"
                      onClick={this.handleNoteCreate}
                    >
                      <FontAwesomeIcon icon="plus" />
                      New
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={logout}
                    >
                      <FontAwesomeIcon icon="sign-out-alt" />
                    </button>
                  </div>
                );
              } else {
                return (
                  <button
                    className="btn btn-primary btn-icon-left"
                    onClick={login}
                  >
                    <FontAwesomeIcon icon="sign-in-alt" />
                    Log in
                  </button>
                );
              }
            }}
          </AuthConsumer>
        </div>
      </div>
    );
  }
}

export default withRouter(Titlebar);
import React, { Component } from 'react';
import './Titlebar.css';
import { AuthConsumer } from '../../contexts/AuthContext';

class Titlebar extends Component {
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
                      className="btn btn-primary"
                    >
                      New
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={logout}
                    >
                      Log out
                    </button>
                  </div>
                );
              } else {
                return (
                  <button
                    className="btn btn-primary"
                    onClick={login}
                  >
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

export default Titlebar;
import React, { Component } from 'react';
import './Auth.css';
import logoWhite from '../../assets/img/logo_white.svg';

class Auth extends Component {
  render() {
    return (
      <div className="auth-page">
        <div className="auth-page-content">
          <div className="auth-page-container">
            <header className="auth-header">
              <img src={logoWhite} alt="The Note Space" />
              <h1>{this.props.title}</h1>
            </header>          
            {this.props.children}
            <footer className="auth-footer">
              <div className="app-copyright">
                &copy; <a href="https://thimal.me" target="_blank" rel="noopener noreferrer">Thimal Wickremage</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
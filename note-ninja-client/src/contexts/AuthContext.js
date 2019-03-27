import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import AuthAPI from '../api/auth.api';

const AuthContext = React.createContext();
const AuthConsumer = AuthContext.Consumer;

class AuthProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      key: null
    };
  }

  componentDidMount() {
    if (localStorage.getItem('token') === null || localStorage.getItem('key') === null) {
      localStorage.removeItem('token');
      localStorage.removeItem('key');
      this.setState({
        isLoggedIn: false
      });
    } else {
      this.setState({
        isLoggedIn: true,
        key: localStorage.getItem('key')
      });
    }    
  }

  login = async (email, password) => {
    try {
      const res = await AuthAPI.login(email, password);
      const token = res.data.data.token;
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      const _token = JSON.parse(window.atob(base64));

      const key_u = CryptoJS.PBKDF2(password, _token.salt, { keySize: 256 / 32, iterations: 1000 });
      const key = CryptoJS.AES.decrypt(_token.key, key_u.toString()).toString(CryptoJS.enc.Utf8);

      localStorage.setItem('token', token);
      localStorage.setItem('key', key);
      this.setState({
        isLoggedIn: true
      });

      return res;

    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('key');
      this.setState({
        isLoggedIn: false
      });

      throw err;
    }
  };

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('key');
    this.setState({
      isLoggedIn: false
    });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
          key: this.state.key,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContext;
export {
  AuthProvider,
  AuthConsumer
};

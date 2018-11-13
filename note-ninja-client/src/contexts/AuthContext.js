import React, { Component } from 'react';
import AuthAPI from '../api/auth.api';

const AuthContext = React.createContext();
const AuthConsumer = AuthContext.Consumer;

class AuthProvider extends Component {
  constructor(props) {
    super(props);

    const isLoggedIn = localStorage.getItem('jwtToken') === null ? false : true;

    this.state = {
      isLoggedIn: isLoggedIn
    };
  }

  login = async (email, password) => {
    try {
      const resp = await AuthAPI.login(email, password);

      localStorage.setItem('jwtToken', resp.data.data.token);
      this.setState({
        isLoggedIn: true
      });

      return resp;

    } catch (err) {
      localStorage.removeItem('jwtToken');
      this.setState({
        isLoggedIn: false
      });

      throw err;
    }
  };

  logout = () => {
    localStorage.removeItem('jwtToken');
    this.setState({
      isLoggedIn: false
    });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
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
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import CryptoJS from 'crypto-js';
import Auth from './Auth';
import AuthContext, { AuthConsumer } from '../../contexts/AuthContext';
import { Redirect, Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiErrors: []
    };
  }
  
  loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email format is invalid')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  onSubmit = async (values, actions) => {
    let user = {
      ...values
    };

    // const password_p = user.password;
    // user.password = CryptoJS.SHA256(password_p).toString();
    
    try {
      await this.context.login(
        user.email,
        user.password
      );
      
      this.props.history.push('/');
    } catch (err) {
      if (typeof(err.response) !== 'undefined') {
        this.setState({
          apiErrors: [{
            message: err.response.data.message
          }]
        });
      } else {
        this.setState({
          apiErrors: [{
            message: 'Unable to connect. Please try again later.'
          }]
        });
      }
    }
    
    actions.setSubmitting(false);
  }
  
  render() {
    return (
      <AuthConsumer>
        {({ isLoggedIn }) => {
          return isLoggedIn ? (
            <Redirect to="/" />
          ) : (
            <Auth
              title="Log in to continue"
            >
              <Formik
                initialValues={{
                  email: '',
                  password: ''
                }}
                validationSchema={this.loginSchema}
                onSubmit={this.onSubmit}
              >
                {(errors, touched, isSubmitting) => (
                  <Form>
                    {this.state.apiErrors.length > 0 &&
                      <div className="auth-form-error-list">
                        {this.state.apiErrors[0].message}
                      </div>
                    }
                    <div className="auth-form-group">
                      <Field type="email" name="email" placeholder="Email" />
                      <ErrorMessage name="email" component="span" className="auth-form-error" />
                    </div>
                    <div className="auth-form-group">
                      <Field type="password" name="password" placeholder="Password" />
                      <ErrorMessage name="password" component="span" className="auth-form-error" />
                    </div>
                    <div className="auth-form-btn">
                      <button type="submit" className="btn btn-white btn-icon-left" disabled={isSubmitting}>
                        <FontAwesomeIcon icon="sign-in-alt" />
                        Log In
                      </button>
                      <Link to="/signup" className="btn btn-white-secondary btn-icon-left">
                        <FontAwesomeIcon icon="user-plus" />
                        Sign Up
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </Auth>
          );
        }}
      </AuthConsumer>
    );
  }
}

Login.contextType = AuthContext;

export default Login;

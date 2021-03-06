import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import Auth from './Auth';
import AuthAPI from '../../api/auth.api';
import AuthContext, { AuthConsumer } from '../../contexts/AuthContext';
import { Redirect, Link } from 'react-router-dom';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiErrors: [],
      signedUp: false
    };
  }

  signupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long')
      .required('Name is required'),
    email: Yup.string()
      .email('Email format is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Should be at least 8 characters long')
      .required('Password is required'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Doesn\'t match')
      .required('Password confirmation is required')
  });

  onSubmit = async (values, actions) => {
    let user = {
      ...values
    };

    const password_p = user.password;
    const password_h = CryptoJS.SHA256(password_p).toString();

    const key_n = CryptoJS.lib.WordArray.random(16);
    const salt = CryptoJS.lib.WordArray.random(8).toString();
    const key_u = CryptoJS.PBKDF2(password_p, salt, { keySize: 256 / 32, iterations: 1000 });
    const key_n_c = CryptoJS.AES.encrypt(key_n.toString(), key_u.toString()).toString();

    user.password = password_h;
    user.passwordConfirm = password_h;
    user.key = key_n_c;
    user.salt = salt;
    
    try {
      await AuthAPI.signup(user);

      try {
        await this.context.login(
          user.email,
          password_p
        );
        this.props.history.push('/');
      } catch (err) {
        this.setState({
          signedUp: true
        });
      }
    } catch (err) {
      if (typeof (err.response) !== 'undefined') {
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
                title="Sign up!"
              >
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: ''
                  }}
                  validationSchema={this.signupSchema}
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
                        <Field type="text" name="name" placeholder="Name" />
                        <ErrorMessage name="name" component="span" className="auth-form-error" />
                      </div>
                      <div className="auth-form-group">
                        <Field type="email" name="email" placeholder="Email" />
                        <ErrorMessage name="email" component="span" className="auth-form-error" />
                      </div>
                      <div className="auth-form-group">
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="span" className="auth-form-error" />
                      </div>
                      <div className="auth-form-group">
                        <Field type="password" name="passwordConfirm" placeholder="Password Confirmation" />
                        <ErrorMessage name="passwordConfirm" component="span" className="auth-form-error" />
                      </div>
                      <div className="auth-form-btn">
                        <button type="submit" className="btn btn-white btn-icon-left" disabled={isSubmitting}>
                          <FontAwesomeIcon icon="user-plus" />
                          Sign Up
                        </button>
                        <Link to="/login" className="btn btn-white-secondary btn-icon-left">
                          <FontAwesomeIcon icon="sign-in-alt" />
                          Log In
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

Signup.contextType = AuthContext;

export default Signup;

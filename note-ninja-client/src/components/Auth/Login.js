import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
    try {
      await this.context.login(
        values.email,
        values.password
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
    
    console.log(values);
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
                      <button type="submit" className="btn btn-white" disabled={isSubmitting}>Log In</button>
                      <Link to="/signup" className="btn btn-white-secondary">Sign Up</Link>
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
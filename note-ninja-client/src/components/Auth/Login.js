import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Auth from './Auth';

class Login extends Component {
  loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email format is invalid')
      .required('Required'),
    password: Yup.string()
      .required('Password is required')
  });
  
  render() {
    return (
      <Auth
        title="Log in to continue"
      >
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={this.loginSchema}
        >
          {(errors, touched, isSubmitting) => (
            <Form>
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
                <button className="btn btn-white-secondary">Sign Up</button>
              </div>
            </Form>
          )}
        </Formik>
      </Auth>
    );
  }
}

export default Login;
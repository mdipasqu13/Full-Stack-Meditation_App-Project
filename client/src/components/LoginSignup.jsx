import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./LoginSignup.css";
import { useNavigate } from 'react-router-dom';

// Validation schemas for user, login, and signup forms
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

// Main component for login and signup functionality
const LoginSignup = ({ updateUser, user }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const url = isSignup ? 'http://localhost:5555/users' : 'http://localhost:5555/login';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.email.toLowerCase(),
        password: values.password,
      }),
    })
      .then(response => {
        if (response.status === 200 || 201) {
          return response.json();
        } else {
          throw new Error('Invalid credentials');
        }
      })
      .then(data => {
        updateUser(data);
        localStorage.setItem('user', JSON.stringify(data.id));
        navigate('/', { relative: 'path' });
      })
      .catch(error => {
        setError(error.message);
        setSubmitting(false);
        resetForm();
      });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      updateUser(JSON.parse(storedUser));
    }
  }, [updateUser]);

  return (
    <div className="container">
      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? 'Login' : 'Signup'}
      </button>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={isSignup ? SignupSchema : LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input">
              <Field name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="input">
              <Field name="password" type="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" className="submit" disabled={isSubmitting}>
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
            {isSubmitting && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
          </Form>
        )}
      </Formik>

    </div>
  );
};

export default LoginSignup;

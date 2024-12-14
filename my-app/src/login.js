import './login.css';
import React, { useState } from 'react';
import axios from 'axios';

function Login({ navigateTo, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:555/user/login', { email, password });
      console.log('Login successful:', response.data); // Log the response for debugging
      onLoginSuccess(); // Notify App that login was successful
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : 'Error logging in');
      console.log('Error during login:', error); // Log the error for debugging
    }
  };

  return (
    <div className="App">
      <div className="title">Scented Secrets</div>
      <div className="login-container">
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="text">
          Don't have an account?{' '}
          <button
            onClick={(e) => {
              e.preventDefault();
              navigateTo('signup'); // Switch to the signup page
            }}
            className="link"
          >
            Sign-up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
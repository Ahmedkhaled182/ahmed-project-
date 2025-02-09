import React, { useState } from 'react';
import './login.css';

function Login({ navigateTo, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:555/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 🔥 Ensures cookies (authToken) are sent & stored
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error logging in');
      }

      const data = await response.json();
      
      // ✅ Store authentication flag & admin status
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');

      // 🔥 Debugging - Check if cookies are stored
      console.log('Login Successful - Cookies should be set');

      // ✅ Call success callback & navigate home
      onLoginSuccess();
      navigateTo('home');
    } catch (error) {
      console.error('Login Error:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="App">
      <div className="title">Scented Secrets</div>
      <div className="login-container">
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(input) => setEmail(input.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(input) => setPassword(input.target.value)}
            required
          />
        </div>
        <button className="login-button" onClick={handleSubmit}>
          Login
        </button>
        <p className="text">
          Don't have an account?{' '}
          <button className="link" onClick={() => navigateTo('signup')}>
            Sign-up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

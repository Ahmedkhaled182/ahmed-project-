import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';

function SignUp({ navigateTo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:555/user/register', formData);
      console.log('Registration successful');
      navigateTo('login'); // Redirect to login page after signup
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : 'Error registering');
      console.log('Error during signup:', error);
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
      <p className="text">
        Already have an account?{' '}
        <button
          onClick={(e) => {
            e.preventDefault();
            navigateTo('login'); // Switch to the login page
          }}
          className="link"
        >
          Go to Login
        </button>
      </p>
    </div>
  );
}

export default SignUp;

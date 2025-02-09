import React, { useState } from 'react';
import './signup.css';

function SignUp({ navigateTo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (input) => {
    setFormData({
      ...formData,
      [input.target.name]: input.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:555/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigateTo('login');
      } else {
        const errorData = await response.text();
        setErrorMessage(errorData || 'Error registering');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage('Error registering');
    }
  };


  return (
    <div className="sign-up-container">
      <h2>Sign Up</h2>
      <div className="sign-up-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Sign Up
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
      <p className="text">
        Already have an account?{' '}
        <button className="link" onClick={() => navigateTo('login')}>
          Go to Login
        </button>
      </p>
    </div>
  );
}

export default SignUp;

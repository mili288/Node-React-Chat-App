import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      const token = response.data.token;
      const username = response.data.user.username;
      const userId = response.data.user._id; // Get user ID from server response
      localStorage.setItem('token', token); // Save token to local storage
      localStorage.setItem('userId', userId); // Save user ID to local storage
      localStorage.setItem('username', username); // Save user Username to local storage
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder='Email'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder='Password'
            className="input-field"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={{ marginBottom: '20px' }} type="submit">Login</button>
          <br />
          <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
          <div style={{ marginTop: '20px' }}>
            <a className="forgot-password-link" href="/signup">Don't have an account? then Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

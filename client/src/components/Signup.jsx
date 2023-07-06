import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/users', { name, email, username, password });
      alert('User created!');
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="nav-links">
      </div>
      <div className="signup-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='Name'
            className="input-field"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            placeholder='Email'
            className="input-field"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder='Username'
            className="input-field"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <br />
          <button className="submit-btn" type="submit">Create User</button>
          <div style={{ marginTop: '20px' }}>
            <a className="forgot-password-link" href="/login">Already have an account? then Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

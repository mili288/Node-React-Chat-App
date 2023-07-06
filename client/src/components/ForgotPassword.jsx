import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./Lobby.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            className="input-field1"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Send password reset email</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://randomgamesserver.onrender.com/users/reset-password/${token}`, { password });
      if (response && response.data) {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            className="input-field1"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Reset password</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export { ForgotPassword, ResetPassword };

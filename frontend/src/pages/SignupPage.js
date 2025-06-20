// frontend/src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup as apiSignup } from '../api/signup';
import { useAuth } from '../contexts/AuthContext';
import '../styles/SignupPage.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // we’ll reuse AuthContext

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const data = await apiSignup({ name, email, password });
      // data: { user, token }
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Optionally store token
      localStorage.setItem('token', data.token);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        {error && <div className="error">{error}</div>}

        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </label>

        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

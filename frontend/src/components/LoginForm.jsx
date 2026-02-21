import React, { useState } from 'react';
import { validateEmail } from '../utils/validators';

const LoginForm = ({ onSubmit, isLoading = false, error = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate email
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email');
      return;
    }

    // Validate password
    if (!password) {
      setFormError('Password is required');
      return;
    }

    // Call parent's onSubmit
    await onSubmit(email, password);
  };

  const displayError = formError || error;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '0.95em',
          fontWeight: '500',
          color: '#333'
        }}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="principal@college.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'auto'
          }}
        />
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '0.95em',
          fontWeight: '500',
          color: '#333'
        }}>
          Password
        </label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'auto'
          }}
        />
      </div>

      {displayError && (
        <div style={{
          color: '#666',
          marginBottom: '20px',
          padding: '12px',
          background: '#f0f0f0',
          borderRadius: '8px',
          fontSize: '0.95em',
          border: '1px solid #e0e0e0'
        }}>
          {displayError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          background: isLoading ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.3s ease',
          fontFamily: 'inherit'
        }}
        onMouseOver={(e) => {
          if (!isLoading) {
            e.target.style.background = '#1d4ed8';
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading) {
            e.target.style.background = '#2563eb';
          }
        }}
      >
        {isLoading ? '⏳ Logging in...' : '🔐 Login'}
      </button>
    </form>
  );
};

export default LoginForm;

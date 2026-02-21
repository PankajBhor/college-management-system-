import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { loginUser, getBackdoorUser } from '../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle backdoor login via URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get('user');

    if (urlUser) {
      const backdoorUser = getBackdoorUser(urlUser);
      if (backdoorUser) {
        onLoginSuccess(backdoorUser);
        console.log('🚀 URL BACKDOOR:', backdoorUser.name);
      }
    }
  }, [onLoginSuccess]);

  // Handle backdoor login via keyboard shortcut (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        const backdoorUsers = {
          'principal': { name: 'Dr. Pankaj Sharma', role: 'PRINCIPAL' },
          'office': { name: 'Priya Office', role: 'OFFICE_STAFF' },
          'enquiry': { name: 'Rahul Enquiry', role: 'ENQUIRY_STAFF' },
          'faculty': { name: 'Prof. Anita', role: 'FACULTY' },
          'hod': { name: 'Dr. Rajesh HOD', role: 'HOD' }
        };
        const keys = Object.keys(backdoorUsers);
        const randomUser = backdoorUsers[keys[Math.floor(Math.random() * keys.length)]];
        onLoginSuccess(randomUser);
        console.log('⌨️ KEYBOARD BACKDOOR:', randomUser.name);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onLoginSuccess]);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError('');

    try {
      const user = await loginUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '1.8em'
        }}>
          🔐 College Login
        </h1>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          <p style={{ marginBottom: '15px', fontWeight: '600' }}>Test Accounts:</p>
          <div style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '0.9em',
            lineHeight: '1.6'
          }}>
            <p>📧 principal@college.com</p>
            <p>📧 office@college.com</p>
            <p>📧 enquiry@college.com</p>
            <p>📧 faculty@college.com</p>
            <p>📧 hod@college.com</p>
            <p style={{ marginTop: '10px', fontWeight: '500' }}>🔑 All passwords: <code>password</code></p>
          </div>

          <div style={{
            background: '#fff3cd',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85em',
            color: '#856404',
            border: '1px solid #ffc107'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>⚡ Quick Login:</p>
            <p style={{ margin: '0 0 5px 0' }}>URL: <code>?user=principal</code></p>
            <p style={{ margin: 0 }}>Keyboard: <code>Ctrl+Shift+L</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

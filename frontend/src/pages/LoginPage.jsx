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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fa',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        padding: '50px 40px',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏫</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 10px 0',
            color: '#1a1a1a'
          }}>
            Jaihind College
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            fontWeight: '500'
          }}>
            Faculty Management System
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: '0 0 10px 0'
          }}>
            Sign In
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            fontWeight: '500'
          }}>
            Enter your credentials to access your dashboard
          </p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e8e8e8' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: '0 0 20px 0'
          }}>
            📋 Demo Credentials:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px'
          }}>
            {Object.entries({
              'Principal': { email: 'principal@college.com', pass: 'password', desc: 'Full system access' },
              'Office Staff': { email: 'office@college.com', pass: 'password', desc: 'Student & fees management' },
              'Enquiry Staff': { email: 'enquiry@college.com', pass: 'password', desc: 'Manage inquiries' },
              'Faculty': { email: 'faculty@college.com', pass: 'password', desc: 'View courses & students' },
              'HOD': { email: 'hod@college.com', pass: 'password', desc: 'Department management' }
            }).map(([role, { email, pass, desc }]) => (
              <div key={role} style={{
                padding: '14px',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: '1px solid #e8e8e8'
              }}>
                <div style={{
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '4px',
                  fontSize: '13px'
                }}>
                  {role}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px',
                  fontFamily: 'monospace',
                  background: 'white',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  {email} / {pass}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  fontStyle: 'italic'
                }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

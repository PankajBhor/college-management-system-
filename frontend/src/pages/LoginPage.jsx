import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { loginUser, getBackdoorUser } from '../services/authService';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/designSystem';

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
      background: `linear-gradient(135deg, ${COLORS.backgroundTertiary} 0%, ${COLORS.backgroundSecondary} 100%)`,
      padding: SPACING['2xl'],
      fontFamily: TYPOGRAPHY.fontFamily
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        boxShadow: SHADOWS.xl,
        padding: SPACING['4xl'],
        border: `1px solid ${COLORS.border}`
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: SPACING['4xl'], textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: SPACING.lg }}>🏫</div>
          <h1 style={{
            fontSize: TYPOGRAPHY.fontSize['3xl'],
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            margin: `0 0 ${SPACING.sm} 0`,
            color: COLORS.text
          }}>
            Jaihind College
          </h1>
          <p style={{
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: COLORS.textSecondary,
            margin: 0,
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}>
            Management Information System
          </p>
        </div>

        {/* Sign In Section */}
        <div style={{ marginBottom: SPACING['3xl'] }}>
          <h2 style={{
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: COLORS.text,
            margin: `0 0 ${SPACING.md} 0`
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: COLORS.textSecondary,
            margin: 0,
            fontWeight: TYPOGRAPHY.fontWeight.normal
          }}>
            Sign in to access your dashboard
          </p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        {/* Demo Credentials Section */}
        <div style={{ marginTop: SPACING['4xl'], paddingTop: SPACING['2xl'], borderTop: `1px solid ${COLORS.border}` }}>
          <p style={{
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: COLORS.text,
            margin: `0 0 ${SPACING.lg} 0`
          }}>
            📋 Demo Accounts
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: SPACING.md
          }}>
            {Object.entries({
              'Principal': { email: 'principal@college.com', pass: 'password', desc: 'Full system access' },
              'Office Staff': { email: 'office@college.com', pass: 'password', desc: 'Student & fees management' },
              'Enquiry Staff': { email: 'enquiry@college.com', pass: 'password', desc: 'Manage inquiries' },
              'Faculty': { email: 'faculty@college.com', pass: 'password', desc: 'View courses & students' },
              'HOD': { email: 'hod@college.com', pass: 'password', desc: 'Department management' }
            }).map(([role, { email, pass, desc }]) => (
              <div key={role} style={{
                padding: SPACING.md,
                background: COLORS.backgroundSecondary,
                borderRadius: BORDER_RADIUS.base,
                border: `1px solid ${COLORS.border}`
              }}>
                <div style={{
                  fontWeight: TYPOGRAPHY.fontWeight.semibold,
                  color: COLORS.text,
                  marginBottom: SPACING.xs,
                  fontSize: TYPOGRAPHY.fontSize.sm
                }}>
                  {role}
                </div>
                <div style={{
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  color: COLORS.textSecondary,
                  marginBottom: SPACING.xs,
                  fontFamily: 'Menlo, monospace',
                  background: COLORS.background,
                  padding: SPACING.sm,
                  borderRadius: BORDER_RADIUS.base,
                  border: `1px solid ${COLORS.border}`
                }}>
                  {email} / {pass}
                </div>
                <div style={{
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  color: COLORS.textTertiary,
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

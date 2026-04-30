import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { loginUser } from '../services/authService';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/designSystem';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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


      </div>
    </div>
  );
};

export default LoginPage;

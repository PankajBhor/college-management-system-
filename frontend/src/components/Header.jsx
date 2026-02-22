import React from 'react';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/designSystem';

const Header = ({ user, onLogout }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: COLORS.background,
      padding: `${SPACING.lg} ${SPACING['2xl']}`,
      color: COLORS.text,
      zIndex: 999,
      boxShadow: SHADOWS.md,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${COLORS.border}`,
      fontFamily: TYPOGRAPHY.fontFamily
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: TYPOGRAPHY.fontSize.xl,
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          color: COLORS.text
        }}>
          🏫 College Management System
        </h1>
      </div>

      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING['2xl']
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              color: COLORS.text
            }}>
              👋 {user.name}
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.fontSize.xs,
              opacity: 0.7,
              padding: `${SPACING.xs} ${SPACING.md}`,
              background: COLORS.backgroundTertiary,
              borderRadius: BORDER_RADIUS.full,
              marginTop: SPACING.xs,
              color: COLORS.textSecondary,
              fontWeight: TYPOGRAPHY.fontWeight.medium
            }}>
              {user.role}
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: `${SPACING.sm} ${SPACING.lg}`,
              background: COLORS.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: BORDER_RADIUS.base,
              cursor: 'pointer',
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              transition: `all ${0.2}s ease`,
              fontFamily: TYPOGRAPHY.fontFamily
            }}
            onMouseOver={(e) => {
              e.target.style.background = COLORS.primaryHover;
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = SHADOWS.md;
            }}
            onMouseOut={(e) => {
              e.target.style.background = COLORS.primary;
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;

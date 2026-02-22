// Professional Design System for College Management System
export const COLORS = {
  // Primary Colors - Professional Blue
  primary: '#1e40af',
  primaryHover: '#1e3a8a',
  primaryLight: '#3b82f6',
  primaryLighter: '#dbeafe',
  
  // Neutral Colors
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  backgroundTertiary: '#f3f4f6',
  border: '#e5e7eb',
  borderDark: '#d1d5db',
  text: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  
  // Status Colors
  success: '#059669',
  successLight: '#d1fae5',
  warning: '#d97706',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  info: '#0891b2',
  infoLight: '#cffafe',
  
  // Badge Colors
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444'
};

export const TYPOGRAPHY = {
  fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px'
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px'
};

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)'
};

export const BORDER_RADIUS = {
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

export const TRANSITIONS = {
  fast: '0.15s ease-in-out',
  base: '0.2s ease-in-out',
  slow: '0.3s ease-in-out'
};

// Style Presets
export const STYLES = {
  card: {
    background: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.md,
    padding: SPACING['2xl'],
    transition: `all ${TRANSITIONS.base}`
  },
  
  pageTitle: {
    color: COLORS.text,
    margin: '0 0 8px 0',
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontFamily: TYPOGRAPHY.fontFamily
  },
  
  pageSubtitle: {
    color: COLORS.textSecondary,
    margin: 0,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    fontFamily: TYPOGRAPHY.fontFamily
  },
  
  sectionTitle: {
    color: COLORS.text,
    margin: `${SPACING['2xl']} 0 ${SPACING.lg} 0`,
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontFamily: TYPOGRAPHY.fontFamily
  },
  
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  
  tableHeader: {
    background: COLORS.backgroundTertiary,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: `${SPACING.lg} ${SPACING.md}`,
    textAlign: 'left',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  
  tableCell: {
    padding: `${SPACING.lg} ${SPACING.md}`,
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  
  button: (variant = 'primary') => {
    const variants = {
      primary: {
        background: COLORS.primary,
        color: '#ffffff',
        border: 'none',
        hoverBackground: COLORS.primaryHover
      },
      secondary: {
        background: COLORS.backgroundTertiary,
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        hoverBackground: COLORS.backgroundSecondary
      },
      outline: {
        background: 'transparent',
        color: COLORS.primary,
        border: `1px solid ${COLORS.primary}`,
        hoverBackground: COLORS.primaryLighter
      }
    };
    
    return {
      ...variants[variant],
      padding: `${SPACING.sm} ${SPACING.lg}`,
      borderRadius: BORDER_RADIUS.base,
      cursor: 'pointer',
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontWeight: TYPOGRAPHY.fontWeight.medium,
      transition: `all ${TRANSITIONS.fast}`,
      fontFamily: TYPOGRAPHY.fontFamily
    };
  },
  
  badge: (status) => {
    const statusMap = {
      'PENDING': { bg: COLORS.warningLight, color: '#92400e' },
      'APPROVED': { bg: COLORS.successLight, color: '#065f46' },
      'REJECTED': { bg: COLORS.dangerLight, color: '#7f1d1d' },
      'SUCCESS': { bg: COLORS.successLight, color: '#065f46' },
      'Pending': { bg: COLORS.warningLight, color: '#92400e' },
      'Success': { bg: COLORS.successLight, color: '#065f46' }
    };
    
    const styles = statusMap[status] || { bg: COLORS.backgroundTertiary, color: COLORS.textSecondary };
    return {
      display: 'inline-block',
      padding: `${SPACING.xs} ${SPACING.md}`,
      background: styles.bg,
      color: styles.color,
      borderRadius: BORDER_RADIUS.base,
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: TYPOGRAPHY.fontWeight.semibold
    };
  }
};

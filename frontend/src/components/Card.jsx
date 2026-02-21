import React from 'react';

const Card = ({
  title,
  value,
  icon,
  color = '#f0f0f0',
  textColor = '#1a1a1a',
  subtitle,
  onClick,
  style = {}
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: color,
        color: textColor,
        padding: '28px',
        borderRadius: '12px',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        ...style
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }
      }}
    >
      {icon && (
        <div style={{
          fontSize: '2.8em',
          marginBottom: '12px',
          lineHeight: '1'
        }}>
          {icon}
        </div>
      )}

      {value && (
        <div style={{
          fontSize: '2.2em',
          fontWeight: '700',
          marginBottom: title ? '8px' : '0',
          letterSpacing: '-0.5px'
        }}>
          {value}
        </div>
      )}

      {title && (
        <h3 style={{
          margin: '0',
          fontSize: '14px',
          fontWeight: '600',
          opacity: 0.95,
          letterSpacing: '0.3px'
        }}>
          {title}
        </h3>
      )}

      {subtitle && (
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '13px',
          opacity: 0.8
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Card;

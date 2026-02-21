import React from 'react';

const Card = ({
  title,
  value,
  icon,
  color = '#3498db',
  textColor = 'white',
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
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        ...style
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
      }}
    >
      {icon && (
        <div style={{
          fontSize: '2.5em',
          marginBottom: '10px'
        }}>
          {icon}
        </div>
      )}

      {title && (
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '1.2em',
          fontWeight: '600'
        }}>
          {title}
        </h3>
      )}

      {value && (
        <div style={{
          fontSize: '2.5em',
          fontWeight: 'bold',
          marginBottom: subtitle ? '10px' : '0'
        }}>
          {value}
        </div>
      )}

      {subtitle && (
        <p style={{
          margin: 0,
          fontSize: '0.95em',
          opacity: 0.9
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Card;

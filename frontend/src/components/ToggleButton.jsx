import React from 'react';

const ToggleButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        left: '20px',
        top: '20px',
        zIndex: 1001,
        background: '#f0f0f0',
        border: 'none',
        color: '#333',
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.5em',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.target.style.background = '#e8e8e8';
      }}
      onMouseOut={(e) => {
        e.target.style.background = '#f0f0f0';
      }}
      title={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isOpen ? '←' : '🍔'}
    </button>
  );
};

export default ToggleButton;

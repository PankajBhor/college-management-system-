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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: 'white',
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.5em',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
      }}
      title={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isOpen ? '←' : '🍔'}
    </button>
  );
};

export default ToggleButton;

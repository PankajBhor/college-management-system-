import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'white',
      padding: '20px 30px',
      color: '#1a1a1a',
      zIndex: 999,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>🏫 College Management System</h1>
      </div>

      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1em', fontWeight: 'bold', color: '#1a1a1a' }}>
              👋 {user.name}
            </div>
            <div style={{
              fontSize: '0.85em',
              opacity: 0.7,
              padding: '4px 12px',
              background: '#f0f0f0',
              borderRadius: '12px',
              marginTop: '4px',
              color: '#666'
            }}>
              {user.role}
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: '8px 20px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95em',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1d4ed8';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.transform = 'translateY(0)';
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

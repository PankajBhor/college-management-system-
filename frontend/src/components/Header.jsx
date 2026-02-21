import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 30px',
      color: 'white',
      zIndex: 999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
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
            <div style={{ fontSize: '1em', fontWeight: 'bold' }}>
              👋 {user.name}
            </div>
            <div style={{
              fontSize: '0.85em',
              opacity: 0.9,
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              marginTop: '4px'
            }}>
              {user.role}
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95em',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
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

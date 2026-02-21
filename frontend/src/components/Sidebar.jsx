import React from 'react';
import { menuConfig } from '../data/menuData';

const Sidebar = ({ isOpen, onNavigate, currentPage, userRole }) => {
  const menus = menuConfig[userRole] || [];

  return (
    <div style={{
      width: isOpen ? '280px' : '0px',
      background: 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
      color: 'white',
      padding: isOpen ? '100px 20px 20px 20px' : '0',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      boxShadow: isOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
    }}>
      {isOpen && (
        <>
          <div style={{
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '2px solid rgba(255,255,255,0.1)'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.5em', fontWeight: 'bold' }}>Menu</h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {menus.map((menu) => (
              <button
                key={menu.page}
                onClick={() => onNavigate(menu.page)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                  padding: '15px 20px',
                  background: currentPage === menu.page
                    ? 'rgba(255,255,255,0.2)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  if (currentPage !== menu.page) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== menu.page) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.3em', width: '30px' }}>{menu.icon}</span>
                <span>{menu.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { menuConfig } from '../data/menuData';

const Sidebar = ({ onNavigate, currentPage, userRole }) => {
  const [isHovered, setIsHovered] = useState(false);
  const menus = menuConfig[userRole] || [];

  return (
    <>
      {/* Hover Trigger Area */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '40px',
          height: '100vh',
          zIndex: 998,
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Sliding Sidebar */}
      <div
        style={{
          width: '280px',
          background: '#ffffff',
          color: '#1a1a1a',
          padding: '100px 0 20px 0',
          height: '100vh',
          position: 'fixed',
          left: isHovered ? '0' : '-280px',
          top: 0,
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 999,
          boxShadow: isHovered ? '4px 0 20px rgba(0,0,0,0.12)' : 'none',
          borderRight: '1px solid #e8e8e8'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          padding: '0 20px 20px 20px',
          marginBottom: '20px',
          borderBottom: '2px solid #e8e8e8'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Navigation
          </h2>
        </div>

        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '10px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 140px)',
          paddingLeft: '20px'
        }}>
          {menus.map((menu) => (
            <button
              key={menu.page}
              onClick={() => onNavigate(menu.page)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                background: currentPage === menu.page
                  ? '#2563eb'
                  : 'transparent',
                color: currentPage === menu.page
                  ? 'white'
                  : '#666',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textAlign: 'left',
                fontFamily: 'inherit',
                fontWeight: currentPage === menu.page ? '600' : '500'
              }}
              onMouseOver={(e) => {
                if (currentPage !== menu.page) {
                  e.target.style.background = '#f0f0f0';
                  e.target.style.color = '#1a1a1a';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== menu.page) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#666';
                }
              }}
            >
              <span style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}>
                {menu.icon}
              </span>
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { menuConfig } from '../data/menuData';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../utils/designSystem';

const Sidebar = ({ onNavigate, currentPage, userRole, isOpen, onOpenChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const menus = menuConfig[userRole] || [];
  const showSidebar = isOpen || isHovered;

  return (
    <>
      {/* Hover Trigger Area with Visual Indicator */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '12px',
          height: '100vh',
          zIndex: 998,
          cursor: 'pointer',
          background: !showSidebar ? COLORS.primary : 'transparent',
          transition: 'background 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!showSidebar && (
          <span
            style={{
              fontSize: '16px',
              writing: 'vertical-rl',
              textOrientation: 'mixed',
              color: '#ffffff',
              opacity: 0.8
            }}
          >
            ≡
          </span>
        )}
      </div>

      {/* Sliding Sidebar */}
      <div
        style={{
          width: '280px',
          background: COLORS.background,
          color: COLORS.text,
          padding: `100px 0 ${SPACING.lg} 0`,
          height: '100vh',
          position: 'fixed',
          left: showSidebar ? '0' : '-280px',
          top: 0,
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 999,
          boxShadow: showSidebar ? SHADOWS.lg : 'none',
          borderRight: `1px solid ${COLORS.border}`,
          fontFamily: TYPOGRAPHY.fontFamily
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          padding: `0 ${SPACING.lg} ${SPACING.lg} ${SPACING.lg}`,
          marginBottom: SPACING.lg,
          borderBottom: `2px solid ${COLORS.border}`
        }}>
          <h2 style={{
            margin: 0,
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: COLORS.text
          }}>
            Navigation
          </h2>
        </div>

        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.sm,
          paddingRight: SPACING.md,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 140px)',
          paddingLeft: SPACING.lg
        }}>
          {menus.map((menu) => (
            <button
              key={menu.page}
              onClick={() => {
                onNavigate(menu.page);
                // Close sidebar on selection if opened via button
                if (isOpen && !isHovered) {
                  onOpenChange(false);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.md,
                width: '100%',
                padding: `${SPACING.md} ${SPACING.lg}`,
                background: currentPage === menu.page ? COLORS.primary : 'transparent',
                color: currentPage === menu.page ? '#ffffff' : COLORS.textSecondary,
                border: 'none',
                borderRadius: BORDER_RADIUS.md,
                fontSize: TYPOGRAPHY.fontSize.sm,
                cursor: 'pointer',
                transition: `all ${0.25}s ease`,
                textAlign: 'left',
                fontFamily: TYPOGRAPHY.fontFamily,
                fontWeight: currentPage === menu.page ? TYPOGRAPHY.fontWeight.semibold : TYPOGRAPHY.fontWeight.medium,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                if (currentPage !== menu.page) {
                  e.currentTarget.style.background = COLORS.backgroundTertiary;
                  e.currentTarget.style.color = COLORS.text;
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== menu.page) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = COLORS.textSecondary;
                }
              }}
            >
              <span style={{ 
                fontSize: TYPOGRAPHY.fontSize.xl, 
                width: '20px', 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit'
              }}>
                {menu.icon}
              </span>
              <span style={{ color: 'inherit' }}>
                {menu.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

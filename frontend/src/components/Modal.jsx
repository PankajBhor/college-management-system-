import React from 'react';

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 1051
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '25px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.5em',
              fontWeight: '600',
              color: '#333'
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5em',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '30px',
                height: '30px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{
            padding: '25px'
          }}>
            {children}
          </div>

          {/* Footer */}
          {(onConfirm || onClose) && (
            <div style={{
              padding: '20px 25px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontFamily: 'inherit',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#ddd';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f0f0f0';
                }}
              >
                {cancelText}
              </button>
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  style={{
                    padding: '10px 20px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#218838';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#28a745';
                  }}
                >
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;

import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import EnquiryIndex from './enquiry/index';
import NewEnquiry from './enquiry/NewEnquiry';
import UpdateEnquiry from './enquiry/UpdateEnquiry';

const DashboardLayout = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');

  // Check if user has access to a page
  const canAccessPage = (page) => {
    const allowedPages = {
      'enquiries': ['PRINCIPAL', 'ENQUIRY_STAFF'],
      'new-enquiry': ['PRINCIPAL', 'ENQUIRY_STAFF'],
      'update-enquiry': ['PRINCIPAL', 'ENQUIRY_STAFF'],
      'dashboard': ['PRINCIPAL', 'OFFICE_STAFF', 'ENQUIRY_STAFF', 'FACULTY', 'HOD'],
      'students': ['PRINCIPAL', 'OFFICE_STAFF', 'FACULTY', 'HOD'],
      'fees': ['PRINCIPAL', 'OFFICE_STAFF'],
      'courses': ['PRINCIPAL', 'FACULTY', 'HOD'],
      'department': ['HOD']
    };

    const allowed = allowedPages[page] || [];
    return allowed.includes(user?.role);
  };

  // Render the appropriate page based on activePage
  const renderPage = () => {
    // Security: Check if user has access
    if (!canAccessPage(activePage)) {
      return <Dashboard user={user} />;
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'enquiries':
        return <EnquiryIndex />;
      case 'new-enquiry':
        return <NewEnquiry />;
      case 'update-enquiry':
        return <UpdateEnquiry />;
      case 'students':
        return (
          <div>
            <h2 style={{ color: '#1a1a1a', marginBottom: '20px', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              Students
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px', fontWeight: '500' }}>
              Manage student information and records
            </p>
            <div style={{ padding: '40px 30px', background: '#f8f9fa', borderRadius: '12px', color: '#1a1a1a', textAlign: 'center', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 10px 0', color: '#1a1a1a' }}>
                Student Management
              </h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px', color: '#666' }}>
                Coming soon! This feature will allow you to manage student information, records, and enrollment.
              </p>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div>
            <h2 style={{ color: '#1a1a1a', marginBottom: '20px', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              Fees Management
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px', fontWeight: '500' }}>
              Track and manage student fees payment
            </p>
            <div style={{ padding: '40px 30px', background: '#f8f9fa', borderRadius: '12px', color: '#1a1a1a', textAlign: 'center', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>💰</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 10px 0', color: '#1a1a1a' }}>
                Fee Management
              </h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px', color: '#666' }}>
                Coming soon! Track student fee payments, generate invoices, and manage fee collections.
              </p>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div>
            <h2 style={{ color: '#1a1a1a', marginBottom: '20px', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              Courses
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px', fontWeight: '500' }}>
              Manage courses and curriculum
            </p>
            <div style={{ padding: '40px 30px', background: '#f8f9fa', borderRadius: '12px', color: '#1a1a1a', textAlign: 'center', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 10px 0', color: '#1a1a1a' }}>
                Course Management
              </h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px', color: '#666' }}>
                Coming soon! Create and manage courses, assign faculty, and define curriculum.
              </p>
            </div>
          </div>
        );
      case 'department':
        return (
          <div>
            <h2 style={{ color: '#1a1a1a', marginBottom: '20px', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              Department Management
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px', fontWeight: '500' }}>
              Manage your department details and faculty
            </p>
            <div style={{ padding: '40px 30px', background: '#f8f9fa', borderRadius: '12px', color: '#1a1a1a', textAlign: 'center', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👨‍💼</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 10px 0', color: '#1a1a1a' }}>
                Department Information
              </h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px', color: '#666' }}>
                Coming soon! Manage department details, faculty assignments, and departmental operations.
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      paddingLeft: '80px',
      paddingTop: '80px',
      paddingRight: '20px',
      paddingBottom: '20px',
      transition: 'padding-left 0.3s ease',
      position: 'relative'
    }}>
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Sidebar */}
      <Sidebar
        onNavigate={setActivePage}
        currentPage={activePage}
        userRole={user?.role}
      />

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '40px'
        }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

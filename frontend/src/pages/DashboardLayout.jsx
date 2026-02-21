import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ToggleButton from '../components/ToggleButton';
import Dashboard from './Dashboard';
import EnquiryIndex from './enquiry/index';
import NewEnquiry from './enquiry/NewEnquiry';
import UpdateEnquiry from './enquiry/UpdateEnquiry';
import { AdmissionForm } from './admissions';

const DashboardLayout = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      'admissions': ['PRINCIPAL', 'OFFICE_STAFF']
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
      case 'admissions':
        return <AdmissionForm />;
      case 'students':
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '2em', fontWeight: '600' }}>
              👥 Students
            </h2>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
              <p style={{ color: '#666', fontSize: '1.1em' }}>
                🚀 Student management coming soon!
              </p>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '2em', fontWeight: '600' }}>
              💰 Fees
            </h2>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
              <p style={{ color: '#666', fontSize: '1.1em' }}>
                🚀 Fee management coming soon!
              </p>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '2em', fontWeight: '600' }}>
              📚 Courses
            </h2>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
              <p style={{ color: '#666', fontSize: '1.1em' }}>
                🚀 Course management coming soon!
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingLeft: isSidebarOpen ? '320px' : '80px',
      paddingTop: '80px',
      paddingRight: '20px',
      paddingBottom: '20px',
      transition: 'padding-left 0.3s ease',
      position: 'relative'
    }}>
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Toggle Button */}
      <ToggleButton
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isOpen={isSidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={setActivePage}
        currentPage={activePage}
        userRole={user?.role}
      />

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        minHeight: '80vh'
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

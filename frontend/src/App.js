import React, { useState, useEffect } from 'react';  // 🔥 ADDED useEffect
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🔥 BACKDOOR: URL (?user=principal) + Ctrl+Shift+L
  useEffect(() => {
    // URL Backdoor: localhost:3000/?user=principal
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get('user');
    
    const users = {
      'principal': { name: 'Dr. Pankaj Sharma', role: 'PRINCIPAL' },
      'office': { name: 'Priya Office', role: 'OFFICE_STAFF' },
      'enquiry': { name: 'Rahul Enquiry', role: 'ENQUIRY_STAFF' },
      'faculty': { name: 'Prof. Anita', role: 'FACULTY' },
      'hod': { name: 'Dr. Rajesh HOD', role: 'HOD' }
    };
    
    if (urlUser && users[urlUser]) {
      setUser(users[urlUser]);
      console.log('🚀 URL BACKDOOR:', users[urlUser].name);
      return;
    }
    
    // Keyboard: Ctrl+Shift+L = Random user
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        const randomUser = Object.values(users)[Math.floor(Math.random() * 5)];
        setUser(randomUser);
        console.log('⌨️ KEYBOARD BACKDOOR:', randomUser.name);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 🔥 SINGLE TOGGLE BUTTON
  const ToggleButton = () => (
    <button
      onClick={toggleSidebar}
      style={{
        position: 'fixed', 
        left: '20px',  // 🔥 Always 20px - no jumping
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
    >
      {isSidebarOpen ? '←' : '🍔'}
    </button>
  );

  // Sidebar Component
  const Sidebar = () => {
    const menus = {
      PRINCIPAL: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard' },
        { icon: '👥', label: 'Students', page: 'students' },
        { icon: '💰', label: 'Fees', page: 'fees' },
        { icon: '📚', label: 'Courses', page: 'courses' },
        { icon: '📞', label: 'Enquiries', page: 'enquiries' }
      ],
      OFFICE_STAFF: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard' },
        { icon: '👥', label: 'Students', page: 'students' },
        { icon: '💰', label: 'Fees', page: 'fees' },
        { icon: '📞', label: 'Enquiries', page: 'enquiries' }
      ],
      ENQUIRY_STAFF: [
  { icon: '📊', label: 'Dashboard', page: 'dashboard' },
  { icon: '📋', label: 'New Enquiry Registration', page: 'new-enquiry' },
  { icon: '📝', label: 'Update Enquiry Details', page: 'update-enquiry' }
]
,
      FACULTY: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard' },
        { icon: '👥', label: 'Students', page: 'students' },
        { icon: '📚', label: 'Courses', page: 'courses' }
      ]
    };

    const roleMenus = menus[user?.role] || [];

    return (
      <div style={{
        width: isSidebarOpen ? '280px' : '0px',
        background: 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
        color: 'white',
        padding: isSidebarOpen ? '80px 20px 20px 20px' : '0',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        boxShadow: isSidebarOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
      }}>
        {isSidebarOpen && (
          <>
            <div style={{ 
              marginBottom: '40px', 
              paddingBottom: '20px', 
              borderBottom: '2px solid rgba(255,255,255,0.1)'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>🏫 College CMS</h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.95em', opacity: 0.9 }}>
                {user?.role}
              </p>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roleMenus.map((menu) => (
                <button
                  key={menu.page}
                  onClick={() => setActivePage(menu.page)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    width: '100%',
                    padding: '15px 20px',
                    background: activePage === menu.page 
                      ? 'rgba(255,255,255,0.2)' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1.05em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => {
                    if (activePage !== menu.page) {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activePage !== menu.page) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.3em' }}>{menu.icon}</span>
                  <span>{menu.label}</span>
                </button>
              ))}
            </nav>
          </>
        )}
      </div>
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const testUsers = {
      'principal@college.com': { name: 'Dr. Pankaj Sharma', role: 'PRINCIPAL' },
      'office@college.com': { name: 'Priya Office', role: 'OFFICE_STAFF' },
      'enquiry@college.com': { name: 'Rahul Enquiry', role: 'ENQUIRY_STAFF' },
      'faculty@college.com': { name: 'Prof. Anita', role: 'FACULTY' },
      'hod@college.com': { name: 'Dr. Rajesh HOD', role: 'HOD' }
    };

    const testUser = testUsers[email.toLowerCase()];
    
    if (testUser && password === 'password') {
      setUser(testUser);
    } else if (!testUser) {
      setError('Email not found! Try: principal@college.com');
    } else {
      setError('Wrong password! Use: password');
    }
  };

  if (user) {
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
        <ToggleButton />
        <Sidebar />
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '2.5em' }}>🏫 College Management System</h1>
            <div style={{ marginTop: '10px', fontSize: '1.2em' }}>
              <span>👋 Welcome back, </span>
              <strong>{user.name}</strong>
            </div>
            <div style={{ 
              marginTop: '10px', 
              padding: '10px 20px', 
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '25px',
              display: 'inline-block',
              fontSize: '1.1em'
            }}>
              🎭 Role: <strong>{user.role}</strong>
            </div>
          </div>

          <div style={{ padding: '40px' }}>
            {activePage === 'dashboard' && (
              <div>
                <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>📊 Dashboard</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)', gap: '20px' }}>
                  <div style={{ background: '#3498db', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📊 Total Students</h3>
                    <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>1,247</div>
                  </div>
                  <div style={{ background: '#e74c3c', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>💰 Pending Fees</h3>
                    <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>₹4,25,000</div>
                  </div>
                </div>
              </div>
            )}
            
            {activePage === 'students' && (
              <div>
                <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>👥 Students</h2>
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
                  <p>Student list coming soon! 👨‍🎓</p>
                </div>
              </div>
            )}
            
            {activePage === 'fees' && (
              <div>
                <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>💰 Fees</h2>
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px' }}>
                  <p>Fee management coming soon! 💳</p>
                </div>
              </div>
            )}

            <div style={{ marginTop: '40px', textAlign: 'center', paddingTop: '30px', borderTop: '2px solid #eee' }}>
              <button 
                onClick={() => setUser(null)} 
                style={{ 
                  padding: '15px 40px', 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '25px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(220,53,69,0.4)'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login form (unchanged)
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.95)', 
        padding: '40px', 
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🔐 College Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="principal@college.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '15px', borderRadius: '8px',
                border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '15px', borderRadius: '8px',
                border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box'
              }}
              required
            />
          </div>
          {error && <p style={{ color: '#dc3545', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}
          <button 
            type="submit"
            style={{
              width: '100%', padding: '15px', background: '#28a745',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '18px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Login
          </button>
        </form>
        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          <p><strong>Test accounts:</strong></p>
          <p>principal@college.com | office@college.com</p>
          <p>enquiry@college.com | faculty@college.com</p>
          <p>All passwords: <code>password</code></p>
          <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '10px' }}>
            🚀 <strong>BACKDOOR:</strong> ?user=principal | Ctrl+Shift+L
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

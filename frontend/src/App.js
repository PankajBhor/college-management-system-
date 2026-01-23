import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/api/users/login', { 
        email, 
        password 
      });
      setUser(response.data);
    } catch (err) {
      setError('Login failed - check email/password');
    }
  };

  if (user) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* HEADER */}
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

        {/* DASHBOARD CONTENT */}
        <div style={{ padding: '40px' }}>
          {user.role === 'PRINCIPAL' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>👑 Principal Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)', gap: '20px' }}>
                <div style={{ background: '#3498db', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📊 Total Students</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>1,247</div>
                </div>
                <div style={{ background: '#e74c3c', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>💰 Pending Fees</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>₹4,25,000</div>
                </div>
                <div style={{ background: '#27ae60', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📚 Active Courses</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>28</div>
                </div>
              </div>
            </div>
          )}

          {user.role === 'HOD' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>📚 HOD Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)', gap: '20px' }}>
                <div style={{ background: '#f39c12', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3>👨‍🎓 Department Students</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>156</div>
                </div>
                <div style={{ background: '#9b59b6', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3>👨‍🏫 Faculty Members</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>12</div>
                </div>
              </div>
            </div>
          )}

          {user.role === 'ENQUIRY_STAFF' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>📞 Enquiry Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)', gap: '20px' }}>
                <div style={{ background: '#e67e22', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3>📋 New Enquiries</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>23</div>
                </div>
                <div style={{ background: '#1abc9c', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3>📧 Follow-ups</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>8</div>
                </div>
              </div>
            </div>
          )}
          {user.role === 'OFFICE_STAFF' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>💼 Office Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)', gap: '20px' }}>
                <div style={{ background: '#34495e', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📄 Documents Processed</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>47</div>
                </div>
                <div style={{ background: '#16a085', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📋 Pending Tasks</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>12</div>
                </div>
              </div>
            </div>
          )}
          {user.role === 'FACULTY' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>👨‍🏫 Faculty Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr)', gap: '20px' }}>
                <div style={{ background: '#9b59b6', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📚 Assigned Courses</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>5</div>
                </div>
                <div style={{ background: '#3498db', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📊 Student Grades</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>89%</div>
                </div>
                <div style={{ background: '#e67e22', color: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📅 Next Class</h3>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>10:00 AM</div>
                </div>
              </div>
            </div>
          )}

          {/* Add more roles as needed */}

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
          <p>principal@college.com | hod@college.com</p>
          <p>enquiry@college.com | office@college.com | faculty@college.com</p>
          <p>All passwords: <code>password</code></p>
        </div>
      </div>
    </div>
  );
}

export default App;

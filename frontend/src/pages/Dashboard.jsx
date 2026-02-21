import React from 'react';
import Card from '../components/Card';

const Dashboard = ({ user }) => {
  // Sample dashboard data - in real app, would come from API
  const dashboardStats = {
    PRINCIPAL: [
      { title: 'Total Students', value: '1,247', icon: '👥', color: '#3498db' },
      { title: 'Pending Fees', value: '₹4,25,000', icon: '💰', color: '#e74c3c' },
      { title: 'Total Courses', value: '18', icon: '📚', color: '#2ecc71' },
      { title: 'Faculty Members', value: '87', icon: '👨‍🏫', color: '#9b59b6' }
    ],
    OFFICE_STAFF: [
      { title: 'Students', value: '1,247', icon: '👥', color: '#3498db' },
      { title: 'Pending Fees', value: '₹4,25,000', icon: '💰', color: '#e74c3c' },
      { title: 'New Admissions', value: '156', icon: '📝', color: '#f39c12' },
      { title: 'Queries Pending', value: '23', icon: '❓', color: '#1abc9c' }
    ],
    ENQUIRY_STAFF: [
      { title: 'Total Enquiries', value: '892', icon: '📞', color: '#3498db' },
      { title: 'This Month', value: '142', icon: '📈', color: '#2ecc71' },
      { title: 'Converted', value: '67', icon: '✅', color: '#27ae60' },
      { title: 'Follow-up', value: '45', icon: '⏰', color: '#f39c12' }
    ],
    FACULTY: [
      { title: 'My Classes', value: '5', icon: '🎓', color: '#3498db' },
      { title: 'Students', value: '187', icon: '👥', color: '#2ecc71' },
      { title: 'Assignments', value: '12', icon: '📝', color: '#f39c12' },
      { title: 'Grades Added', value: '89%', icon: '⭐', color: '#9b59b6' }
    ],
    HOD: [
      { title: 'Department Students', value: '456', icon: '👥', color: '#3498db' },
      { title: 'Faculty', value: '28', icon: '👨‍🏫', color: '#2ecc71' },
      { title: 'Courses', value: '6', icon: '📚', color: '#9b59b6' },
      { title: 'Pending Issues', value: '5', icon: '⚠️', color: '#e74c3c' }
    ]
  };

  const stats = dashboardStats[user?.role] || dashboardStats.PRINCIPAL;

  return (
    <div style={{ padding: '0' }}>
      <h2 style={{
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2em',
        fontWeight: '600'
      }}>
        📊 Dashboard
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          color: '#2c3e50',
          marginTop: 0,
          marginBottom: '20px',
          fontSize: '1.3em'
        }}>
          📋 Quick Actions
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px'
        }}>
          <button style={{
            padding: '15px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '500',
            transition: 'transform 0.3s ease'
          }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            📊 View Reports
          </button>

          <button style={{
            padding: '15px 20px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '500',
            transition: 'transform 0.3s ease'
          }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            📝 Add Data
          </button>

          <button style={{
            padding: '15px 20px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '500',
            transition: 'transform 0.3s ease'
          }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

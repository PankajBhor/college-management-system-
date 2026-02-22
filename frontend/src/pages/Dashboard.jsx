import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useEnquiry } from '../hooks/useEnquiry';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/designSystem';

const Dashboard = ({ user }) => {
  const { enquiries, fetchEnquiries } = useEnquiry();
  const [stats, setStats] = useState([]);

  // Fetch enquiries on component mount for ENQUIRY_STAFF and PRINCIPAL
  useEffect(() => {
    if ((user?.role === 'ENQUIRY_STAFF' || user?.role === 'PRINCIPAL') && enquiries.length === 0) {
      fetchEnquiries();
    }
  }, [user?.role, enquiries.length, fetchEnquiries]);

  // Calculate real enquiry stats
  useEffect(() => {
    if (user?.role === 'ENQUIRY_STAFF' || user?.role === 'PRINCIPAL') {
      const totalEnquiries = enquiries.length;
      const successEnquiries = enquiries.filter(e => e.status === 'Success').length;
      const pendingEnquiries = enquiries.filter(e => e.status === 'Pending').length;

      if (user?.role === 'ENQUIRY_STAFF') {
        setStats([
          { title: 'Total Enquiries', value: totalEnquiries.toString(), icon: '📞', color: '#e8e8e8', textColor: '#1a1a1a' },
          { title: 'Pending', value: pendingEnquiries.toString(), icon: '⏳', color: '#efefef', textColor: '#1a1a1a' },
          { title: 'Success', value: successEnquiries.toString(), icon: '✅', color: '#f5f5f5', textColor: '#1a1a1a' },
          { 
            title: 'Success Rate', 
            value: totalEnquiries > 0 ? `${Math.round((successEnquiries / totalEnquiries) * 100)}%` : '0%', 
            icon: '📈', 
            color: '#f0f0f0', 
            textColor: '#1a1a1a' 
          }
        ]);
      } else if (user?.role === 'PRINCIPAL') {
        // Principal also sees enquiry stats in addition to other stats
        const defaultStats = [
          { title: 'Total Students', value: '1,247', icon: '👥', color: '#e8e8e8', textColor: '#1a1a1a' },
          { title: 'Pending Fees', value: '₹4,25,000', icon: '💰', color: '#efefef', textColor: '#1a1a1a' },
          { title: 'Total Enquiries', value: totalEnquiries.toString(), icon: '📞', color: '#f5f5f5', textColor: '#1a1a1a' },
          { title: 'Converted', value: successEnquiries.toString(), icon: '✅', color: '#f0f0f0', textColor: '#1a1a1a' }
        ];
        setStats(defaultStats);
      }
    } else {
      // Default stats for other roles
      const defaultStats = {
        OFFICE_STAFF: [
          { title: 'Students', value: '1,247', icon: '👥', color: '#e8e8e8', textColor: '#1a1a1a' },
          { title: 'Pending Fees', value: '₹4,25,000', icon: '💰', color: '#efefef', textColor: '#1a1a1a' },
          { title: 'New Admissions', value: '156', icon: '📝', color: '#f5f5f5', textColor: '#1a1a1a' },
          { title: 'Queries Pending', value: '23', icon: '❓', color: '#f0f0f0', textColor: '#1a1a1a' }
        ],
        FACULTY: [
          { title: 'My Classes', value: '5', icon: '🎓', color: '#e8e8e8', textColor: '#1a1a1a' },
          { title: 'Students', value: '187', icon: '👥', color: '#efefef', textColor: '#1a1a1a' },
          { title: 'Assignments', value: '12', icon: '📝', color: '#f5f5f5', textColor: '#1a1a1a' },
          { title: 'Grades Added', value: '89%', icon: '⭐', color: '#f0f0f0', textColor: '#1a1a1a' }
        ],
        HOD: [
          { title: 'Department Students', value: '456', icon: '👥', color: '#e8e8e8', textColor: '#1a1a1a' },
          { title: 'Faculty', value: '28', icon: '👨‍🏫', color: '#efefef', textColor: '#1a1a1a' },
          { title: 'Courses', value: '6', icon: '📚', color: '#f5f5f5', textColor: '#1a1a1a' },
          { title: 'Pending Issues', value: '5', icon: '⚠️', color: '#f0f0f0', textColor: '#1a1a1a' }
        ]
      };
      setStats(defaultStats[user?.role] || defaultStats.OFFICE_STAFF);
    }
  }, [user?.role, enquiries]);

  const currentStats = stats;

  return (
    <div style={{ padding: '0', fontFamily: TYPOGRAPHY.fontFamily }}>
      <div style={{ marginBottom: SPACING['4xl'] }}>
        <h2 style={{
          color: COLORS.text,
          margin: `0 0 ${SPACING.md} 0`,
          fontSize: TYPOGRAPHY.fontSize['4xl'],
          fontWeight: TYPOGRAPHY.fontWeight.bold
        }}>
          Dashboard
        </h2>
        <p style={{
          color: COLORS.textSecondary,
          margin: 0,
          fontSize: TYPOGRAPHY.fontSize.sm,
          fontWeight: TYPOGRAPHY.fontWeight.medium
        }}>
          Welcome back, {user?.name || 'Administrator'} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: SPACING['2xl'],
        marginBottom: SPACING['4xl']
      }}>
        {currentStats.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            textColor={stat.textColor}
          />
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            color: '#1a1a1a',
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📊 System Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Active Users:</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>342</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>System Status:</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>🟢 Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Last Updated:</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>Just now</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            color: '#1a1a1a',
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{
              padding: '10px 15px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1d4ed8';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              View Reports
            </button>
            <button style={{
              padding: '10px 15px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1d4ed8';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              Export Data
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            color: '#1a1a1a',
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📅 This Week
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Scheduled Events:</span>
              <span style={{ fontWeight: '600' }}>8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Pending Tasks:</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Completed:</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

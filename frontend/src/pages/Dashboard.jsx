import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../services/dashboardService';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../utils/designSystem';

const parseMetricValue = (value) => {
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getRoleAccent = (role) => {
  const accents = {
    PRINCIPAL: '#1e40af',
    OFFICE_STAFF: '#0f766e',
    ENQUIRY_STAFF: '#0891b2',
    HOD: '#7c3aed',
    FACULTY: '#475467'
  };

  return accents[role] || COLORS.primary;
};

const getMetricShare = (metric, maxValue) => {
  if (!metric || !maxValue) {
    return 0;
  }

  if (String(metric.value).includes('%')) {
    return Math.max(8, Math.min(100, parseMetricValue(metric.value)));
  }

  return Math.max(8, Math.min(100, Math.round((parseMetricValue(metric.value) / maxValue) * 100)));
};

const MetricCard = ({ stat, maxValue }) => {
  const share = getMetricShare(stat, maxValue);

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e7eaef',
      borderRadius: '8px',
      padding: '20px',
      minHeight: '156px',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        inset: '0 0 auto 0',
        height: '4px',
        background: stat.accent || COLORS.primary
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            margin: '0 0 10px 0',
            color: COLORS.textSecondary,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.semibold
          }}>
            {stat.title}
          </p>
          <div style={{
            color: COLORS.text,
            fontSize: '34px',
            lineHeight: 1,
            fontWeight: TYPOGRAPHY.fontWeight.bold
          }}>
            {stat.value}
          </div>
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          background: stat.color || COLORS.backgroundTertiary,
          color: stat.accent || COLORS.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: TYPOGRAPHY.fontSize.sm,
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          flexShrink: 0
        }}>
          {stat.icon}
        </div>
      </div>

      <div>
        {stat.subtitle && (
          <p style={{
            margin: '0 0 12px 0',
            color: COLORS.textSecondary,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}>
            {stat.subtitle}
          </p>
        )}
        <div style={{
          height: '6px',
          width: '100%',
          borderRadius: '999px',
          background: '#edf1f5',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${share}%`,
            height: '100%',
            borderRadius: '999px',
            background: stat.accent || COLORS.primary
          }} />
        </div>
      </div>
    </div>
  );
};

const DashboardPanel = ({ title, children }) => (
  <div style={{
    background: '#ffffff',
    border: '1px solid #e7eaef',
    borderRadius: '8px',
    boxShadow: SHADOWS.sm,
    padding: '22px'
  }}>
    <h3 style={{
      margin: `0 0 ${SPACING.lg} 0`,
      color: COLORS.text,
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontWeight: TYPOGRAPHY.fontWeight.bold
    }}>
      {title}
    </h3>
    {children}
  </div>
);

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState([]);
  const [dashboardTitle, setDashboardTitle] = useState('Dashboard');
  const [dashboardSubtitle, setDashboardSubtitle] = useState('Database-backed overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardMetrics() {
      if (!user?.role) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const metrics = await getDashboardMetrics(user.role);

        if (isMounted) {
          setStats(metrics.stats);
          setDashboardTitle(metrics.title);
          setDashboardSubtitle(metrics.subtitle);
        }
      } catch (metricError) {
        if (isMounted) {
          setError('Unable to load dashboard metrics from the database.');
          setStats([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardMetrics();

    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  const accent = getRoleAccent(user?.role);
  const numericStats = stats
    .filter(stat => !String(stat.value).includes('%'))
    .map(stat => parseMetricValue(stat.value));
  const maxValue = Math.max(...numericStats, 0);
  const primaryStat = stats[0];
  const secondaryStats = stats.slice(1);
  const pendingMetric = stats.find(stat => stat.title.toLowerCase().includes('pending'));
  const successMetric = stats.find(stat => (
    stat.title.toLowerCase().includes('approved') ||
    stat.title.toLowerCase().includes('success')
  ));
  const totalMetric = stats.find(stat => stat.title.toLowerCase().includes('total')) || primaryStat;
  const totalValue = parseMetricValue(totalMetric?.value || 0);
  const pendingValue = parseMetricValue(pendingMetric?.value || 0);
  const successValue = parseMetricValue(successMetric?.value || 0);
  const completionRate = totalValue > 0 ? Math.round((successValue / totalValue) * 100) : 0;
  const pendingRate = totalValue > 0 ? Math.round((pendingValue / totalValue) * 100) : 0;
  const hasStatusMetrics = Boolean(pendingMetric || successMetric);

  return (
    <div style={{ padding: '0', fontFamily: TYPOGRAPHY.fontFamily }}>
      <div style={{
        marginBottom: SPACING['4xl'],
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #dfe5ee',
        background: '#101828',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${accent} 0%, #164e63 52%, #111827 100%)`,
          padding: '30px',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.16)',
              border: '1px solid rgba(255,255,255,0.24)',
              fontSize: TYPOGRAPHY.fontSize.xs,
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              marginBottom: '18px'
            }}>
              {(user?.role || 'USER').replace('_', ' ')}
            </div>

            <h2 style={{
              color: '#ffffff',
              margin: `0 0 ${SPACING.md} 0`,
              fontSize: '34px',
              lineHeight: 1.15,
              fontWeight: TYPOGRAPHY.fontWeight.bold
            }}>
              {dashboardTitle}
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.82)',
              margin: 0,
              maxWidth: '720px',
              fontSize: TYPOGRAPHY.fontSize.base,
              lineHeight: TYPOGRAPHY.lineHeight.normal,
              fontWeight: TYPOGRAPHY.fontWeight.medium
            }}>
              Welcome back, {user?.name || 'User'}. {dashboardSubtitle}.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '22px',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.76)',
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.semibold
            }}>
              Primary Metric
            </span>
            <div>
              <div style={{
                color: '#ffffff',
                fontSize: '44px',
                lineHeight: 1,
                fontWeight: TYPOGRAPHY.fontWeight.bold
              }}>
                {loading ? '--' : (primaryStat?.value || '0')}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.82)',
                fontSize: TYPOGRAPHY.fontSize.sm,
                marginTop: '8px',
                fontWeight: TYPOGRAPHY.fontWeight.medium
              }}>
                {primaryStat?.title || 'No metric loaded'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0',
          color: COLORS.textSecondary
        }}>
          Loading dashboard metrics...
        </div>
      ) : error ? (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0',
          color: COLORS.danger || '#b42318'
        }}>
          {error}
        </div>
      ) : stats.length > 0 ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: SPACING['2xl'],
            marginBottom: SPACING['4xl']
          }}>
            {stats.map((stat) => (
              <MetricCard key={stat.title} stat={stat} maxValue={maxValue} />
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: SPACING['2xl']
          }}>
            <DashboardPanel title="Metric Breakdown">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {secondaryStats.map((stat) => {
                  const share = getMetricShare(stat, maxValue);

                  return (
                    <div key={stat.title}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginBottom: '8px',
                        color: COLORS.text,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: TYPOGRAPHY.fontWeight.semibold
                      }}>
                        <span>{stat.title}</span>
                        <span>{stat.value}</span>
                      </div>
                      <div style={{
                        height: '10px',
                        borderRadius: '999px',
                        background: '#edf1f5',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${share}%`,
                          height: '100%',
                          borderRadius: '999px',
                          background: stat.accent || accent
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardPanel>

            <DashboardPanel title={hasStatusMetrics ? 'Status Snapshot' : 'Records Snapshot'}>
              {hasStatusMetrics ? (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      border: '1px solid #e7eaef',
                      borderRadius: '8px',
                      padding: '16px',
                      background: '#f8fafc'
                    }}>
                      <div style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.fontSize.xs, fontWeight: 700 }}>
                        Cleared
                      </div>
                      <div style={{ color: COLORS.success, fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
                        {completionRate}%
                      </div>
                    </div>
                    <div style={{
                      border: '1px solid #e7eaef',
                      borderRadius: '8px',
                      padding: '16px',
                      background: '#f8fafc'
                    }}>
                      <div style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.fontSize.xs, fontWeight: 700 }}>
                        Pending
                      </div>
                      <div style={{ color: COLORS.warning, fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
                        {pendingRate}%
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[totalMetric, pendingMetric, successMetric].filter(Boolean).map((stat) => (
                      <div key={stat.title} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '12px 0',
                        borderTop: '1px solid #eef1f5'
                      }}>
                        <span style={{
                          color: COLORS.textSecondary,
                          fontSize: TYPOGRAPHY.fontSize.sm,
                          fontWeight: TYPOGRAPHY.fontWeight.medium
                        }}>
                          {stat.title}
                        </span>
                        <span style={{
                          color: COLORS.text,
                          fontSize: TYPOGRAPHY.fontSize.base,
                          fontWeight: TYPOGRAPHY.fontWeight.bold
                        }}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats.map((stat) => (
                    <div key={stat.title} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '12px 0',
                      borderTop: '1px solid #eef1f5'
                    }}>
                      <span style={{
                        color: COLORS.textSecondary,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: TYPOGRAPHY.fontWeight.medium
                      }}>
                        {stat.title}
                      </span>
                      <span style={{
                        color: COLORS.text,
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: TYPOGRAPHY.fontWeight.bold
                      }}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </DashboardPanel>
          </div>
        </>
      ) : (
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0',
          color: COLORS.textSecondary
        }}>
          No dashboard metrics are available for this role.
        </div>
      )}
    </div>
  );
};

export default Dashboard;

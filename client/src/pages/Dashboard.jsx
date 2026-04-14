import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineShieldCheck, HiOutlineBan } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === 'admin' || user?.role === 'manager') {
        try {
          const res = await api.get('/users?limit=1');
          const total = res.data.data.pagination.total;

          // Fetch counts by status
          const [activeRes, inactiveRes, adminRes] = await Promise.all([
            api.get('/users?status=active&limit=1'),
            api.get('/users?status=inactive&limit=1'),
            api.get('/users?role=admin&limit=1'),
          ]);

          setStats({
            total,
            active: activeRes.data.data.pagination.total,
            inactive: inactiveRes.data.data.pagination.total,
            admins: adminRes.data.data.pagination.total,
          });
        } catch (err) {
          console.error('Failed to load stats:', err);
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [user?.role]);

  const AdminDashboard = () => (
    <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon purple">
            <HiOutlineUsers size={24} />
          </div>
          <div className="stat-value">{stats?.total ?? '—'}</div>
          <div className="stat-label">Total Users</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <HiOutlineUserAdd size={24} />
          </div>
          <div className="stat-value">{stats?.active ?? '—'}</div>
          <div className="stat-label">Active Users</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <HiOutlineBan size={24} />
          </div>
          <div className="stat-value">{stats?.inactive ?? '—'}</div>
          <div className="stat-label">Inactive Users</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">
            <HiOutlineShieldCheck size={24} />
          </div>
          <div className="stat-value">{stats?.admins ?? '—'}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Quick Actions</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/users')}>
            <HiOutlineUsers size={16} /> View All Users
          </button>
          {user?.role === 'admin' && (
            <button className="btn btn-secondary" onClick={() => navigate('/users/create')}>
              <HiOutlineUserAdd size={16} /> Create New User
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
            My Profile
          </button>
        </div>
      </div>
    </>
  );

  const UserDashboard = () => (
    <div className="card">
      <div className="card-header">
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
          Welcome, {user?.firstName}!
        </h2>
      </div>
      <div className="card-body">
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          You are logged in as a <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>.
          You can view and update your profile from here.
        </p>

        <div className="detail-grid">
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user?.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>
            Edit My Profile
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.firstName}! Here's an overview of your system.</p>
        </div>
      </div>

      {user?.role === 'admin' || user?.role === 'manager' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};

export default Dashboard;

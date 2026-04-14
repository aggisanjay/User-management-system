import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  getRoleBadgeClass,
  getStatusBadgeClass,
  getInitials,
  getAvatarColor,
  formatDate,
} from '../utils/roles';
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineMail,
  HiOutlineCalendar,
} from 'react-icons/hi';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unauthorized-page">
        <div className="error-code">!</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/users')}>
          Back to Users
        </button>
      </div>
    );
  }

  const canEdit =
    currentUser?.role === 'admin' ||
    (currentUser?.role === 'manager' && user?.role !== 'admin');

  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/users')}>
            <HiOutlineArrowLeft size={20} />
          </button>
          <div>
            <h1>User Details</h1>
            <p>View detailed information about this user.</p>
          </div>
        </div>
        {canEdit && (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/users/${id}/edit`)}
          >
            <HiOutlinePencil size={16} /> Edit User
          </button>
        )}
      </div>

      <div className="card animate-fade-in">
        <div className="card-body">
          {/* User Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
            <div
              className="table-avatar"
              style={{
                width: '72px',
                height: '72px',
                fontSize: 'var(--font-size-2xl)',
                backgroundColor: getAvatarColor(fullName),
              }}
            >
              {getInitials(user?.firstName, user?.lastName)}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
                {fullName}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  <HiOutlineMail size={14} /> {user?.email}
                </span>
                <span className={`badge ${getRoleBadgeClass(user?.role)}`}>{user?.role}</span>
                <span className={`badge ${getStatusBadgeClass(user?.status)}`}>{user?.status}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="detail-grid">
            <div className="detail-section">
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>
                Personal Information
              </h3>
              <div className="detail-row">
                <span className="detail-label">First Name</span>
                <span className="detail-value">{user?.firstName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Name</span>
                <span className="detail-value">{user?.lastName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{user?.email}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>
                Account Details
              </h3>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className="detail-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value" style={{ textTransform: 'capitalize' }}>{user?.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">User ID</span>
                <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                  {user?._id}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Information */}
          <div className="audit-info">
            <h3>
              <HiOutlineCalendar size={14} style={{ marginRight: '6px' }} />
              Audit Trail
            </h3>
            <div className="audit-row">
              <span className="audit-label">Created At</span>
              <span className="audit-value">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="audit-row">
              <span className="audit-label">Created By</span>
              <span className="audit-value">
                {user?.createdBy
                  ? `${user.createdBy.firstName} ${user.createdBy.lastName} (${user.createdBy.email})`
                  : 'System'}
              </span>
            </div>
            <div className="audit-row">
              <span className="audit-label">Last Updated</span>
              <span className="audit-value">{formatDate(user?.updatedAt)}</span>
            </div>
            <div className="audit-row">
              <span className="audit-label">Updated By</span>
              <span className="audit-value">
                {user?.updatedBy
                  ? `${user.updatedBy.firstName} ${user.updatedBy.lastName} (${user.updatedBy.email})`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

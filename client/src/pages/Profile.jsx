import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from '../components/Toast';
import {
  getInitials,
  getAvatarColor,
  getRoleBadgeClass,
  getStatusBadgeClass,
  formatDate,
} from '../utils/roles';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const p = res.data.data.user;
        setProfile(p);
        setFormData({ firstName: p.firstName, lastName: p.lastName, password: '' });
      } catch (err) {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = { ...formData };
      if (!data.password) delete data.password;

      const res = await api.put('/users/profile', data);
      const updated = res.data.data.user;
      setProfile(updated);
      updateUser(updated);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  const fullName = `${profile?.firstName} ${profile?.lastName}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your personal information.</p>
        </div>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="card animate-fade-in">
        <div className="card-body">
          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
            <div
              className="table-avatar"
              style={{
                width: '80px',
                height: '80px',
                fontSize: 'var(--font-size-2xl)',
                backgroundColor: getAvatarColor(fullName),
              }}
            >
              {getInitials(profile?.firstName, profile?.lastName)}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
                {fullName}
              </h2>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {profile?.email}
                </span>
                <span className={`badge ${getRoleBadgeClass(profile?.role)}`}>{profile?.role}</span>
                <span className={`badge ${getStatusBadgeClass(profile?.status)}`}>{profile?.status}</span>
              </div>
            </div>
          </div>

          {editing ? (
            <form className="user-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="p-firstName">First Name</label>
                  <input
                    id="p-firstName"
                    name="firstName"
                    type="text"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="p-lastName">Last Name</label>
                  <input
                    id="p-lastName"
                    name="lastName"
                    type="text"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="p-password">
                  New Password <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(leave blank to keep current)</span>
                </label>
                <input
                  id="p-password"
                  name="password"
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                You cannot change your email, role, or status. Contact an administrator for these changes.
              </p>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <div className="spinner" /> : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setFormData({ firstName: profile.firstName, lastName: profile.lastName, password: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="detail-grid">
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">First Name</span>
                  <span className="detail-value">{profile?.firstName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Name</span>
                  <span className="detail-value">{profile?.lastName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profile?.email}</span>
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Role</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize' }}>{profile?.role}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-value" style={{ textTransform: 'capitalize' }}>{profile?.status}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{formatDate(profile?.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

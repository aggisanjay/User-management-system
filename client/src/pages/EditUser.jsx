import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from '../components/Toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        const u = res.data.data.user;
        setOriginalUser(u);
        setFormData({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          password: '',
          role: u.role,
          status: u.status,
        });
      } catch (err) {
        toast.error('Failed to load user.');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const canChangeRole = currentUser?.role === 'admin';
  const canChangeStatus = currentUser?.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = { ...formData };
      // Don't send empty password
      if (!data.password) delete data.password;
      // Don't send role/status if user can't change them
      if (!canChangeRole) delete data.role;
      if (!canChangeStatus) delete data.status;

      await api.put(`/users/${id}`, data);
      toast.success('User updated successfully!');
      navigate(`/users/${id}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to update user.';
      toast.error(msg);
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

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(`/users/${id}`)}>
            <HiOutlineArrowLeft size={20} />
          </button>
          <div>
            <h1>Edit User</h1>
            <p>Update {originalUser?.firstName}'s account details.</p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in">
        <div className="card-body">
          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="eu-firstName">First Name</label>
                <input
                  id="eu-firstName"
                  name="firstName"
                  type="text"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="eu-lastName">Last Name</label>
                <input
                  id="eu-lastName"
                  name="lastName"
                  type="text"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eu-email">Email Address</label>
              <input
                id="eu-email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eu-password">
                New Password <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(leave blank to keep current)</span>
              </label>
              <input
                id="eu-password"
                name="password"
                type="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="eu-role">Role</label>
                <select
                  id="eu-role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!canChangeRole}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {!canChangeRole && (
                  <span className="form-error" style={{ color: 'var(--color-text-muted)' }}>
                    Only admins can change roles.
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="eu-status">Status</label>
                <select
                  id="eu-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={!canChangeStatus}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <div className="spinner" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/users/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from '../components/Toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoPassword, setAutoPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleAutoPassword = (e) => {
    setAutoPassword(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, password: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!autoPassword && !formData.password) newErrors.password = 'Password is required';
    if (!autoPassword && formData.password && formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = { ...formData };
      if (autoPassword) delete data.password;

      await api.post('/users', data);
      toast.success('User created successfully!');
      navigate('/users');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to create user.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/users')}>
            <HiOutlineArrowLeft size={20} />
          </button>
          <div>
            <h1>Create User</h1>
            <p>Add a new user to the system.</p>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in">
        <div className="card-body">
          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cu-firstName">First Name</label>
                <input
                  id="cu-firstName"
                  name="firstName"
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cu-lastName">Last Name</label>
                <input
                  id="cu-lastName"
                  name="lastName"
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cu-email">Email Address</label>
              <input
                id="cu-email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label" htmlFor="cu-password">Password</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={autoPassword} onChange={handleAutoPassword} />
                  Auto-generate
                </label>
              </div>
              {!autoPassword && (
                <>
                  <input
                    id="cu-password"
                    name="password"
                    type="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                  />
                  {errors.password && <span className="form-error">{errors.password}</span>}
                </>
              )}
              {autoPassword && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  A random password will be generated automatically.
                </p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cu-role">Role</label>
                <select
                  id="cu-role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cu-status">Status</label>
                <select
                  id="cu-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <div className="spinner" /> : 'Create User'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/users')}
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

export default CreateUser;

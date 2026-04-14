import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { toast } from '../components/Toast';
import {
  getRoleBadgeClass,
  getStatusBadgeClass,
  getInitials,
  getAvatarColor,
} from '../utils/roles';
import {
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineUserAdd,
} from 'react-icons/hi';

const UserList = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', '10');
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await api.get(`/users?${params.toString()}`);
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await api.delete(`/users/${deleteModal.user._id}`);
      toast.success(`${deleteModal.user.firstName} has been deactivated.`);
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate user.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage all user accounts in the system.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/users/create')}
          >
            <HiOutlineUserAdd size={16} /> Add User
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {/* Toolbar */}
          <div className="table-toolbar" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
            <div className="search-input-wrapper">
              <HiOutlineSearch className="search-icon" />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="table-filters">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5}>
                        <div className="skeleton" style={{ height: '20px', margin: '4px 0' }} />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: 'center',
                        padding: 'var(--space-2xl)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="table-user-info">
                          <div
                            className="table-avatar"
                            style={{
                              backgroundColor: getAvatarColor(
                                u.firstName + u.lastName
                              ),
                            }}
                          >
                            {getInitials(u.firstName, u.lastName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {u.firstName} {u.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>
                        {u.email}
                      </td>
                      <td>
                        <span
                          className={`badge ${getRoleBadgeClass(u.role)}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(u.status)}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            title="View"
                            onClick={() => navigate(`/users/${u._id}`)}
                          >
                            <HiOutlineEye size={16} />
                          </button>
                          {(currentUser?.role === 'admin' ||
                            (currentUser?.role === 'manager' &&
                              u.role !== 'admin')) && (
                            <button
                              className="btn btn-ghost btn-sm btn-icon"
                              title="Edit"
                              onClick={() => navigate(`/users/${u._id}/edit`)}
                            >
                              <HiOutlinePencil size={16} />
                            </button>
                          )}
                          {currentUser?.role === 'admin' &&
                            u._id !== currentUser?.id && (
                              <button
                                className="btn btn-ghost btn-sm btn-icon"
                                title="Deactivate"
                                onClick={() =>
                                  setDeleteModal({ open: true, user: u })
                                }
                                style={{ color: 'var(--color-error)' }}
                              >
                                <HiOutlineTrash size={16} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: '0 var(--space-xl)' }}>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        title="Deactivate User"
        message={`Are you sure you want to deactivate ${deleteModal.user?.firstName} ${deleteModal.user?.lastName}? They will no longer be able to log in.`}
        confirmText="Deactivate"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, user: null })}
      />
    </div>
  );
};

export default UserList;

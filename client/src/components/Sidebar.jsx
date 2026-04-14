import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import { hasMinRole } from '../utils/roles';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      icon: <HiOutlineViewGrid size={20} />,
      label: 'Dashboard',
      minRole: 'user',
    },
    {
      to: '/users',
      icon: <HiOutlineUsers size={20} />,
      label: 'Users',
      minRole: 'manager',
    },
    {
      to: '/profile',
      icon: <HiOutlineUserCircle size={20} />,
      label: 'My Profile',
      minRole: 'user',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <HiOutlineShieldCheck size={28} />
          <span>UserMS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems
          .filter((item) => hasMinRole(user?.role, item.minRole))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: 'var(--color-accent-gradient)' }}
          >
            {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="sidebar-user-role">{user?.role}</span>
          </div>
        </div>
        <button
          className="btn btn-ghost sidebar-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <HiOutlineLogout size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

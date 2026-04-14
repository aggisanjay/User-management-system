import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineLogout,
  HiOutlineMenu,
} from 'react-icons/hi';
import { getRoleBadgeClass } from '../utils/roles';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="btn btn-ghost navbar-toggle"
          onClick={onToggleSidebar}
        >
          <HiOutlineMenu size={20} />
        </button>
      </div>

      <div className="navbar-right">
        <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
          {user?.role}
        </span>
        <span className="navbar-username">
          {user?.firstName} {user?.lastName}
        </span>
        <button
          className="btn btn-ghost"
          onClick={handleLogout}
          title="Logout"
        >
          <HiOutlineLogout size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

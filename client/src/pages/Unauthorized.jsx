import { useNavigate } from 'react-router-dom';
import { HiOutlineShieldExclamation } from 'react-icons/hi';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <HiOutlineShieldExclamation
        size={64}
        color="var(--color-accent-primary)"
        style={{ marginBottom: 'var(--space-md)' }}
      />
      <div className="error-code">403</div>
      <h2>Access Denied</h2>
      <p>You don't have permission to view this page.</p>
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

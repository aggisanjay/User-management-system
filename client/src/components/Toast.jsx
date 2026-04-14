import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi';

let addToastGlobal = null;

/**
 * Hook to show toasts from anywhere
 */
export const useToast = () => {
  const showToast = useCallback((message, type = 'success') => {
    if (addToastGlobal) {
      addToastGlobal({ message, type });
    }
  }, []);

  return { showToast };
};

/**
 * Imperative toast function for use outside React components
 */
export const toast = {
  success: (message) => addToastGlobal?.({ message, type: 'success' }),
  error: (message) => addToastGlobal?.({ message, type: 'error' }),
  info: (message) => addToastGlobal?.({ message, type: 'info' }),
};

const ToastItem = ({ toast: t, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <HiCheckCircle size={20} color="var(--color-success)" />,
    error: <HiXCircle size={20} color="var(--color-error)" />,
    info: <HiInformationCircle size={20} color="var(--color-info)" />,
  };

  return (
    <div className={`toast toast-${t.type}`}>
      {icons[t.type]}
      <span style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>{t.message}</span>
      <button
        className="btn btn-ghost btn-icon"
        onClick={onRemove}
        style={{ padding: '2px' }}
      >
        <HiX size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastGlobal = ({ message, type }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
    };
    return () => {
      addToastGlobal = null;
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return createPortal(
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;

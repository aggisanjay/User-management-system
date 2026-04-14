export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const ROLE_HIERARCHY = {
  admin: 3,
  manager: 2,
  user: 1,
};

/**
 * Check if a role has at least the given minimum role level
 */
export const hasMinRole = (userRole, minRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minRole] || 0);
};

/**
 * Get color for a role badge
 */
export const getRoleBadgeClass = (role) => {
  const map = {
    admin: 'badge-admin',
    manager: 'badge-manager',
    user: 'badge-user',
  };
  return map[role] || 'badge-user';
};

/**
 * Get color for a status badge
 */
export const getStatusBadgeClass = (status) => {
  return status === 'active' ? 'badge-active' : 'badge-inactive';
};

/**
 * Format a date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get user initials for avatar
 */
export const getInitials = (firstName, lastName) => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
};

/**
 * Get a deterministic color for user avatar based on name
 */
export const getAvatarColor = (name) => {
  const colors = [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
    '#ef4444', '#ec4899', '#3b82f6', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

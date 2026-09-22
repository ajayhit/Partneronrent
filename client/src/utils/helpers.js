export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusBadge(status) {
  switch (status) {
    case 'confirmed':
      return { label: 'Confirmed', className: 'badge-verified' };
    case 'in-progress':
      return { label: 'In Progress', className: 'badge-warning' };
    case 'completed':
      return { label: 'Completed', className: 'badge-verified' };
    case 'pending':
      return { label: 'Pending Acceptance', className: 'badge-warning' };
    case 'declined':
    case 'cancelled':
      return { label: 'Cancelled', className: 'badge-danger' };
    case 'verified':
      return { label: 'Verified', className: 'badge-verified' };
    default:
      return { label: status, className: 'badge-warning' };
  }
}

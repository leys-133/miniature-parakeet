import React from 'react';

/**
 * A simple alert component for displaying friendly messages such as
 * errors, warnings or success notifications. The `type` prop
 * determines the color of the alert (e.g. 'error', 'success').
 */
function Alert({ type = 'info', children }) {
  const baseClasses = 'p-2 rounded mb-2';
  let colorClasses;
  switch (type) {
    case 'error':
      colorClasses = 'bg-red-100 text-red-700';
      break;
    case 'success':
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'warning':
      colorClasses = 'bg-yellow-100 text-yellow-700';
      break;
    default:
      colorClasses = 'bg-blue-100 text-blue-700';
  }
  return <div className={`${baseClasses} ${colorClasses}`}>{children}</div>;
}

export default Alert;
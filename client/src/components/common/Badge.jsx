import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) => {
  const sizeStyle = size === 'sm' ? { fontSize: '0.7rem', padding: '0.15rem 0.45rem' } : {};

  return (
    <span
      className={`badge badge-${variant} ${className}`.trim()}
      style={sizeStyle}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

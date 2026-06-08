import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const variantClasses = {
    primary: 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold',
    success: 'bg-green-50 text-green-900 border border-green-200 font-semibold',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold',
    error: 'bg-red-50 text-red-900 border border-red-200 font-semibold',
    info: 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

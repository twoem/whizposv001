import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${hover ? 'hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer' : 'transition-all duration-300'} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

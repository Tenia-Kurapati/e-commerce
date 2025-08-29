import React from 'react';
import { cn } from '@/lib/utils';

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-600 text-white hover:bg-gray-700",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "text-gray-900 border-gray-300"
  };

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export { Badge };

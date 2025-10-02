import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Button = ({
  children,
  variant = 'default',
  size = 'default',
  onClick,
  className,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:bg-primary-light",
    outline: "border-2 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm",
    ghost: "text-white/80 hover:text-white hover:bg-white/10",
    secondary: "bg-secondary text-white shadow-lg shadow-secondary/25 hover:shadow-xl hover:bg-secondary/90"
  };

  const sizes = {
    default: "h-11 px-6 rounded-lg text-sm",
    sm: "h-9 px-4 rounded-md text-xs",
    lg: "h-12 px-8 rounded-lg text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

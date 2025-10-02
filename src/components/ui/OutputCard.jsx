import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const OutputCard = ({
  title,
  value,
  unit = '',
  subtitle,
  icon,
  variant = 'default',
  className
}) => {
  const variantClasses = {
    default: 'bg-opacity-10 bg-white backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300',
    energy: 'bg-primary/10 border-primary/20 rounded-lg p-4 shadow-primary/5',
    mars: 'bg-secondary/10 border-secondary/20 rounded-lg p-4 shadow-secondary/5',
    cosmic: 'bg-accent/10 border-accent/20 rounded-lg p-4 shadow-accent/5'
  };

  const valueColor = {
    default: 'text-foreground',
    energy: 'text-primary-light',
    mars: 'text-secondary',
    cosmic: 'text-accent'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(variantClasses[variant], className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-bold", valueColor[variant])}>
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 opacity-60">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

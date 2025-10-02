import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const SelectContext = createContext(null);

export const Select = ({
  value,
  onValueChange,
  children
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({
  children,
  className
}) => {
  const context = useContext(SelectContext);
  if (!context) return null;

  return (
    <motion.button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <motion.div
        animate={{ rotate: context.open ? 180 : 0 }}
        className="h-4 w-4 opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </motion.div>
    </motion.button>
  );
};

export const SelectValue = () => {
  const context = useContext(SelectContext);
  if (!context) return null;

  return <span>{context.value}</span>;
};

export const SelectContent = ({
  children,
  className
}) => {
  const context = useContext(SelectContext);
  if (!context) return null;

  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "top-full left-0 w-full mt-1",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SelectItem = ({
  value,
  children,
  className
}) => {
  const context = useContext(SelectContext);
  if (!context) return null;

  return (
    <motion.div
      whileHover={{ backgroundColor: 'hsl(var(--accent))' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        context.onValueChange(value);
        context.setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        context.value === value && "bg-accent text-accent-foreground",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const Slider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  color = 'primary',
  className
}) => {
  const colorClasses = {
    primary: 'slider-primary',
    secondary: 'slider-secondary',
    mars: 'slider-mars',
    cosmic: 'slider-cosmic',
    energy: 'slider-energy'
  };

  const colorMap = {
    mars: '#ea7558',
    cosmic: '#22d3ee',
    energy: '#fbbf24',
    primary: '#3b82f6',
    secondary: '#6b7280'
  };

  const currentColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-6", className)}
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <label className="text-base dashboard2-slider-label tracking-wide">
          {label}
        </label>
        <div className="bg-gradient-to-r from-slate-700/90 to-slate-600/80 backdrop-blur-sm rounded-lg px-5 py-2.5 border border-slate-500/40 shadow-lg">
          <span className="dashboard2-slider-value text-lg">
            {value.toFixed(0)}<span className="text-sm dashboard2-slider-unit ml-1">{unit}</span>
          </span>
        </div>
      </div>
      <div className="relative px-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-input shadow-inner"
          style={{
            background: `linear-gradient(to right, ${currentColor} 0%, ${currentColor} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.15) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.15) 100%)`,
          }}
        />
      </div>
    </motion.div>
  );
};

import React from 'react';
import { styled } from '@mui/material/styles';
import { Slider as MuiSlider, Box, Typography } from '@mui/material';

const StyledSlider = styled(MuiSlider)(({ color = '#00ffff' }) => ({
  height: 4,
  padding: '15px 0',
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    backgroundColor: color,
    border: 'none',
    boxShadow: `0 0 10px ${color}40`,
  },
  '& .MuiSlider-thumb': {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    boxShadow: `0 0 0 2px ${color}`,
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 3px ${color}`,
    },
    '&.Mui-active': {
      boxShadow: `0 0 0 4px ${color}`,
    },
  },
}));

export const CustomSlider = ({ 
  label, 
  value, 
  unit = '', 
  color = '#00ffff',
  ...props 
}) => {
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1
      }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {label}
        </Typography>
        <Typography sx={{ 
          color: color,
          fontWeight: 500
        }}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          {unit && ` ${unit}`}
        </Typography>
      </Box>
      <StyledSlider
        value={value}
        color={color}
        {...props}
      />
    </Box>
  );
};
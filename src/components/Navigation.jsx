import React from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledTabs = styled(Tabs)({
  minHeight: '60px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTab-root': {
    minHeight: '60px',
    padding: '8px 24px',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#00ffff',
    },
  },
});

const TabPanel = styled(Box)({
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '12px',
  padding: '12px 24px',
  marginBottom: '24px',
});

const Logo = () => (
  <Typography
    component="h1"
    sx={{
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#00ffff',
      textAlign: 'center',
      mb: 2
    }}
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Waste
    </motion.span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ color: '#ff6b35' }}
    >
      2
    </motion.span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{ color: '#00ff88' }}
    >
      Watt
    </motion.span>
  </Typography>
);

export const Navigation = ({ value, onChange }) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Logo />
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(0, 255, 255, 0.1)' }}>
        <StyledTabs 
          value={value} 
          onChange={onChange}
          centered
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span role="img" aria-label="trash">🗑️</span>
                Trash Processing
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span role="img" aria-label="bricks">🧱</span>
                Regolith & Bricks
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span role="img" aria-label="chart">📊</span>
                System Summary
              </Box>
            }
          />
        </StyledTabs>
      </Box>
    </Box>
  );
};
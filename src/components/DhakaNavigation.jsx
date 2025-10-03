import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const DhakaNavigation = ({ currentPage }) => {
  const navigateToMain = () => {
    window.location.hash = '#/';
  };

  const navigateToDhakaDashboard = () => {
    window.location.hash = '#/dhakadashboard';
  };

  const navigateToDhakaFlowchart = () => {
    window.location.hash = '#/dhakaflowchart';
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Logo */}
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

      {/* Navigation Buttons - Only show relevant button for each page */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          borderBottom: 1, 
          borderColor: 'rgba(0, 255, 255, 0.1)',
          pb: 2
        }}
      >
        {currentPage === 'dashboard' && (
          <Button
            onClick={navigateToMain}
            variant="outlined"
            sx={{
              borderColor: 'rgba(0, 255, 255, 0.3)',
              color: '#00ffff',
              '&:hover': {
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
              }
            }}
          >
            🏠 Main Dashboard
          </Button>
        )}
        
        {currentPage === 'flowchart' && (
          <Button
            onClick={navigateToMain}
            variant="outlined"
            sx={{
              borderColor: 'rgba(0, 255, 255, 0.3)',
              color: '#00ffff',
              '&:hover': {
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
              }
            }}
          >
            � Main Dashboard
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DhakaNavigation;
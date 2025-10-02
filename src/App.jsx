import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { SystemProvider } from './context/SystemContext';
import Dashboard1 from './components/Dashboard1';
import Dashboard2 from './components/Dashboard2';
import Dashboard3 from './components/Dashboard3';
import { Navigation } from './components/Navigation';
import html2canvas from 'html2canvas';

import { theme } from './styles/theme';

function App() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const exportDashboard = async () => {
    const element = document.querySelector('.dashboard-content');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = 'waste2watt-dashboard.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SystemProvider>
        <Box 
          sx={{ 
            minHeight: '100vh', 
            bgcolor: 'background.default',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
          }}
        >
          <Box 
            sx={{ 
              maxWidth: '1440px', 
              margin: '0 auto',
              padding: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
              }}
            >
              <Navigation value={tab} onChange={handleChange} />
              
              <Box 
                className="dashboard-content"
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }
                }}
              >
                {tab === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard1 />
                  </motion.div>
                )}
                {tab === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard2 />
                  </motion.div>
                )}
                {tab === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard3 />
                  </motion.div>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={exportDashboard}
                  sx={{
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                    color: '#00ffff',
                    '&:hover': {
                      borderColor: '#00ffff',
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    }
                  }}
                >
                  Export Dashboard
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </SystemProvider>
    </ThemeProvider>
  );
}

export default App;

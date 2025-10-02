import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.jsx'
import Flowchart from './components/Flowchart.jsx'

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Mount the main dashboard to root-dashboard div
  const dashboardContainer = document.getElementById('root-dashboard');
  if (dashboardContainer) {
    const dashboardRoot = createRoot(dashboardContainer);
    dashboardRoot.render(
      <StrictMode>
        <CssBaseline />
        <App />
      </StrictMode>
    );
  }

  // Mount the flowchart to root-flowchart div
  const flowchartContainer = document.getElementById('root-flowchart');
  if (flowchartContainer) {
    const flowchartRoot = createRoot(flowchartContainer);
    flowchartRoot.render(
      <div style={{ 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, #0a0f1a, #1a1f2e)',
        fontFamily: 'Inter, system-ui, Arial, sans-serif',
        borderRadius: '16px'
      }}>
        <Flowchart />
      </div>
    );
  }

  // Keep the original root mounting for backward compatibility
  const rootContainer = document.getElementById('root');
  if (rootContainer && !dashboardContainer && !flowchartContainer) {
    // Only mount to root if we're not in the integrated page
    const isFlowchartRoute = window.location.pathname === '/flowchart' || window.location.hash === '#flowchart';
    
    const AppToRender = isFlowchartRoute ? (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #0a0f1a, #1a1f2e)',
        fontFamily: 'Inter, system-ui, Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Flowchart />
      </div>
    ) : (
      <StrictMode>
        <CssBaseline />
        <App />
      </StrictMode>
    );

    createRoot(rootContainer).render(AppToRender);
  }
});

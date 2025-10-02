import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.jsx'
import Flowchart from './components/Flowchart.jsx'

// Check URL path to determine which component to render
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

createRoot(document.getElementById('root')).render(AppToRender)

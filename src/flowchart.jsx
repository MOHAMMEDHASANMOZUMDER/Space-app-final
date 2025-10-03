import React from 'react';
import { createRoot } from 'react-dom/client';
import Flowchart from '../public/Flowchart';
import './index.css';

// Create a standalone flowchart app for embedding
function FlowchartApp() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'transparent',
      fontFamily: 'Inter, system-ui, Arial, sans-serif'
    }}>
      <Flowchart />
    </div>
  );
}

// Check if we're in the flowchart container
const flowchartContainer = document.getElementById('react-flow-diagram');
if (flowchartContainer) {
  const root = createRoot(flowchartContainer);
  root.render(<FlowchartApp />);
}

export default FlowchartApp;
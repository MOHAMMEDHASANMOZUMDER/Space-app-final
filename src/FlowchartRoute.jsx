import React from 'react';
import Flowchart from './components/Flowchart';

export default function FlowchartRoute() {
  return (
    <div style={{ 
      width: '100%', 
      height: '650px', 
      background: 'linear-gradient(135deg, #0a0f1a, #1a1f2e)', 
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 107, 53, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
    }}>
      <Flowchart />
    </div>
  );
}
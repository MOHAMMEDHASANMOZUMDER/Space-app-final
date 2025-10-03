import React, { useState, useEffect } from 'react';

const DhakaFlowchart = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isFlowchartEnlarged, setIsFlowchartEnlarged] = useState(false);

  // Component specifications for M-REGS-P Dhaka
  const componentSpecs = {
    'plastic-intake': {
      name: 'Plastic Waste Intake System',
      capacity: '50-500 kg/day',
      materials: 'Stainless Steel 316L',
      dimensions: '2.5m × 1.8m × 1.2m',
      power: '2.5 kW (conveyor system)',
      efficiency: '95% sorting accuracy',
      maintenance: 'Weekly cleaning, monthly calibration'
    },
    'shredder': {
      name: 'Plastic Shredding Unit',
      capacity: '400 kg/hr processing rate',
      materials: 'Hardened Steel Blades',
      dimensions: '1.8m × 1.2m × 1.5m',
      power: '15 kW motor drive',
      efficiency: '98% size reduction',
      maintenance: 'Blade replacement every 6 months'
    },
    'washing': {
      name: 'Automated Washing System',
      capacity: '15L water per kg plastic',
      materials: 'Corrosion-resistant coating',
      dimensions: '3.0m × 2.0m × 1.8m',
      power: '8 kW (pumps + heating)',
      efficiency: '90% contaminant removal',
      maintenance: 'Filter cleaning daily'
    },
    'drying': {
      name: 'Thermal Drying Chamber',
      capacity: '300 kg/batch',
      materials: 'Insulated steel chamber',
      dimensions: '2.2m × 1.5m × 2.0m',
      power: '12 kW heating elements',
      efficiency: '92% moisture removal',
      maintenance: 'Monthly thermal calibration'
    },
    'sofc': {
      name: 'Solid Oxide Fuel Cell (SOFC)',
      capacity: '2.5 kWh per kg plastic',
      materials: 'Yttria-stabilized zirconia',
      dimensions: '1.5m × 1.0m × 1.8m',
      power: '50 kW output capacity',
      efficiency: '60% electrical conversion',
      maintenance: 'Quarterly electrode inspection'
    },
    'thermal-recovery': {
      name: 'Thermal Recovery Loop',
      capacity: '35% waste heat capture',
      materials: 'Heat-resistant alloys',
      dimensions: '4.0m piping network',
      power: '3 kW circulation pumps',
      efficiency: '80% heat reuse',
      maintenance: 'Biannual system flush'
    },
    'solar-panels': {
      name: 'Solar Panel Array',
      capacity: '50 m² installation',
      materials: 'Monocrystalline silicon',
      dimensions: '10m × 5m array',
      power: '9 kW peak generation',
      efficiency: '18% conversion rate',
      maintenance: 'Monthly cleaning required'
    },
    'water-recycling': {
      name: 'Water Recycling System',
      capacity: '85% water recovery rate',
      materials: 'Membrane filtration',
      dimensions: '2.0m × 1.5m × 2.5m',
      power: '5 kW filtration pumps',
      efficiency: '99.5% purity restoration',
      maintenance: 'Filter replacement monthly'
    }
  };

  const handleComponentClick = (componentId) => {
    setSelectedComponent(componentId);
  };

  const toggleFlowchartSize = () => {
    setIsFlowchartEnlarged(!isFlowchartEnlarged);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-teal-500/30 shadow-2xl shadow-teal-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg text-shadow" style={{color: '#ffffff !important', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                M-REGS-P System Architecture
              </h1>
              <p className="text-teal-300 font-medium mt-2 text-shadow">
                Dhaka Plastic Recycling & Energy Generation Flow
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-300 text-shadow">🌱 Sustainable Design</div>
              <div className="text-teal-400 text-shadow">Self-Sufficient • Water Recycling • Solar Powered</div>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative bg-gradient-to-br from-emerald-600/90 to-teal-700/90 rounded-xl p-4 text-white shadow-2xl shadow-emerald-500/30 border border-emerald-400/20 backdrop-blur-sm">
            <div className="text-3xl mb-2 drop-shadow-lg">♻️</div>
            <h3 className="font-bold text-lg text-shadow">Plastic Processing</h3>
            <p className="text-emerald-100 text-sm text-shadow">Sort → Shred → Wash → Dry</p>
            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-orange-600/90 to-red-700/90 rounded-xl p-4 text-white shadow-2xl shadow-orange-500/30 border border-orange-400/20 backdrop-blur-sm">
            <div className="text-3xl mb-2 drop-shadow-lg">⚡</div>
            <h3 className="font-bold text-lg text-shadow">Energy Generation</h3>
            <p className="text-orange-100 text-sm text-shadow">SOFC + Solar + Thermal</p>
            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-blue-600/90 to-cyan-700/90 rounded-xl p-4 text-white shadow-2xl shadow-blue-500/30 border border-blue-400/20 backdrop-blur-sm">
            <div className="text-3xl mb-2 drop-shadow-lg">💧</div>
            <h3 className="font-bold text-lg text-shadow">Water Management</h3>
            <p className="text-blue-100 text-sm text-shadow">85% Recycling Rate</p>
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-purple-600/90 to-indigo-700/90 rounded-xl p-4 text-white shadow-2xl shadow-purple-500/30 border border-purple-400/20 backdrop-blur-sm">
            <div className="text-3xl mb-2 drop-shadow-lg">🌐</div>
            <h3 className="font-bold text-lg text-shadow">Smart Controls</h3>
            <p className="text-purple-100 text-sm text-shadow">NASA API + Dashboard</p>
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Flowchart */}
        <div className="bg-gradient-to-br from-slate-800/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-teal-500/30 shadow-2xl shadow-teal-500/20">
          <h2 className="text-2xl font-bold text-teal-300 mb-6 text-center text-shadow">
            System Process Flow Diagram
          </h2>
          
          <div className="flowchart-container w-full">
            <div className="relative group w-full">
              <img 
                src="/dhflow.png" 
                alt="Dhaka Plastic Recycling System Flow Diagram"
                className={`flowchart-image rounded-lg shadow-2xl transition-all duration-300 cursor-pointer hover:shadow-teal-500/30 ${
                  isFlowchartEnlarged 
                    ? 'fixed inset-6 z-50 max-w-none max-h-none bg-slate-900/95 backdrop-blur-sm' 
                    : ''
                }`}
                onClick={toggleFlowchartSize}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  border: '2px solid rgba(20, 184, 166, 0.3)'
                }}
              />
              
              {/* Click to enlarge hint */}
              {!isFlowchartEnlarged && (
                <div className="absolute top-4 right-4 bg-teal-600/90 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  🔍 Click to enlarge
                </div>
              )}
              
              {/* Close button for enlarged view */}
              {isFlowchartEnlarged && (
                <button
                  onClick={toggleFlowchartSize}
                  className="fixed top-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors duration-200 shadow-lg"
                  aria-label="Close enlarged view"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Component Grid */}
        <div className="bg-gradient-to-br from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/30 shadow-2xl shadow-teal-500/10">
          <h2 className="text-2xl font-bold text-teal-300 mb-6 text-shadow">System Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(componentSpecs).map(([key, spec]) => (
              <button
                key={key}
                onClick={() => handleComponentClick(key)}
                className={`p-4 rounded-lg border transition-all duration-300 text-left transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  selectedComponent === key
                    ? 'border-teal-500 shadow-lg shadow-teal-500/25'
                    : 'border-slate-500 hover:border-teal-400 hover:shadow-md'
                }`}
                style={{
                  background: selectedComponent === key 
                    ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' 
                    : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                  color: '#ffffff',
                  boxShadow: selectedComponent === key
                    ? '0 4px 12px rgba(13, 148, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                <h3 className="font-bold text-teal-300 text-sm mb-2 text-shadow">{spec.name}</h3>
                <p className="text-teal-400 text-xs">{spec.capacity}</p>
              </button>
            ))}
          </div>

          {/* Component Details */}
          {selectedComponent && (
            <div className="rounded-xl p-6 border border-teal-400/30 backdrop-blur-sm shadow-2xl shadow-teal-500/20" style={{backgroundColor: 'rgba(30, 41, 59, 0.95)'}}>
              <h3 className="text-xl font-bold text-teal-300 mb-4 text-shadow">
                {componentSpecs[selectedComponent].name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 rounded-lg p-4 border border-emerald-500/30 shadow-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)'}}>
                  <h4 className="font-semibold text-emerald-300 mb-2 text-shadow">Capacity</h4>
                  <p className="text-emerald-200">{componentSpecs[selectedComponent].capacity}</p>
                </div>
                
                <div className="bg-slate-900/80 rounded-lg p-4 border border-blue-500/30 shadow-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)'}}>
                  <h4 className="font-semibold text-blue-300 mb-2 text-shadow">Materials</h4>
                  <p className="text-blue-200">{componentSpecs[selectedComponent].materials}</p>
                </div>
                
                <div className="bg-slate-900/80 rounded-lg p-4 border border-purple-500/30 shadow-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)'}}>
                  <h4 className="font-semibold text-purple-300 mb-2 text-shadow">Dimensions</h4>
                  <p className="text-purple-200">{componentSpecs[selectedComponent].dimensions}</p>
                </div>
                
                <div className="bg-slate-900/80 rounded-lg p-4 border border-orange-500/30 shadow-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)'}}>
                  <h4 className="font-semibold text-orange-300 mb-2 text-shadow">Power Req.</h4>
                  <p className="text-orange-200">{componentSpecs[selectedComponent].power}</p>
                </div>
                
                <div className="bg-slate-900/80 rounded-lg p-4 border border-yellow-500/30 shadow-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)'}}>
                  <h4 className="font-semibold text-yellow-300 mb-2 text-shadow">Efficiency</h4>
                  <p className="text-yellow-200">{componentSpecs[selectedComponent].efficiency}</p>
                </div>
                
                <div className="bg-slate-900/80 rounded-lg p-4 border border-red-500/30 shadow-lg" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)'}}>
                  <h4 className="font-semibold text-red-300 mb-2 text-shadow">Maintenance</h4>
                  <p className="text-red-200">{componentSpecs[selectedComponent].maintenance}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
            <h3 className="text-lg font-bold text-emerald-300 mb-4 text-shadow">🌱 Sustainability Features</h3>
            <ul className="space-y-2 text-emerald-200">
              <li className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>85% water recycling rate</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>80% thermal energy reuse</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>Solar-powered operations</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>Zero liquid discharge</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>Carbon footprint reduction</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 shadow-2xl shadow-blue-500/10">
            <h3 className="text-lg font-bold text-blue-300 mb-4 text-shadow">🎯 Performance Metrics</h3>
            <ul className="space-y-2 text-blue-200">
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>250 kg/day average throughput</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>95% plastic sorting accuracy</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>2.5 kWh energy per kg plastic</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>60% energy self-sufficiency</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>24/7 automated operation</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-2xl shadow-purple-500/10">
            <h3 className="text-lg font-bold text-purple-300 mb-4 text-shadow">🔧 Smart Integration</h3>
            <ul className="space-y-2 text-purple-200">
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>NASA weather API integration</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>Real-time performance monitoring</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>Predictive maintenance alerts</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>Mobile dashboard access</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>Cloud data synchronization</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        /* Custom animations */
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(20, 184, 166, 0.5), 0 0 10px rgba(20, 184, 166, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px rgba(20, 184, 166, 0.8), 0 0 30px rgba(20, 184, 166, 0.4);
          }
        }
        
        .animate-glow {
          animation: glow 2s infinite;
        }
        
        /* Glassmorphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Gradient text animation */
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        /* Hover effects for interactive elements */
        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(20, 184, 166, 0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        /* Pulse animation for status indicators */
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.8);
        }
        
        /* Flowchart image styles */
        .flowchart-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        
        .flowchart-image {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 100%;
          height: auto;
          object-fit: contain;
          background: transparent;
        }
        
        .flowchart-image:hover {
          transform: scale(1.005);
          box-shadow: 0 12px 30px rgba(20, 184, 166, 0.4);
        }
        
        /* Optimal sizing for the wide flowchart format */
        .flowchart-image:not(.fixed) {
          max-width: 100%;
          width: 100%;
          height: auto;
          min-height: 400px;
        }
        
        /* Enhanced enlarged view */
        .flowchart-image.fixed {
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }
        
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .flowchart-image:not(.fixed) {
            min-height: 350px;
          }
        }
        
        @media (max-width: 768px) {
          .flowchart-image:not(.fixed) {
            min-height: 300px;
          }
          
          .flowchart-image.fixed {
            padding: 10px;
          }
        }
        
        /* Prevent image overflow */
        .flowchart-image {
          display: block;
          margin: 0 auto;
        }
        
        .enlarged-overlay {
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Force all text to be visible */
        * {
          color: #ffffff !important;
        }
        
        /* Allow gradient text to remain transparent */
        .bg-clip-text {
          color: transparent !important;
        }
        
        /* Professional button styling */
        button {
          font-weight: 600 !important;
          color: #ffffff !important;
          border: none !important;
          cursor: pointer !important;
        }
        
        button:hover {
          transform: translateY(-1px) !important;
        }
        
        button:active {
          transform: translateY(0) !important;
        }
        
        /* Force component detail boxes to have dark backgrounds */
        .grid > div {
          background-color: rgba(15, 23, 42, 0.95) !important;
        }
        
        /* Override any white or light backgrounds */
        .bg-white, .bg-gray-50, .bg-gray-100, .bg-slate-50, .bg-slate-100 {
          background-color: rgba(30, 41, 59, 0.9) !important;
        }
      `}</style>
    </div>
  );
};

export default DhakaFlowchart;
       
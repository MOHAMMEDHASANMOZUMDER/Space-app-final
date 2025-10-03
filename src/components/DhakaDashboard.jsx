import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const DhakaDashboard = () => {
  // Core operational state
  const [wasteIntake, setWasteIntake] = useState(250); // kg/day
  const [projectionDays, setProjectionDays] = useState(7);
  const [diversionOverride, setDiversionOverride] = useState(false);
  
  // Location and weather data
  const [latitude, setLatitude] = useState(23.8103); // Dhaka coordinates
  const [longitude, setLongitude] = useState(90.4125);
  const [solarIrradiance, setSolarIrradiance] = useState(5.2); // kWh/m²/day
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // NASA API integration
  const fetchNASAWeatherData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude}&latitude=${latitude}&start=20230101&end=20231231&format=JSON`
      );
      const data = await response.json();
      
      if (data.properties && data.properties.parameter && data.properties.parameter.ALLSKY_SFC_SW_DWN) {
        const irradianceValues = Object.values(data.properties.parameter.ALLSKY_SFC_SW_DWN);
        const avgIrradiance = irradianceValues.reduce((sum, val) => sum + val, 0) / irradianceValues.length;
        setSolarIrradiance(avgIrradiance);
        setWeatherData(data);
      }
    } catch (error) {
      console.error('NASA API Error:', error);
    }
    setLoading(false);
  };

  // Calculate comprehensive system metrics
  const calculateMetrics = () => {
    const dailyWaste = wasteIntake;
    const totalWaste = dailyWaste * projectionDays;
    
    // Processing stages with efficiency factors
    const plasticSorted = dailyWaste * 0.95; // 95% sorting efficiency
    const plasticShredded = plasticSorted * 0.98; // 98% shredding efficiency
    const plasticWashed = plasticShredded * 0.92; // 92% washing efficiency (contaminant removal)
    const plasticDried = plasticWashed * 0.96; // 96% drying efficiency
    
    // Energy generation from plastic via SOFC
    const solfcInput = plasticDried * 0.6; // 60% goes to SOFC
    const solfcEnergyDaily = solfcInput * 2.5; // kWh per kg plastic
    const solfcEnergyTotal = solfcEnergyDaily * projectionDays;
    
    // Thermal energy recovery
    const thermalRecovery = solfcEnergyDaily * 0.35; // 35% thermal recovery
    const thermalReuse = thermalRecovery * 0.80; // 80% thermal reuse efficiency
    
    // Solar energy generation
    const solarPanelArea = 50; // m² solar panel array
    const solarEnergyDaily = solarPanelArea * solarIrradiance * 0.18; // 18% panel efficiency
    const solarEnergyTotal = solarEnergyDaily * projectionDays;
    
    // Total energy and sustainability metrics
    const totalEnergyDaily = solfcEnergyDaily + thermalReuse + solarEnergyDaily;
    const totalEnergyProjection = totalEnergyDaily * projectionDays;
    
    // Water recycling calculations
    const waterUsed = plasticWashed * 15; // 15L per kg for washing
    const waterRecycled = waterUsed * 0.85; // 85% water recycling rate
    const waterWasted = waterUsed - waterRecycled;
    
    // Sustainability percentages
    const energySelfSufficiency = Math.min(((solfcEnergyDaily + thermalReuse + solarEnergyDaily) / (dailyWaste * 3)) * 100, 100);
    const wasteUtilization = (plasticDried / dailyWaste) * 100;
    const waterRecyclingRate = (waterRecycled / waterUsed) * 100;
    
    return {
      dailyWaste,
      totalWaste,
      plasticProcessed: plasticDried,
      solfcEnergy: solfcEnergyTotal,
      thermalEnergy: thermalReuse * projectionDays,
      solarEnergy: solarEnergyTotal,
      totalEnergy: totalEnergyProjection,
      waterRecycled,
      waterWasted,
      energySelfSufficiency,
      wasteUtilization,
      waterRecyclingRate
    };
  };

  const metrics = calculateMetrics();

  const energyBreakdown = [
    { name: 'SOFC Generation', value: metrics.solfcEnergy, color: '#10b981' },
    { name: 'Thermal Recovery', value: metrics.thermalEnergy, color: '#f59e0b' },
    { name: 'Solar Generation', value: metrics.solarEnergy, color: '#3b82f6' }
  ];

  const sustainabilityData = [
    { metric: 'Energy Self-Sufficiency', percentage: metrics.energySelfSufficiency },
    { metric: 'Waste Utilization', percentage: metrics.wasteUtilization },
    { metric: 'Water Recycling', percentage: metrics.waterRecyclingRate }
  ];

  const dailyTrend = Array.from({ length: projectionDays }, (_, i) => ({
    day: i + 1,
    energy: metrics.totalEnergy / projectionDays,
    waste: metrics.dailyWaste,
    efficiency: metrics.energySelfSufficiency
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/95 to-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border border-emerald-400/30 shadow-2xl shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white drop-shadow-2xl" style={{color: '#ffffff !important', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                M-REGS-P Dhaka Control Center
              </h1>
              <p className="text-emerald-200 font-semibold mt-3 text-lg drop-shadow-lg">
                Mars Recycling & Energy Generation System - Plastic Optimized
              </p>
            </div>
            <div className="flex items-center space-x-6 bg-emerald-500/10 rounded-2xl p-4 border border-emerald-400/20">
              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-emerald-200 font-bold text-lg">System Online</span>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Waste Intake Control */}
          <div className="bg-gradient-to-br from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/30 shadow-2xl shadow-emerald-500/10 space-y-6">
            <h3 className="text-2xl font-bold text-emerald-200 mb-6 drop-shadow-lg">Waste Intake Control</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-emerald-100 font-semibold mb-3 text-lg drop-shadow">
                  Daily Plastic Intake: <span className="text-emerald-300 font-bold text-xl">{wasteIntake} kg/day</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={wasteIntake}
                  onChange={(e) => setWasteIntake(Number(e.target.value))}
                  className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-enhanced"
                />
                <div className="flex justify-between text-emerald-300 mt-2 font-semibold">
                  <span>50 kg</span>
                  <span>500 kg</span>
                </div>
              </div>
              
              <div>
                <label className="block text-emerald-100 font-semibold mb-3 text-lg drop-shadow">
                  Projection Period: <span className="text-emerald-300 font-bold text-xl">{projectionDays} days</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={projectionDays}
                  onChange={(e) => setProjectionDays(Number(e.target.value))}
                  className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-enhanced"
                />
                <div className="flex justify-between text-emerald-300 mt-2 font-semibold">
                  <span>1 day</span>
                  <span>30 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* NASA Weather Integration */}
          <div className="bg-gradient-to-br from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-500/10 space-y-6">
            <h3 className="text-2xl font-bold text-cyan-200 mb-6 drop-shadow-lg">NASA Weather API</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-cyan-100 font-semibold mb-3 text-lg drop-shadow">
                  Solar Irradiance: <span className="text-cyan-300 font-bold text-xl">{solarIrradiance.toFixed(1)} kWh/m²/day</span>
                </label>
                <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-400/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-200 font-semibold">Location:</span>
                    <span className="text-cyan-100">Dhaka, Bangladesh</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-200 font-semibold">Coordinates:</span>
                    <span className="text-cyan-100">{latitude}°N, {longitude}°E</span>
                  </div>
                  <button
                    onClick={fetchNASAWeatherData}
                    disabled={loading}
                    className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: loading 
                        ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' 
                        : 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                      color: '#ffffff',
                      boxShadow: loading
                        ? '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 4px 12px rgba(8, 145, 178, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {loading ? 'Fetching NASA Data...' : 'Update Solar Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Controls */}
          <div className="bg-gradient-to-br from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/10 space-y-6">
            <h3 className="text-2xl font-bold text-purple-200 mb-6 drop-shadow-lg">System Controls</h3>
            <div className="space-y-6">
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/20">
                <button
                  onClick={() => setDiversionOverride(!diversionOverride)}
                  className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                  style={{
                    background: diversionOverride 
                      ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' 
                      : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: '#ffffff',
                    boxShadow: diversionOverride
                      ? '0 4px 12px rgba(124, 58, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 4px 12px rgba(100, 116, 139, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {diversionOverride ? 'Manual Control: ON' : 'Auto Control: ON'}
                </button>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-xl mt-4">
                  <span className="text-purple-100 font-semibold text-lg drop-shadow">Processing Mode</span>
                  <span className="text-purple-200 bg-purple-500/20 border border-purple-400/30 px-4 py-2 rounded-full font-bold shadow-lg">
                    {diversionOverride ? 'Manual' : 'Auto'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-600/90 to-teal-700/90 rounded-2xl p-6 text-white shadow-2xl shadow-emerald-500/30 border border-emerald-300/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-300/10 rounded-full -mr-10 -mt-10"></div>
            <h4 className="text-emerald-100 font-semibold mb-2 drop-shadow">Total Energy Output</h4>
            <p className="text-3xl font-bold drop-shadow-lg mb-1">{metrics.totalEnergy.toFixed(1)} kWh</p>
            <p className="text-emerald-200 drop-shadow">{projectionDays} day projection</p>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600/90 to-blue-700/90 rounded-2xl p-6 text-white shadow-2xl shadow-cyan-500/30 border border-cyan-300/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-300/10 rounded-full -mr-10 -mt-10"></div>
            <h4 className="text-cyan-100 font-semibold mb-2 drop-shadow">Plastic Processed</h4>
            <p className="text-3xl font-bold drop-shadow-lg mb-1">{metrics.plasticProcessed.toFixed(1)} kg</p>
            <p className="text-cyan-200 drop-shadow">Daily capacity</p>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-cyan-300 rounded-full animate-pulse"></div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600/90 to-red-700/90 rounded-2xl p-6 text-white shadow-2xl shadow-orange-500/30 border border-orange-300/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-300/10 rounded-full -mr-10 -mt-10"></div>
            <h4 className="text-orange-100 font-semibold mb-2 drop-shadow">Water Recycled</h4>
            <p className="text-3xl font-bold drop-shadow-lg mb-1">{(metrics.waterRecycled/1000).toFixed(2)} m³</p>
            <p className="text-orange-200 drop-shadow">{projectionDays} day total</p>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-orange-300 rounded-full animate-pulse"></div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/90 to-indigo-700/90 rounded-2xl p-6 text-white shadow-2xl shadow-purple-500/30 border border-purple-300/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-300/10 rounded-full -mr-10 -mt-10"></div>
            <h4 className="text-purple-100 font-semibold mb-2 drop-shadow">Self-Sufficiency</h4>
            <p className="text-3xl font-bold drop-shadow-lg mb-1">{metrics.energySelfSufficiency.toFixed(1)}%</p>
            <p className="text-purple-200 drop-shadow">Energy independence</p>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Energy Breakdown */}
          <div className="bg-gradient-to-br from-slate-700/90 to-slate-600/90 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/50 shadow-2xl shadow-emerald-500/20" style={{backgroundColor: 'rgba(51, 65, 85, 0.95)'}}>
            <h3 className="text-2xl font-bold text-emerald-200 mb-6 drop-shadow-lg">Energy Generation Breakdown</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={energyBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)} kWh`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#1e293b"
                  strokeWidth={2}
                >
                  {energyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid #10b981',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    color: '#e2e8f0',
                    fontWeight: 'bold'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sustainability Metrics */}
          <div className="bg-gradient-to-br from-slate-700/90 to-slate-600/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/50 shadow-2xl shadow-blue-500/20" style={{backgroundColor: 'rgba(51, 65, 85, 0.95)'}}>
            <h3 className="text-2xl font-bold text-blue-200 mb-6 drop-shadow-lg">Sustainability Metrics</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sustainabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12, fill: '#e2e8f0', fontWeight: 'bold' }} 
                  axisLine={{ stroke: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#e2e8f0', fontWeight: 'bold' }}
                  axisLine={{ stroke: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(51, 65, 85, 0.98)', 
                    border: '2px solid #3b82f6',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="url(#sustainabilityGradient)" 
                  radius={[8, 8, 0, 0]}
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="sustainabilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Trends */}
        <div className="bg-gradient-to-br from-slate-700/90 to-slate-600/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/50 shadow-2xl shadow-purple-500/20" style={{backgroundColor: 'rgba(51, 65, 85, 0.95)'}}>
          <h3 className="text-2xl font-bold text-purple-200 mb-6 drop-shadow-lg">Daily Performance Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#e2e8f0', fontWeight: 'bold' }}
                axisLine={{ stroke: '#6b7280' }}
                tickLine={{ stroke: '#6b7280' }}
              />
              <YAxis 
                tick={{ fill: '#e2e8f0', fontWeight: 'bold' }}
                axisLine={{ stroke: '#6b7280' }}
                tickLine={{ stroke: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                  border: '1px solid #8b5cf6',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  color: '#e2e8f0',
                  fontWeight: 'bold'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2, fill: '#7c3aed' }}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .drop-shadow {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        
        .drop-shadow-lg {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));
        }
        
        .drop-shadow-2xl {
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.8));
        }
        
        .slider-enhanced::-webkit-slider-thumb {
          appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          box-shadow: 0 6px 12px rgba(16, 185, 129, 0.5), 0 0 0 3px rgba(16, 185, 129, 0.2);
          border: 3px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .slider-enhanced::-webkit-slider-thumb:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: scale(1.2);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.7), 0 0 0 4px rgba(16, 185, 129, 0.3);
        }
        
        .slider-enhanced::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 6px 12px rgba(16, 185, 129, 0.5);
          transition: all 0.3s ease;
        }
        
        .slider-enhanced::-moz-range-thumb:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: scale(1.2);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.7);
        }
        
        .slider-enhanced::-webkit-slider-track {
          background: linear-gradient(90deg, #334155, #475569);
          border-radius: 8px;
          box-shadow: inset 0 3px 6px rgba(0,0,0,0.4);
        }
        
        .slider-enhanced::-moz-range-track {
          background: linear-gradient(90deg, #334155, #475569);
          border-radius: 8px;
          box-shadow: inset 0 3px 6px rgba(0,0,0,0.4);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10b981, #059669);
          border-radius: 6px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #059669, #047857);
        }
        
        /* Comprehensive text visibility fixes for DhakaDashboard */
        * {
          color: #ffffff !important;
        }
        
        /* Ensure all headings are visible */
        h1, h2, h3, h4, h5, h6 {
          color: #ffffff !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8) !important;
        }
        
        /* Ensure all paragraphs and spans are visible */
        p, span, div, label {
          color: #ffffff !important;
        }
        
        /* Specific color overrides for colored text classes */
        .text-emerald-100, .text-emerald-200, .text-emerald-300 {
          color: #a7f3d0 !important;
        }
        
        .text-cyan-100, .text-cyan-200, .text-cyan-300 {
          color: #67e8f9 !important;
        }
        
        .text-purple-100, .text-purple-200, .text-purple-300 {
          color: #c4b5fd !important;
        }
        
        .text-orange-100, .text-orange-200, .text-orange-300 {
          color: #fdba74 !important;
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
        
        button:disabled {
          cursor: not-allowed !important;
          opacity: 0.6 !important;
        }
        
        /* Override any white or light backgrounds */
        .bg-white, .bg-gray-50, .bg-gray-100, .bg-slate-50, .bg-slate-100 {
          background-color: rgba(30, 41, 59, 0.9) !important;
        }
        
        /* Chart container enhancements */
        .recharts-wrapper {
          background: rgba(51, 65, 85, 0.5) !important;
          border-radius: 12px !important;
        }
        
        /* Chart text enhancements */
        .recharts-text {
          fill: #ffffff !important;
          font-weight: 600 !important;
        }
        
        .recharts-cartesian-axis-tick-value {
          fill: #ffffff !important;
        }
        
        /* Chart tooltip enhancements */
        .recharts-tooltip-wrapper .recharts-default-tooltip {
          background-color: rgba(51, 65, 85, 0.98) !important;
          border: 2px solid #10b981 !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default DhakaDashboard;
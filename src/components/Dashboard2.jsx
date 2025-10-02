import React from 'react';
import { color, motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './Slider';
import { OutputCard } from './ui/OutputCard';
import { useSystem } from '../context/SystemContext';
import { Mountain, Hammer, Layers, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

const Dashboard2 = () => {
  const {
  regPercent, setRegPercent,
  metalPercent, setMetalPercent,
  glassPercent, setGlassPercent,
  charPercent, setCharPercent,
  oilPercent, setOilPercent,
  residuePercent, setResiduePercent,
  regolithType, setRegolithType,
  yields,
  brickCalc,
  strengthMPa,
  regolithData,
  pyroFeed,
  energy,
  arcThermal,
  plastics3D_to_printer,
  totalAvailableMass
  } = useSystem();

  const regolithTypes = [
    { value: 'Basaltic', label: 'Basaltic', multiplier: 1.1, color: 'mars' },
    { value: 'Silica-rich', label: 'Silica-rich', multiplier: 1.3, color: 'cosmic' },
    { value: 'Sulfate-rich', label: 'Sulfate-rich', multiplier: 0.9, color: 'energy' },
    { value: 'Carbonate-rich', label: 'Carbonate-rich', multiplier: 1.0, color: 'secondary' }
  ];

  // Calculate total percentage to show warnings
  const totalPercent = regPercent + metalPercent + glassPercent + charPercent + oilPercent + residuePercent;
  const isOverMaximum = totalPercent > 100;

  // Dynamic recommendation helpers
  const strength = Number(strengthMPa) || 0;
  const metalPct = Number(metalPercent) || 0;
  const glassPct = Number(glassPercent) || 0;
  const gradeLabel = strength >= 8 ? 'High grade' : strength >= 5 ? 'Standard grade' : (strength > 0 ? 'Low grade' : 'Unrated');
  const gradeDesc = gradeLabel === 'High grade'
    ? 'suitable for structural/load-bearing elements.'
    : gradeLabel === 'Standard grade'
      ? 'suitable for interior walls and partitions'
      : 'suitable for insulation panels and non-structural uses.';

  let mixSuggestion = '';
  if (strength >= 8) {
    mixSuggestion = `Metal ${metalPct}% • Glass ${glassPct}% — mix looks sufficient for high-strength needs.`;
  } else {
    const need = Math.max(0, Math.min(20, Math.round((8 - strength) * 1.5)));
    const suggestedGlass = glassPct < 15 ? 15 : glassPct;
    mixSuggestion = `Optimize metal (${metalPct}%) and glass (${glassPct}%) — consider +${need}% metal or increase glass to ~${suggestedGlass}% to raise strength.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="text-center space-y-6 py-6 mb-8">
        <h1
          className="font-extrabold leading-tight"
          style={{ color: '#ea7558ff', fontSize: '2.5rem', lineHeight: 1.05, textShadow: '0 6px 18px rgba(0,0,0,0.6)', textAlign: 'center' }}
        >
          🔨 Regolith Processing & Construction
        </h1>
        <p
          className="mx-auto max-w-4xl text-lg"
          style={{ color: '#e77b2eff', fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.95, textAlign: 'center', marginBottom : '30px' }}
        >
          Advanced Mars regolith processing system combining native materials with recycled waste for sustainable construction solutions
        </p>
      </div>

      {/* Mars Landing Site Selection Bar */}
      <div style={{
        background: 'rgba(15, 20, 35, 0.9)',
        border: '2px solid #ff6b35',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🚀</span>
            <span style={{ color: '#ff6b35', fontWeight: 'bold', fontSize: '18px' }}>
              Mars Landing Site Selection
            </span>
          </div>
          {/* ...existing code continues (header content) ... */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#ccc', fontSize: '14px' }}>Landing Site:</span>
            <select 
              value={regolithType}
              onChange={(e) => setRegolithType(e.target.value)}
              style={{
                background: '#1a1f2e',
                border: '1px solid #ff6b35',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="Basaltic">Jezero Crater</option>
              <option value="Silica-rich">Gale Crater</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {regolithData ? (
              <>
                <span style={{
                  background: '#0066cc',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  SiO₂: {regolithData.mineral_wt_percent?.SiO2 || 45.2}%
                </span>
                <span style={{
                  background: '#ff6b35',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Fe₂O₃: {regolithData.mineral_wt_percent?.Fe2O3 || 12.1}%
                </span>
                <span style={{
                  background: '#666',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Density: {regolithData.bulk_density_kg_m3 || 1650} kg/m³
                </span>
              </>
            ) : (
              <>
                <span style={{
                  background: '#666',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Loading NASA data...
                </span>
              </>
            )}
            {/* Small NASA badge near quick stats */}
            {regolithData && (
              <span className="nasa-badge" title="Data from NASA / PDS">🛰️ NASA data</span>
            )}
          </div>
        </div>
      </div>

      

      <div className="dashboard2-flex gap-8">
        {/* Input Controls */}
  <section className="dashboard2-card dashboard2-card-glass dashboard2-card-left flex-1">
          <div className="dashboard2-card-header">
            <Mountain className="w-6 h-6 text-orange-400" />
            <h2 className="dashboard2-card-title dashboard2-text-warm-light">Mixture Composition</h2>
          </div>

          {/* NASA Data Display */}
          {regolithData && (
            <div className="dashboard2-nasa-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 className="dashboard2-nasa-title dashboard2-text-cyan-200">NASA Regolith Data</h3>
                  <p className="dashboard2-nasa-site dashboard2-text-cool-light">{regolithData.site}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p className="text-xs dashboard2-text-cyan-300 mb-0">📡 Source: {regolithData.source || 'NASA PDS'}</p>
                  <span className="nasa-badge" title="Data from NASA / PDS">🛰️ NASA data</span>
                </div>
              </div>
              <div className="dashboard2-nasa-grid">
                <span className="dashboard2-text-cyan-100">SiO₂: {regolithData.mineral_wt_percent?.SiO2 || 'N/A'}%</span>
                <span className="dashboard2-text-cyan-100">Fe₂O₃: {regolithData.mineral_wt_percent?.Fe2O3 || 'N/A'}%</span>
                <span className="dashboard2-text-cyan-100">Al₂O₃: {regolithData.mineral_wt_percent?.Al2O3 || 'N/A'}%</span>
                <span className="dashboard2-text-cyan-100">MgO: {regolithData.mineral_wt_percent?.MgO || 'N/A'}%</span>
              </div>
              <div className="mt-2 text-xs dashboard2-text-cyan-400">
                Bulk Density: {regolithData.bulk_density_kg_m3 || 'N/A'} kg/m³ | 
                Glass Content: {regolithData.glass_content_pct || 'N/A'}%
              </div>
            </div>
          )}
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Slider
                label="Mars Regolith Base Material"
                value={regPercent}
                onChange={setRegPercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                color="mars"
                className="dashboard2-slider-large"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Slider
                label="Recycled Metal Reinforcement"
                value={metalPercent}
                onChange={setMetalPercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                color="cosmic"
                className="dashboard2-slider-large"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Slider
                label="Recycled Glass Aggregate"
                value={glassPercent}
                onChange={setGlassPercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                color="secondary"
                className="dashboard2-slider-large"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Slider
                label="Biochar Additive (from pyrolysis)"
                value={charPercent}
                onChange={setCharPercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                color="primary"
                className="dashboard2-slider-large"
              />
              <p className="text-sm dashboard2-text-cool-light font-medium mt-2 px-3 bg-blue-900/20 rounded-md py-1 border border-blue-500/20">
                Available: {yields?.charKg?.toFixed(1) ?? '0.0'} kg/day
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Slider
                label="Pyrolysis Oil Binder"
                value={oilPercent}
                onChange={setOilPercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                color="energy"
                className="dashboard2-slider-large"
              />
              <p className="text-sm dashboard2-text-warm-light font-medium mt-2 px-3 bg-amber-900/20 rounded-md py-1 border border-amber-500/20">
                Available: {yields?.oilL?.toFixed(1) ?? '0.0'} L/day
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Slider
                label="Other Residues & Fillers"
                value={residuePercent}
                onChange={setResiduePercent}
                min={0}
                max={100}
                step={1}
                unit="%"
                color="secondary"
                className="dashboard2-slider-large"
              />
            </motion.div>
          </motion.div>

          {/* Total percentage warning */}
          {isOverMaximum && (
            <div className="dashboard2-warning">
              <p className="dashboard2-warning-title text-red-300 font-bold">
                Total: {totalPercent}% exceeds 100%
              </p>
              <p className="dashboard2-warning-desc text-red-200">
                Adjust composition percentages to stay within available materials
              </p>
            </div>
          )}

          {/* Regolith Type Selection */}
          <div className="dashboard2-regolith-type">
            <h3 className="dashboard2-regolith-title dashboard2-text-warm-light font-semibold">Regolith Type</h3>
            <div className="dashboard2-regolith-btns">
              {regolithTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={regolithType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRegolithType(type.value)}
                  data-variant={regolithType === type.value ? "default" : "outline"}
                  className={cn(
                    "dashboard2-regolith-btn dashboard2-text-orange-100 font-medium",
                    regolithType === type.value && "dashboard2-regolith-selected"
                  )}
                >
                  {type.label}
                  <Badge variant="secondary" className="ml-2 text-xs dashboard2-regolith-badge">
                    {type.multiplier}×
                  </Badge>
                </Button>
              ))}
            </div>
            <p className="text-sm dashboard2-text-light-accent">
              Strength multipliers based on mineral composition and grain structure
            </p>
          </div>
  </section>

  {/* Construction Products */}
    <section className="dashboard2-card dashboard2-card-glass dashboard2-card-right flex-1">
          <div className="dashboard2-card-header">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="dashboard2-card-title dashboard2-text-mint-light">Construction Products</h2>
          </div>
          
          {/* Construction Products Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
            {/* Bricks Produced */}
            <div className="dashboard2-construction-card bg-gradient-to-br from-purple-500/20 to-purple-600/15 border border-purple-400/50 rounded-2xl p-10 backdrop-blur-lg transition-all duration-300 ease-in-out hover:shadow-[0_25px_70px_rgba(168,85,247,0.45),0_10px_30px_rgba(147,51,234,0.35)] hover:-translate-y-2 hover:border-purple-400/70 min-h-[320px]" 
                 style={{ boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4), 0 8px 25px rgba(147, 51, 234, 0.3)', margin: '8px' }}>
              <div className="card-header">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-18 h-18 bg-purple-500/30 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-3xl">🧱</span>
                  </div>
                  <h3 className="dashboard2-text-purple-100 font-bold text-2xl tracking-tight">Bricks Produced</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="dashboard2-text-purple-50 text-6xl font-black tracking-tight mb-4">
                  {brickCalc?.count || 0} <span className="text-2xl font-semibold dashboard2-text-purple-300 ml-2">bricks</span>
                </div>
                <div className="dashboard2-text-purple-200 text-xl font-medium tracking-wide">
                  {((brickCalc?.count || 0) * 1.6).toFixed(1)} kg total mass
                </div>
              </div>
              <div className="card-footer h-4 w-full bg-purple-500/25 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-700" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Brick Strength */}
            <div className="dashboard2-construction-card bg-gradient-to-br from-orange-500/15 to-red-500/10 border border-orange-400/40 rounded-2xl p-10 backdrop-blur-lg transition-all duration-300 ease-in-out hover:shadow-[0_20px_60px_rgba(251,146,60,0.4),0_8px_25px_rgba(251,146,60,0.3)] hover:-translate-y-2 hover:border-orange-400/60 min-h-[320px]" 
                 style={{ boxShadow: '0 15px 50px rgba(251, 146, 60, 0.35), 0 5px 20px rgba(251, 146, 60, 0.25)', margin: '8px' }}>
              <div className="card-header">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-18 h-18 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-orange-300 text-3xl">💪</span>
                  </div>
                  <h3 className="dashboard2-text-orange-100 font-bold text-2xl tracking-wide">Brick Strength</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="dashboard2-text-orange-50 text-6xl font-bold mb-4">
                  {strengthMPa?.toFixed(1)} <span className="text-2xl font-medium dashboard2-text-orange-200">MPa</span>
                </div>
                <div className="dashboard2-text-orange-200 text-xl font-medium">
                  {regolithType || 'Basaltic'} regolith composition
                </div>
              </div>
              <div className="card-footer h-4 w-full bg-orange-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${Math.min((strengthMPa || 0) * 10, 100)}%` }}></div>
              </div>
            </div>

            {/* Insulation Panels */}
            <div className="dashboard2-construction-card bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border border-blue-400/40 rounded-2xl p-10 backdrop-blur-lg transition-all duration-300 ease-in-out hover:shadow-[0_20px_60px_rgba(59,130,246,0.4),0_8px_25px_rgba(37,99,235,0.3)] hover:-translate-y-2 hover:border-blue-400/60 min-h-[320px]" 
                 style={{ boxShadow: '0 15px 50px rgba(59, 130, 246, 0.35), 0 5px 20px rgba(37, 99, 235, 0.25)', margin: '8px' }}>
              <div className="card-header">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-18 h-18 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-blue-300 text-3xl">🏠</span>
                  </div>
                  <h3 className="dashboard2-text-blue-100 font-bold text-2xl tracking-wide">Insulation Panels</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="dashboard2-text-blue-50 text-6xl font-bold mb-4">
                  5.0 <span className="text-2xl font-medium dashboard2-text-blue-200">panels</span>
                </div>
                <div className="dashboard2-text-blue-200 text-xl font-medium">
                  0.50 m³ total volume
                </div>
              </div>
              <div className="card-footer h-4 w-full bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Construction Grade */}
            <div className="dashboard2-construction-card bg-gradient-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-400/40 rounded-2xl p-10 backdrop-blur-lg transition-all duration-300 ease-in-out hover:shadow-[0_20px_60px_rgba(255,165,0,0.4),0_8px_25px_rgba(245,158,11,0.3)] hover:-translate-y-2 hover:border-yellow-400/60 min-h-[320px]" 
                 style={{ boxShadow: '0 15px 50px rgba(255, 165, 0, 0.35), 0 5px 20px rgba(245, 158, 11, 0.25)', margin: '8px' }}>
              <div className="card-header">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-18 h-18 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-yellow-300 text-3xl">⭐</span>
                  </div>
                  <h3 className="dashboard2-text-yellow-100 font-bold text-2xl tracking-wide">Construction Grade</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="dashboard2-text-yellow-50 text-6xl font-bold mb-4">
                  Standard
                </div>
                <div className="dashboard2-text-yellow-200 text-xl font-medium">
                  General construction ready
                </div>
              </div>
              <div className="card-footer h-4 w-full bg-yellow-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          {/* Construction Recommendations Card (separate) */}
          <div className="dashboard2-construction-reco mt-6" style={{ margin: '8px' }}>
            <div className="dashboard2-construction-card bg-gradient-to-br from-slate-700/15 to-slate-900/10 border border-slate-700/30 rounded-2xl p-8 backdrop-blur-lg transition-all duration-300 min-h-[220px]" style={{ boxShadow: '0 18px 50px rgba(2,6,23,0.6)' }}>
              <div className="card-header">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-slate-800/40 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="dashboard2-text-light-primary font-bold text-2xl tracking-tight">Construction Recommendations</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="dashboard2-text-slate-100 text-xl font-medium mb-4">
                  {gradeLabel} <span className="text-base font-normal">- {gradeDesc}</span>
                </div>
                <div className="dashboard2-text-cool-light text-base">
                  {mixSuggestion}
                </div>
              </div>
              <div className="card-footer h-4 w-full bg-slate-700/20 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-gradient-to-r from-slate-500 to-slate-700 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Material Flow Summary */}
      <div className="dashboard2-card dashboard2-card-glass dashboard2-card-summary mt-8">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold dashboard2-text-light-primary mb-2 tracking-wide">
            Material Flow Summary
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-purple-400 rounded mx-auto"></div>
        </div>
        <div className="text-base space-y-3">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-orange-200">{regPercent}% Mars Regolith + {metalPercent}% Metals +</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-blue-200">{charPercent}% Biochar + {oilPercent}% Oil binder system</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-slate-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-light-secondary">Mixed → Pressed → Sintered → {brickCalc?.count || 0} bricks @ {strengthMPa?.toFixed(1) || '0.0'} MPa</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-emerald-200">Construction capacity: {((brickCalc?.count || 0) * 0.5).toFixed(1)} m³ building volume</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard2;
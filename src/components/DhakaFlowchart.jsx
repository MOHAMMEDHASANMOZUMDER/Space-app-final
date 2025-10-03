import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSystem } from '../context/SystemContext';

// Custom styled components
const FlowchartCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
  color: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  },
}));

const ComponentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1f2937 0%, #374151 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(34, 197, 94, 0.6)',
    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.2)',
    transform: 'scale(1.02)',
  },
}));

const StatusBadge = styled(Box)(({ theme, status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: '50px',
  fontSize: '0.875rem',
  fontWeight: 600,
  border: '1px solid',
  ...(status === 'online' && {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    color: '#a7f3d0',
  }),
  ...(status === 'optimal' && {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    color: '#86efac',
  }),
  ...(status === 'active' && {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    color: '#93c5fd',
  }),
  ...(status === 'standby' && {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    color: '#fbbf24',
  }),
  ...(status === 'offline' && {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
  }),
}));

const DhakaFlowchart = () => {
  const {
    dhakaWasteIntake: wasteIntake,
    dhakaProjectionDays: projectionDays,
    dhakaSolarIrradiance: solarIrradiance,
    dhakaDiversionOverride: diversionOverride,
    dhakaSystemOperational: systemOperational
  } = useSystem();
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isFlowchartEnlarged, setIsFlowchartEnlarged] = useState(false);
  
  // Calculate real-time system metrics
  const calculateMetrics = () => {
    const dailyWaste = wasteIntake;
    const totalWaste = dailyWaste * projectionDays;
    
    // Processing allocation based on diversion override
    let printerAllocation, pyrolyzerAllocation, threedPrintedItems;
    
    if (diversionOverride) {
      // All waste goes to pyrolyzer
      printerAllocation = 0;
      pyrolyzerAllocation = dailyWaste;
      threedPrintedItems = 0;
    } else {
      // Normal split: 31% to printer, 69% to pyrolyzer
      printerAllocation = dailyWaste * 0.31;
      pyrolyzerAllocation = dailyWaste * 0.69;
      threedPrintedItems = (printerAllocation / dailyWaste) * 4.7; // 4.7 items per day at full capacity
    }
    
    // Processing stages with efficiency factors
    const plasticSorted = dailyWaste * 0.95; // 95% sorting efficiency
    const plasticShredded = plasticSorted * 0.98; // 98% shredding efficiency
    const plasticWashed = plasticShredded * 0.92; // 92% washing efficiency (contaminant removal)
    const plasticDried = plasticWashed * 0.96; // 96% drying efficiency
    
    // SOFC energy generation from pyrolyzer allocation
    const solfcEnergy = pyrolyzerAllocation * 2.5; // 2.5 kWh per kg plastic
    
    // Thermal energy reuse (saves dryer energy)
    const thermalReuse = pyrolyzerAllocation * 0.8; // 0.8 kWh thermal per kg
    
    // Solar panel energy from NASA API
    const solarPanelArea = 50; // m² for Dhaka system
    const solarEfficiency = 0.22; // 22% panel efficiency
    const solarEnergy = solarIrradiance * solarPanelArea * solarEfficiency;
    
    // Total energy generation
    const totalEnergyGenerated = solfcEnergy + solarEnergy + thermalReuse;
    
    // System consumption (varies with override mode)
    const baseConsumption = 25; // kWh/day base
    const printerConsumption = printerAllocation * 0.2; // 0.2 kWh per kg for printing
    const pyrolyzerConsumption = pyrolyzerAllocation * 0.15; // 0.15 kWh per kg for pyrolysis
    const systemConsumption = baseConsumption + printerConsumption + pyrolyzerConsumption;
    
    const netEnergyOutput = totalEnergyGenerated - systemConsumption;
    const energySelfSufficiency = Math.min((totalEnergyGenerated / systemConsumption) * 100, 100);
    
    // Water recycling (improves with higher pyrolyzer usage)
    const waterRecycleRate = diversionOverride ? 95 : 85; // Higher efficiency in pyrolyzer mode
    const waterReused = (plasticWashed * 15 * waterRecycleRate) / 100; // 15L per kg, with recycling rate
    
    // Overall waste utilization
    const wasteUtilization = ((plasticDried / dailyWaste) * 100);
    
    // Environmental impact
    const co2Avoided = plasticDried * 2.1; // kg CO2/kg plastic avoided from landfill
    
    return {
      totalWaste,
      printerAllocation,
      pyrolyzerAllocation,
      threedPrintedItems,
      plasticSorted,
      plasticShredded,
      plasticWashed,
      plasticDried,
      solfcEnergy,
      thermalReuse,
      solarEnergy,
      totalEnergyGenerated,
      netEnergyOutput,
      systemConsumption,
      energySelfSufficiency,
      waterRecycleRate,
      waterReused,
      wasteUtilization,
      co2Avoided
    };
  };
  
  const metrics = calculateMetrics();
  
  // Determine system status based on performance
  const getSystemStatus = () => {
    if (!systemOperational || wasteIntake === 0) return 'offline';
    if (metrics.energySelfSufficiency >= 90) return 'optimal';
    if (metrics.energySelfSufficiency >= 70) return 'active';
    return 'online';
  };
  
  const systemStatus = getSystemStatus();
  
  // Get current timestamp for data freshness
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // Update timestamp every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Dynamic component specifications for M-REGS-P Dhaka
  const componentSpecs = {
    'plastic-intake': {
      name: 'Plastic Waste Intake System',
      capacity: `Processing ${wasteIntake} kg/day`,
      materials: 'Stainless Steel 316L',
      dimensions: '2.5m × 1.8m × 1.2m',
      power: '2.5 kW (conveyor system)',
      efficiency: '95% sorting accuracy',
      maintenance: 'Weekly cleaning, monthly calibration',
      status: systemOperational && wasteIntake > 0 ? 'online' : 'offline'
    },
    'shredder': {
      name: 'Plastic Shredding Unit',
      capacity: `${(metrics.plasticSorted * 24).toFixed(0)} kg/hr processing rate`,
      materials: 'Hardened Steel Blades',
      dimensions: '1.8m × 1.2m × 1.5m',
      power: '15 kW motor drive',
      efficiency: '98% size reduction',
      maintenance: 'Blade replacement every 6 months',
      status: systemOperational && metrics.plasticSorted > 0 ? 'optimal' : 'offline'
    },
    'washing': {
      name: 'Automated Washing System',
      capacity: `${(metrics.waterReused).toFixed(0)}L water recycled daily`,
      materials: 'Corrosion-resistant coating',
      dimensions: '3.0m × 2.0m × 1.8m',
      power: '8 kW (pumps + heating)',
      efficiency: `${metrics.waterRecycleRate}% water recycling`,
      maintenance: 'Filter cleaning daily',
      status: systemOperational && metrics.plasticWashed > 0 ? 'active' : 'offline'
    },
    'drying': {
      name: 'Thermal Drying Chamber',
      capacity: `${metrics.plasticDried.toFixed(0)} kg/day processed`,
      materials: 'Insulated steel chamber',
      dimensions: '2.2m × 1.5m × 2.0m',
      power: `${(12 - metrics.thermalReuse * 0.1).toFixed(1)} kW (with thermal reuse)`,
      efficiency: '96% processing efficiency',
      maintenance: 'Monthly thermal calibration',
      status: systemOperational && metrics.plasticDried > 0 ? 'online' : 'offline'
    },
    'sofc': {
      name: 'Solid Oxide Fuel Cell (SOFC)',
      capacity: `${metrics.solfcEnergy.toFixed(1)} kWh/day output`,
      materials: 'Yttria-stabilized zirconia',
      dimensions: '1.5m × 1.0m × 1.8m',
      power: `${(metrics.solfcEnergy * 2).toFixed(0)} kW peak capacity`,
      efficiency: '85% electrical conversion',
      maintenance: 'Quarterly stack inspection',
      status: systemOperational && metrics.pyrolyzerAllocation > 0 ? 'optimal' : 'standby'
    },
    'solar': {
      name: 'Solar Panel Array',
      capacity: `${metrics.solarEnergy.toFixed(1)} kWh/day generation`,
      materials: 'Monocrystalline Silicon',
      dimensions: '50 m² coverage',
      power: `${(solarIrradiance * 11).toFixed(1)} kW peak output`,
      efficiency: `22% panel efficiency @ ${solarIrradiance} kWh/m²/day`,
      maintenance: 'Monthly cleaning, annual inspection',
      status: systemOperational && solarIrradiance > 0 ? 'active' : 'standby',
      nasaData: true // Flag to show NASA indicator
    }
  };

  // Dynamic system overview metrics
  const systemMetrics = {
    totalCapacity: `${wasteIntake} kg/day`,
    energyOutput: `${(metrics.totalEnergyGenerated).toFixed(1)} kWh/day`,
    efficiency: `${metrics.wasteUtilization.toFixed(1)}%`,
    uptime: systemOperational ? '97.3%' : '0%',
    co2Reduction: `${metrics.co2Avoided.toFixed(0)} kg/day`,
    waterRecycling: `${metrics.waterRecycleRate}%`
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #374151 50%, #000000 100%)',
      padding: 4,
    }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Enhanced Header */}
        <FlowchartCard sx={{ mb: 4, p: 4, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: 128, 
            height: 128, 
            background: 'rgba(34, 197, 94, 0.1)', 
            borderRadius: '50%', 
            transform: 'translate(50%, -50%)' 
          }} />
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: 96, 
            height: 96, 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '50%', 
            transform: 'translate(-50%, 50%)' 
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  🔄
                </Box>
                <Box>
                  <Typography variant="h2" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #86efac, #22c55e, #16a34a)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}>
                    M-REGS-P Process Flow
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#86efac', fontWeight: 700, mt: 1 }}>
                    Dhaka Plastic Recycling System
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {systemOperational ? (
                  <StatusBadge status={systemStatus}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      backgroundColor: systemStatus === 'optimal' ? '#22c55e' : 
                                     systemStatus === 'active' ? '#3b82f6' : 
                                     systemStatus === 'online' ? '#10b981' : '#ef4444', 
                      borderRadius: '50%' 
                    }} />
                    {systemStatus === 'optimal' ? 'Optimal Performance' :
                     systemStatus === 'active' ? 'Active Processing' :
                     systemStatus === 'online' ? 'System Online' : 'System Offline'}
                  </StatusBadge>
                ) : (
                  <StatusBadge status="offline">
                    <Box sx={{ width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: '50%' }} />
                    System Offline
                  </StatusBadge>
                )}
                <StatusBadge status={metrics.energySelfSufficiency >= 100 ? 'optimal' : metrics.energySelfSufficiency >= 70 ? 'active' : 'online'}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: metrics.energySelfSufficiency >= 100 ? '#22c55e' : 
                                   metrics.energySelfSufficiency >= 70 ? '#3b82f6' : '#10b981', 
                    borderRadius: '50%' 
                  }} />
                  {metrics.energySelfSufficiency.toFixed(0)}% Self-Sufficient
                </StatusBadge>
                <StatusBadge status={wasteIntake > 200 ? 'optimal' : wasteIntake > 100 ? 'active' : 'online'}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: wasteIntake > 200 ? '#22c55e' : wasteIntake > 100 ? '#3b82f6' : '#10b981', 
                    borderRadius: '50%' 
                  }} />
                  {wasteIntake} kg/day Processing
                </StatusBadge>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ 
              color: '#d1fae5', 
              fontWeight: 600, 
              maxWidth: '800px',
              lineHeight: 1.6,
              mb: 2
            }}>
              Interactive system flowchart showing the complete plastic waste-to-energy conversion process optimized for urban deployment in Dhaka. 
              Real-time data updated every 5 minutes - Processing {wasteIntake} kg/day with {metrics.energySelfSufficiency.toFixed(1)}% energy self-sufficiency.
            </Typography>
            
            {/* NASA API Data Indicator */}
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 1, 
              background: 'rgba(245, 158, 11, 0.2)', 
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '20px', 
              px: 2, 
              py: 0.5,
              mb: 3
            }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                🛰️ NASA POWER API
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#fed7aa' }}>
                Solar: {solarIrradiance.toFixed(1)} kWh/m²/day • {metrics.solarEnergy.toFixed(1)} kWh/day generated
              </Typography>
            </Box>
          </Box>
        </FlowchartCard>

        {/* Performance Overview Alert */}
        {diversionOverride && (
          <Card sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: 3,
            p: 3,
            mb: 4,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              ⚠️ ENERGY DIVERSION MODE ACTIVE
            </Typography>
            <Typography sx={{ color: '#fef3c7', fontSize: '0.95rem', mb: 1 }}>
              All {wasteIntake} kg/day plastic waste redirected to pyrolyzer for maximum energy output ({metrics.solfcEnergy.toFixed(1)} kWh/day SOFC generation)
            </Typography>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5
            }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#fef3c7', fontWeight: 600 }}>
                🛰️ NASA solar data: {solarIrradiance.toFixed(1)} kWh/m²/day contributing {metrics.solarEnergy.toFixed(1)} kWh/day
              </Typography>
            </Box>
          </Card>
        )}

        {/* System Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.2)',
              }
            }}>
              <Typography variant="h4" sx={{ 
                color: '#22c55e', 
                fontWeight: 800, 
                mb: 1 
              }}>
                {systemMetrics.totalCapacity}
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>Processing Capacity</Typography>
              <Typography sx={{ color: '#86efac', fontSize: '0.875rem', mt: 1 }}>
                Daily Throughput • {projectionDays}-day projection
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)',
              }
            }}>
              <Typography variant="h4" sx={{ 
                color: '#f59e0b', 
                fontWeight: 800, 
                mb: 1 
              }}>
                {systemMetrics.energyOutput}
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>Energy Generation</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ color: '#fbbf24', fontSize: '0.875rem' }}>
                  SOFC: {metrics.solfcEnergy.toFixed(1)} + Solar: {metrics.solarEnergy.toFixed(1)} + Thermal: {metrics.thermalReuse.toFixed(1)} kWh/day
                </Typography>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '10px',
                  px: 1,
                  py: 0.25,
                  alignSelf: 'flex-start'
                }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 600 }}>
                    🛰️ NASA
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#fed7aa' }}>
                    Solar data
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
              }
            }}>
              <Typography variant="h4" sx={{ 
                color: '#3b82f6', 
                fontWeight: 800, 
                mb: 1 
              }}>
                {systemMetrics.efficiency}
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>System Efficiency</Typography>
              <Typography sx={ { color: '#93c5fd', fontSize: '0.875rem', mt: 1 }}>Overall Performance</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Main Flowchart Container */}
        <Card sx={{
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          borderRadius: 3,
          border: '1px solid rgba(59, 130, 246, 0.3)',
          p: 4,
          mb: 4,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(59, 130, 246, 0.6)',
            boxShadow: '0 15px 35px rgba(59, 130, 246, 0.2)',
          }
        }} onClick={() => setIsFlowchartEnlarged(true)}>
          <Typography variant="h4" sx={{ 
            color: '#3b82f6', 
            fontWeight: 700, 
            mb: 3,
            textAlign: 'center'
          }}>
            System Process Flow
          </Typography>
          <Typography sx={{ 
            color: '#d1d5db', 
            textAlign: 'center', 
            mb: 4,
            fontSize: '1.1rem'
          }}>
            Click to enlarge and explore the complete waste-to-energy conversion process
          </Typography>
          
          {/* Flowchart Image */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)'
          }}>
            <img 
              src="/dhflow.png" 
              alt="Dhaka System Flow Diagram" 
              style={{
                width: '100%',
                maxWidth: '800px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            />
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ 
              color: '#86efac', 
              fontSize: '0.875rem', 
              fontStyle: 'italic'
            }}>
              🔍 Click to enlarge • Complete M-REGS-P system architecture showing plastic waste processing flow
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ 
                color: '#9ca3af', 
                fontSize: '0.75rem',
                fontStyle: 'italic'
              }}>
                Last updated: {lastUpdated.toLocaleTimeString()} • {metrics.totalEnergyGenerated.toFixed(1)} kWh/day total generation
              </Typography>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1,
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                px: 2,
                py: 0.5
              }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600 }}>
                  🛰️ Powered by NASA Earth Data API
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#fed7aa' }}>
                  Solar irradiance: {solarIrradiance.toFixed(2)} kWh/m²/day
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Component Grid */}
        <Typography variant="h4" sx={{ 
          color: '#22c55e', 
          fontWeight: 700, 
          mb: 3,
          textAlign: 'center'
        }}>
          System Components
        </Typography>
        
        <Grid container spacing={3}>
          {Object.entries(componentSpecs).map(([key, spec]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <ComponentCard 
                sx={{ p: 3, height: '100%' }}
                onClick={() => setSelectedComponent(spec)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    background: spec.status === 'online' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                spec.status === 'optimal' ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {key === 'plastic-intake' && '📥'}
                    {key === 'shredder' && '⚙️'}
                    {key === 'washing' && '🚿'}
                    {key === 'drying' && '🔥'}
                    {key === 'sofc' && '⚡'}
                    {key === 'solar' && '☀️'}
                  </Box>
                  <StatusBadge status={spec.status}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: spec.status === 'online' ? '#10b981' :
                                     spec.status === 'optimal' ? '#22c55e' : 
                                     spec.status === 'active' ? '#3b82f6' :
                                     spec.status === 'standby' ? '#f59e0b' : '#ef4444',
                      borderRadius: '50%'
                    }} />
                    {spec.status}
                  </StatusBadge>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    lineHeight: 1.3
                  }}>
                    {spec.name}
                  </Typography>
                  {spec.nasaData && (
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      px: 1,
                      py: 0.25,
                      alignSelf: 'flex-start'
                    }}>
                      <Typography sx={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 700 }}>
                        🛰️ NASA API DATA
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Capacity:</Typography>
                    <Typography sx={{ color: '#22c55e', fontWeight: 600, fontSize: '0.875rem' }}>
                      {spec.capacity}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Power:</Typography>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>
                      {spec.power}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Efficiency:</Typography>
                    <Typography sx={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.875rem' }}>
                      {spec.efficiency}
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  fullWidth
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(135deg, #374151, #4b5563)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4b5563, #6b7280)',
                    }
                  }}
                >
                  View Details
                </Button>
              </ComponentCard>
            </Grid>
          ))}
        </Grid>

        {/* Component Detail Dialog */}
        <Dialog 
          open={selectedComponent !== null} 
          onClose={() => setSelectedComponent(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedComponent && (
            <>
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {selectedComponent.name}
                </Typography>
                <IconButton 
                  onClick={() => setSelectedComponent(null)}
                  sx={{ color: 'white' }}
                >
                  ×
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ 
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                color: 'white'
              }}>
                {selectedComponent && selectedComponent.nasaData && (
                  <Box sx={{ 
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#fbbf24', fontWeight: 700, mb: 1 }}>
                      🛰️ NASA EARTH DATA API INTEGRATION
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#fed7aa' }}>
                      This component uses real-time solar irradiance data from NASA POWER API
                      <br />
                      Current data: {solarIrradiance.toFixed(2)} kWh/m²/day for Dhaka coordinates
                    </Typography>
                  </Box>
                )}
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ color: '#22c55e', mb: 2 }}>Specifications</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Capacity</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{selectedComponent.capacity}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Materials</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{selectedComponent.materials}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Dimensions</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{selectedComponent.dimensions}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>Performance</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Power Consumption</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{selectedComponent.power}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Efficiency</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{selectedComponent.efficiency}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>Maintenance</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{selectedComponent.maintenance}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Enlarged Flowchart Dialog */}
        <Dialog 
          open={isFlowchartEnlarged} 
          onClose={() => setIsFlowchartEnlarged(false)}
          maxWidth="xl"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Complete System Process Flow
            </Typography>
            <IconButton 
              onClick={() => setIsFlowchartEnlarged(false)}
              sx={{ color: 'white' }}
            >
              ×
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ 
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            color: 'white',
            p: 4
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src="/dhflow.png" 
                alt="Complete Dhaka System Flow Diagram" 
                style={{
                  width: '100%',
                  maxWidth: '1200px',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.4)'
                }}
              />
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography sx={{ 
                color: '#86efac', 
                fontSize: '1rem', 
                lineHeight: 1.6,
                mb: 2
              }}>
                M-REGS-P (Plastics) System Architecture for Dhaka Urban Deployment
                <br />
                <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Self-sustainable plastic recycling with solar integration, water recycling, and energy recovery
                </span>
              </Typography>
              
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 2,
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                px: 3,
                py: 1
              }}>
                <Typography sx={{ fontSize: '0.875rem', color: '#fbbf24', fontWeight: 700 }}>
                  🛰️ NASA POWER API Integration
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#fed7aa' }}>
                  Real-time solar data for Dhaka (23.81°N, 90.41°E)
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
        


      </Box>
    </Box>
  );
};

export default DhakaFlowchart;
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Button, IconButton, Slider, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSystem } from '../context/SystemContext';

// Custom styled components
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3a8a 100%, #3b82f6 50%, #06b6d4 20%)',
  color: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  },
}));

const MetricCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  color: 'white',
  borderRadius: '12px',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
  },
}));

const ControlCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1f2937 0%, #374151 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(34, 197, 94, 0.6)',
    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.2)',
  },
}));

const DhakaDashboard = () => {
  const {
    dhakaWasteIntake: wasteIntake,
    setDhakaWasteIntake: setWasteIntake,
    dhakaProjectionDays: projectionDays,
    setDhakaProjectionDays: setProjectionDays,
    dhakaDiversionOverride: diversionOverride,
    setDhakaDiversionOverride: setDiversionOverride,
    dhakaSolarIrradiance,
    setDhakaSolarIrradiance,
    dhakaSystemOperational,
    setDhakaSystemOperational
  } = useSystem();
  
  // Calculation counter to track updates
  const [calculationCount, setCalculationCount] = useState(0);
  
  // Location and weather data
  const [latitude, setLatitude] = useState(23.8103); // Dhaka coordinates
  const [longitude, setLongitude] = useState(90.4125);
  const solarIrradiance = dhakaSolarIrradiance;
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
        setDhakaSolarIrradiance(avgIrradiance);
        setWeatherData(data);
      }
    } catch (error) {
      console.error('NASA API Error:', error);
    }
    setLoading(false);
  };

  // Calculate comprehensive system metrics with useCallback to ensure proper dependency tracking
  const calculateMetrics = React.useCallback(() => {
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
    const energySelfSufficiencyRaw = (totalEnergyGenerated / systemConsumption) * 100;
    const energySelfSufficiency = Math.min(energySelfSufficiencyRaw, 100);
    
    // Debug: Log energy calculations for troubleshooting
    console.log('🔥 DHAKA DASHBOARD - SELF-SUFFICIENCY CALCULATION:', {
      '⚡ Raw Self-Sufficiency': `${energySelfSufficiencyRaw.toFixed(2)}%`,
      '⚡ Capped Self-Sufficiency': `${energySelfSufficiency.toFixed(2)}%`,
      '🔋 Total Generated': `${totalEnergyGenerated.toFixed(2)} kWh`,
      '⚙️ System Consumption': `${systemConsumption.toFixed(2)} kWh`,
      '📊 SOFC Energy': `${solfcEnergy.toFixed(2)} kWh`,
      '☀️ Solar Energy': `${solarEnergy.toFixed(2)} kWh`,
      '🔥 Thermal Reuse': `${thermalReuse.toFixed(2)} kWh`,
      '🗂️ Waste Intake': `${wasteIntake} kg/day`,
      '🔄 Diversion Mode': diversionOverride,
      '☀️ Solar Irradiance': `${solarIrradiance.toFixed(2)} kWh/m²/day`
    });
    
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
  }, [wasteIntake, diversionOverride, dhakaSolarIrradiance]); // Dependencies for calculation

  const metrics = React.useMemo(() => calculateMetrics(), [calculateMetrics]);

  // Update calculation counter when metrics change
  useEffect(() => {
    setCalculationCount(prev => prev + 1);
  }, [wasteIntake, diversionOverride, dhakaSolarIrradiance]);

  // Chart data (scaled by projection days)
  const energyData = [
    { name: 'SOFC', value: metrics.solfcEnergy * projectionDays, color: '#10b981' },
    { name: 'Solar', value: metrics.solarEnergy * projectionDays, color: '#f59e0b' },
    { name: 'Thermal', value: metrics.thermalReuse * projectionDays, color: '#8b5cf6' },
    { name: 'Consumption', value: -(metrics.systemConsumption * projectionDays), color: '#ef4444' }
  ];

  const wasteFlowData = [
    { stage: 'Input', amount: wasteIntake },
    { stage: 'Sorted', amount: metrics.plasticSorted },
    { stage: 'Shredded', amount: metrics.plasticShredded },
    { stage: 'Washed', amount: metrics.plasticWashed },
    { stage: 'Processed', amount: metrics.plasticDried }
  ];

  const efficiencyData = [
    { name: 'Processing', efficiency: metrics.wasteReduction },
    { name: 'Energy Gen', efficiency: metrics.energySelfSufficiency },
    { name: 'Overall', efficiency: (metrics.wasteReduction + metrics.energySelfSufficiency) / 2 }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #374151 50%, #000000 100%)',
      padding: 4,
    }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Enhanced Header */}
        <GradientCard sx={{ mb: 4, p: 4, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: 128, 
            height: 128, 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '50%', 
            transform: 'translate(50%, -50%)' 
          }} />
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: 96, 
            height: 96, 
            background: 'rgba(20, 184, 166, 0.1)', 
            borderRadius: '50%', 
            transform: 'translate(-50%, 50%)' 
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #10b981, #14b8a6, #22c55e)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  🏭
                </Box>
                <Box>
                  <Typography variant="h2" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #a7f3d0, #5eead4, #86efac)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}>
                    M-REGS-P Control Center
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#6ee7b7', fontWeight: 700, mt: 1 }}>
                    Dhaka Operations Hub
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ 
                color: '#a7f3d0', 
                fontWeight: 600, 
                pl: 11,
                maxWidth: '600px',
                lineHeight: 1.6,
                mb: 2
              }}>
                Mars Recycling & Energy Generation System - Plastic Optimized for Urban Deployment
              </Typography>
              
              {/* NASA API Integration Indicator */}
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5, 
                background: 'rgba(245, 158, 11, 0.2)', 
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '20px', 
                px: 3, 
                py: 1,
                ml: 11,
                mb: 2
              }}>
                <Typography sx={{ fontSize: '0.875rem', color: '#fbbf24', fontWeight: 700 }}>
                  🛰️ NASA POWER API INTEGRATION
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#fed7aa' }}>
                  Real-time solar irradiance: {solarIrradiance.toFixed(2)} kWh/m²/day
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, pl: 11, pt: 1 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: 'rgba(16, 185, 129, 0.2)',
                  px: 3,
                  py: 1.5,
                  borderRadius: '50px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#10b981',
                    borderRadius: '50%'
                  }} />
                  <Typography sx={{ color: '#a7f3d0', fontWeight: 600 }}>System Online</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: 'rgba(20, 184, 166, 0.2)',
                  px: 3,
                  py: 1.5,
                  borderRadius: '50px',
                  border: '1px solid rgba(20, 184, 166, 0.3)'
                }}>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#14b8a6',
                    borderRadius: '50%'
                  }} />
                  <Typography sx={{ color: '#5eead4', fontWeight: 600 }}>Auto Mode</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background: 'rgba(34, 197, 94, 0.2)',
                  px: 3,
                  py: 1.5,
                  borderRadius: '50px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#22c55e',
                    borderRadius: '50%'
                  }} />
                  <Typography sx={{ color: '#86efac', fontWeight: 600 }}>Eco Mode</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(20, 184, 166, 0.3), rgba(34, 197, 94, 0.3))',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '2px solid rgba(16, 185, 129, 0.25)',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
                }
              }}>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #a7f3d0, #5eead4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}>
                  🌱 Sustainable Operations
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#a7f3d0', fontWeight: 600 }}>Energy Self-Sufficient</Typography>
                    <Box sx={{ 
                      color: '#a7f3d0', 
                      background: 'rgba(16, 185, 129, 0.2)', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: '50px',
                      fontSize: '0.875rem'
                    }}>
                      ✓
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#5eead4', fontWeight: 600 }}>Water Recycling</Typography>
                    <Box sx={{ 
                      color: '#5eead4', 
                      background: 'rgba(20, 184, 166, 0.2)', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: '50px',
                      fontSize: '0.875rem'
                    }}>
                      85%
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#86efac', fontWeight: 600 }}>Carbon Neutral</Typography>
                    <Box sx={{ 
                      color: '#86efac', 
                      background: 'rgba(34, 197, 94, 0.2)', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: '50px',
                      fontSize: '0.875rem'
                    }}>
                      ✓
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </GradientCard>

        {/* Control Panel */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Waste Intake Control */}
          <Grid item xs={12} lg={4}>
            <ControlCard sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ♻️
                  </Box>
                  <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                    Waste Intake Control
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#a7f3d0', mb: 2 }}>Daily Waste Input: {wasteIntake} kg</Typography>
                  <Slider
                    value={wasteIntake}
                    onChange={(e, newValue) => setWasteIntake(newValue)}
                    min={50}
                    max={500}
                    sx={{
                      color: '#10b981',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#10b981',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#10b981',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(16, 185, 129, 0.3)',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>3D Printer:</Typography>
                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{metrics.printerAllocation.toFixed(1)} kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>Pyrolyzer:</Typography>
                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{metrics.pyrolyzerAllocation.toFixed(1)} kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>3D Items/Day:</Typography>
                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{metrics.threedPrintedItems.toFixed(1)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    <Typography sx={{ color: '#d1d5db', fontSize: '0.875rem' }}>Diversion Override:</Typography>
                    <Button
                      onClick={() => setDiversionOverride(!diversionOverride)}
                      sx={{
                        background: diversionOverride ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        fontWeight: 600,
                        py: 1,
                        '&:hover': {
                          background: diversionOverride ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #059669, #047857)',
                        }
                      }}
                    >
                      {diversionOverride ? 'All → Pyrolyzer' : 'Normal Split'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </ControlCard>
          </Grid>

          {/* NASA API Control */}
          <Grid item xs={12} lg={4}>
            <ControlCard sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ☀️
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      NASA Solar Data
                    </Typography>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      px: 1,
                      py: 0.25,
                      mt: 0.5
                    }}>
                      <Typography sx={{ fontSize: '0.65rem', color: '#a7f3d0', fontWeight: 600 }}>
                        🛰️ LIVE API CONNECTION
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    type="number"
                    fullWidth
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(245, 158, 11, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f59e0b',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f59e0b',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#fbbf24',
                      },
                    }}
                  />
                  <TextField
                    label="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    type="number"
                    fullWidth
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(245, 158, 11, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#f59e0b',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f59e0b',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#fbbf24',
                      },
                    }}
                  />
                </Box>

                <Button
                  onClick={fetchNASAWeatherData}
                  disabled={loading}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    fontWeight: 600,
                    py: 1.5,
                    mb: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #d97706, #b45309)',
                    }
                  }}
                >
                  {loading ? '🛰️ Fetching NASA Data...' : '🛰️ Update NASA Solar Data'}
                </Button>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>Location:</Typography>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>
                      {latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>Solar Irradiance:</Typography>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 600 }}>{solarIrradiance.toFixed(2)} kWh/m²</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#d1d5db' }}>Solar Energy:</Typography>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        background: 'rgba(245, 158, 11, 0.15)',
                        borderRadius: '6px',
                        px: 0.75,
                        py: 0.25
                      }}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 600 }}>
                          🛰️
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 600 }}>{metrics.solarEnergy.toFixed(1)} kWh</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>API Status:</Typography>
                    <Typography sx={{ color: loading ? '#f59e0b' : (weatherData ? '#10b981' : '#6b7280'), fontWeight: 600, fontSize: '0.875rem' }}>
                      {loading ? 'Fetching...' : (weatherData ? 'Connected ✓' : 'Not Connected')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ControlCard>
          </Grid>

          {/* System Control */}
          <Grid item xs={12} lg={4}>
            <ControlCard sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ⚡
                  </Box>
                  <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                    System Control
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#a3cbf7', mb: 2 }}>Projection Days: {projectionDays}</Typography>
                  <Slider
                    value={projectionDays}
                    onChange={(e, newValue) => setProjectionDays(newValue)}
                    min={1}
                    max={30}
                    sx={{
                      color: '#3b82f6',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#3b82f6',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#3b82f6',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>SOFC Energy:</Typography>
                    <Typography sx={{ color: '#3b82f6', fontWeight: 600 }}>{(metrics.solfcEnergy * projectionDays).toFixed(1)} kWh</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#d1d5db' }}>Thermal Reuse:</Typography>
                    <Typography sx={{ color: '#3b82f6', fontWeight: 600 }}>{(metrics.thermalReuse * projectionDays).toFixed(1)} kWh</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#d1d5db' }}>Self-Sufficiency:</Typography>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        background: 'rgba(245, 158, 11, 0.15)',
                        borderRadius: '6px',
                        px: 0.75,
                        py: 0.25
                      }}>
                        <Typography sx={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 600 }}>
                          🛰️
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: '#3b82f6', fontWeight: 600 }}>{metrics.energySelfSufficiency.toFixed(1)}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <Typography sx={{ color: '#93c5fd', fontSize: '0.875rem' }}>Period:</Typography>
                    <Typography sx={{ color: '#93c5fd', fontSize: '0.875rem', fontWeight: 600 }}>{projectionDays} day{projectionDays > 1 ? 's' : ''}</Typography>
                  </Box>
                </Box>
              </Box>
            </ControlCard>
          </Grid>
        </Grid>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                color: '#10b981', 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(45deg, #10b981, #22c55e)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {metrics.threedPrintedItems.toFixed(1)}
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>3D Items/Day</Typography>
              <Typography sx={{ color: '#86efac', fontSize: '0.875rem', mt: 1 }}>Utensils & Components</Typography>
            </MetricCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                color: '#f59e0b', 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(45deg, #f59e0b, #eab308)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {(metrics.totalEnergyGenerated * projectionDays).toFixed(0)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>kWh Generated</Typography>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '6px',
                  px: 0.75,
                  py: 0.25
                }}>
                  <Typography sx={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 600 }}>
                    🛰️
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ color: '#fbbf24', fontSize: '0.875rem', mt: 1 }}>{projectionDays} Day{projectionDays > 1 ? 's' : ''} • Solar: {(metrics.solarEnergy * projectionDays).toFixed(1)} kWh</Typography>
            </MetricCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                color: '#3b82f6', 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {metrics.waterRecycleRate}%
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>Water Reuse</Typography>
              <Typography sx={{ color: '#93c5fd', fontSize: '0.875rem', mt: 1 }}>{metrics.waterReused.toFixed(0)}L/day</Typography>
            </MetricCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                color: '#22c55e', 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {metrics.energySelfSufficiency.toFixed(0)}%
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>Self-Sufficient</Typography>
              <Typography sx={{ color: '#86efac', fontSize: '0.875rem', mt: 1 }}>Energy Independence</Typography>
            </MetricCard>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <Card sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 3,
              p: 3
            }}>
              <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 700, mb: 3 }}>
                Energy Summary
              </Typography>
              
              {/* Energy Breakdown Numbers */}
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#10b981', borderRadius: '50%' }} />
                    <Typography sx={{ color: '#d1d5db' }}>SOFC:</Typography>
                  </Box>
                  <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{(metrics.solfcEnergy * projectionDays).toFixed(1)} kWh</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#f59e0b', borderRadius: '50%' }} />
                    <Typography sx={{ color: '#d1d5db' }}>Solar:</Typography>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      background: 'rgba(245, 158, 11, 0.15)',
                      borderRadius: '6px',
                      px: 0.75,
                      py: 0.25
                    }}>
                      <Typography sx={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 600 }}>
                        🛰️ NASA
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: '#f59e0b', fontWeight: 600 }}>{(metrics.solarEnergy * projectionDays).toFixed(1)} kWh</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#8b5cf6', borderRadius: '50%' }} />
                    <Typography sx={{ color: '#d1d5db' }}>Thermal:</Typography>
                  </Box>
                  <Typography sx={{ color: '#8b5cf6', fontWeight: 600 }}>{(metrics.thermalReuse * projectionDays).toFixed(1)} kWh</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography sx={{ color: '#d1d5db', fontWeight: 600 }}>Total Generated ({projectionDays} day{projectionDays > 1 ? 's' : ''}):</Typography>
                  <Typography sx={{ color: '#3b82f6', fontWeight: 700 }}>{(metrics.totalEnergyGenerated * projectionDays).toFixed(1)} kWh</Typography>
                </Box>
              </Box>
              
              {/* NASA Data Chart Indicator */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                px: 2,
                py: 1,
                mb: 2,
                mt: 2
              }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                  🛰️ NASA API DATA
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#fed7aa' }}>
                  Solar energy from real-time irradiance data
                </Typography>
              </Box>
              
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#d1d5db" />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#d1d5db'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 3,
              p: 3
            }}>
              <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700, mb: 3 }}>
                Sustainability Analysis
              </Typography>
              
              {/* Sustainability Metrics */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: '#d1d5db' }}>Energy Self-Sufficiency</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#10b981', fontWeight: 600 }}>{metrics.energySelfSufficiency.toFixed(1)}%</Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.7rem' }}>#{calculationCount}</Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(metrics.energySelfSufficiency, 100)} 
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#10b981'
                      }
                    }}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: '#d1d5db' }}>Water Recycling Rate</Typography>
                    <Typography sx={{ color: '#06b6d4', fontWeight: 600 }}>{metrics.waterRecycleRate}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.waterRecycleRate} 
                    sx={{
                      backgroundColor: 'rgba(6, 182, 212, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#06b6d4'
                      }
                    }}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: '#d1d5db' }}>Waste Utilization</Typography>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 600 }}>{metrics.wasteUtilization.toFixed(1)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.wasteUtilization} 
                    sx={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#f59e0b'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)' }}>
                  <Typography sx={{ color: '#10b981', fontWeight: 600, textAlign: 'center' }}>
                    {projectionDays}-Day Projection: {(metrics.totalEnergyGenerated * projectionDays).toFixed(0)} kWh Total
                  </Typography>
                  <Typography sx={{ color: '#86efac', fontSize: '0.875rem', textAlign: 'center', mt: 1 }}>
                    {(metrics.waterReused * projectionDays).toFixed(0)}L Water Recycled • {(metrics.co2Avoided * projectionDays).toFixed(0)} kg CO₂ Avoided
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default DhakaDashboard;
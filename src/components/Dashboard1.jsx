import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Grid,
  Slider,
  LinearProgress
} from '@mui/material';
import { useSystem } from '../context/SystemContext';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import '../styles/dashboard.css';
import { CustomSlider } from './ui/CustomSlider';
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledSlider = styled(Slider)(({ color }) => ({
  color: color || '#3b82f6',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 16,
    height: 16,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.16)',
    },
  },
}));

export default function Dashboard1() {
  const {
    metals, setMetals,
    glass, setGlass,
    fabrics, setFabrics,
    plastics, setPlastics,
    plastics3D, setPlastics3D,
    intervalDays, setIntervalDays,
    override, setOverride,
    customInterval, setCustomInterval,
    pyroFeed,
    energy,
    yields,
    arcThermal,
    plastics3D_to_printer,
    plastics3D_to_pyro
  } = useSystem();

  // --- Assumptions for volume conversion ---
  // Typical density for many common plastics (e.g., HDPE/PP blends) ~0.90-0.96 kg/L.
  // We'll use 0.95 kg/L as a reasonable average for converting mass (kg) -> liters (L)
  const PLASTIC_DENSITY_KG_PER_L = 0.95;

  // Convert 3D plastics mass to volume (liters) and cubic meters for display
  const plastics3D_to_printer_L = (plastics3D_to_printer || 0) / PLASTIC_DENSITY_KG_PER_L;
  const plastics3D_to_pyro_L = (plastics3D_to_pyro || 0) / PLASTIC_DENSITY_KG_PER_L;
  const plastics3D_to_printer_m3 = plastics3D_to_printer_L / 1000;
  const plastics3D_to_pyro_m3 = plastics3D_to_pyro_L / 1000;

  // Percent allocations for visual bars
  const pctPrinter = plastics3D > 0 ? (100 * (plastics3D_to_printer || 0) / plastics3D) : 0;
  const pctPyro = plastics3D > 0 ? (100 * (plastics3D_to_pyro || 0) / plastics3D) : 0;

  const totalOutput = (value) => value * intervalDays * customInterval;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard"
    >
      <Typography variant="h4" component={motion.h1}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          textAlign: 'center',
          mb: 4,
          color: 'primary.light',
          fontWeight: 700,
          letterSpacing: '-0.025em'
        }}
      >
        🗑️ Waste Processing System
      </Typography>

      <Grid container spacing={4} sx={{ 
        justifyContent: 'center', 
        width: '100%', 
        maxWidth: '1400px', 
        mx: 'auto',
        alignItems: 'flex-start',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: 'fit-content'
        }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ width: '100%' }}
          >
            <StyledCard sx={{ flex: 1, width: '100%' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'primary.light' }}>
                  Material Inputs
                </Typography>
                
                <Box sx={{ '& > :not(:last-child)': { mb: 3 } }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Metals</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {metals.toFixed(2)} kg/day
                      </Typography>
                    </Box>
                    <StyledSlider
                      value={metals}
                      min={0}
                      max={5}
                      step={0.1}
                      onChange={(e, v) => setMetals(v)}
                      sx={{ color: '#ff6b35' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Glass</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {glass.toFixed(2)} kg/day
                      </Typography>
                    </Box>
                    <Slider
                      value={glass}
                      min={0}
                      max={5}
                      step={0.1}
                      onChange={(e, v) => setGlass(v)}
                      sx={{ color: '#00ff88' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Fabrics/Foams</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {fabrics.toFixed(2)} kg/day
                      </Typography>
                    </Box>
                    <Slider
                      value={fabrics}
                      min={0}
                      max={8}
                      step={0.1}
                      onChange={(e, v) => setFabrics(v)}
                      sx={{ color: '#ff1493' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Plastics</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {plastics.toFixed(2)} kg/day
                      </Typography>
                    </Box>
                    <Slider
                      value={plastics}
                      min={0}
                      max={8}
                      step={0.1}
                      onChange={(e, v) => setPlastics(v)}
                      sx={{ color: '#ffa500' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">3D Plastics</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {plastics3D.toFixed(2)} kg/day
                      </Typography>
                    </Box>
                    <Slider
                      value={plastics3D}
                      min={0}
                      max={5}
                      step={0.1}
                      onChange={(e, v) => setPlastics3D(v)}
                      sx={{ color: '#9932cc' }}
                    />
                  </Box>

                  <Box sx={{ 
                    p: 2, 
                    border: override ? '2px solid #ff6b35' : '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: 2, 
                    background: override ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease'
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={override}
                          onChange={(e) => setOverride(e.target.checked)}
                          sx={{ 
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#ff6b35' },
                            '& .MuiSwitch-track': { backgroundColor: override ? '#ff6b35' : undefined }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography sx={{ color: '#fff', fontWeight: override ? 'bold' : 'normal' }}>
                            Override: Divert 3D plastics to pyro
                          </Typography>
                          {override && (
                            <Typography variant="caption" sx={{ color: '#ff6b35', display: 'block' }}>
                              🔄 ALL 3D plastics → Pyrolyzer (Manual Override Active)
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Recycling Interval</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {intervalDays} days
                      </Typography>
                    </Box>
                    <Slider
                      value={intervalDays}
                      min={1}
                      max={90}
                      step={1}
                      onChange={(e, v) => setIntervalDays(v)}
                      sx={{ color: '#00bfff' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Custom Output Interval</Typography>
                      <Typography color="primary.light" fontWeight="600">
                        {customInterval} sols
                      </Typography>
                    </Box>
                    <Slider
                      value={customInterval}
                      min={1}
                      max={1000}
                      step={1}
                      onChange={(e, v) => setCustomInterval(v)}
                      sx={{ color: '#9932cc' }}
                    />
                    <Typography variant="caption" sx={{ color: '#ccc', display: 'block', mt: 1 }}>
                      Range: 1-1000 sols (1 sol ≈ 24.6 hours)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: 'fit-content'
        }}>
          <Card sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            borderRadius: 1, 
            position: 'relative', 
            overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.04)', 
            background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0.02))',
            width: '100%',
            minHeight: 'fit-content'
          }}>
            {/* top-right icon */}
            <Box sx={{ position: 'absolute', right: 16, top: 16, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/><path d="M6 6l6 6 6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/></svg>
            </Box>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#00ffff' }}>System Outputs</Typography>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: '1fr 1fr',
                    lg: '1fr 1fr 1fr'
                  },
                  gap: 3,
                  alignItems: 'start'
                }}>
                  {/* Pyrolysis Feed */}
                  <Card sx={{ 
                    background: 'rgba(251, 146, 60, 0.1)', 
                    border: '1px solid rgba(251, 146, 60, 0.3)',
                    borderRadius: 2,
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    height: 'fit-content',
                    minHeight: '140px',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(251, 146, 60, 0.3)',
                      transform: 'translateY(-2px)',
                      borderColor: 'rgba(251, 146, 60, 0.5)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle1" sx={{ color: '#fb923c', mb: 1, fontWeight: 600 }}>
                        Pyrolysis Feed
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#fff', mb: 1, fontWeight: 700, lineHeight: 1 }}>
                        {pyroFeed?.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>kg/day</Typography>
                      <Typography variant="body2" sx={{ color: '#fb923c', opacity: 0.8 }}>
                        Total material to pyrolyzer
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* SOFC Electricity */}
                  <Card sx={{ 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 2,
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    height: 'fit-content',
                    minHeight: '140px',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                      transform: 'translateY(-2px)',
                      borderColor: 'rgba(34, 197, 94, 0.5)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle1" sx={{ color: '#22c55e', mb: 1, fontWeight: 600 }}>
                        SOFC Electricity
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#fff', mb: 1, fontWeight: 700, lineHeight: 1 }}>
                        {energy?.electricKWh?.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>kWh/day</Typography>
                      <Typography variant="body2" sx={{ color: '#22c55e', opacity: 0.8 }}>
                        From syngas fuel cell
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Thermal Energy (Syngas) */}
                  <Card sx={{ 
                    background: 'rgba(249, 115, 22, 0.1)', 
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    minHeight: '140px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3), 0 4px 16px rgba(234, 88, 12, 0.25)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(249, 115, 22, 0.4), 0 6px 20px rgba(234, 88, 12, 0.35)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: '#f97316', mb: 1 }}>Thermal Energy (Syngas)</Typography>
                      <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                        {energy?.thermalKWh?.toFixed(1)} <Typography component="span" variant="body2" sx={{ color: '#ccc' }}>kWh/day</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f97316', opacity: 0.8 }}>Heat from pyrolysis</Typography>
                    </CardContent>
                  </Card>

                  {/* Arc Furnace Thermal */}
                  <Card sx={{ 
                    background: 'rgba(255, 165, 0, 0.1)', 
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    minHeight: '140px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 16px rgba(255, 165, 0, 0.35), 0 4px 16px rgba(245, 158, 11, 0.2)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(255, 165, 0, 0.45), 0 6px 20px rgba(245, 158, 11, 0.3)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: '#ffa500', mb: 1 }}>Arc Furnace Thermal</Typography>
                      <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                        {arcThermal?.toFixed(1)} <Typography component="span" variant="body2" sx={{ color: '#ccc' }}>kWh/day</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ffa500', opacity: 0.8 }}>From metal+glass processing</Typography>
                    </CardContent>
                  </Card>

                  {/* Pyrolysis Oil */}
                  <Card sx={{ 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    minHeight: '140px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(37, 99, 235, 0.25)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(59, 130, 246, 0.4), 0 6px 20px rgba(37, 99, 235, 0.35)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: '#3b82f6', mb: 1 }}>Pyrolysis Oil</Typography>
                      <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                        {yields?.oilL?.toFixed(1)} <Typography component="span" variant="body2" sx={{ color: '#ccc' }}>L/day</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#3b82f6', opacity: 0.8 }}>Liquid fuel produced</Typography>
                    </CardContent>
                  </Card>

                  {/* Biochar */}
                  <Card sx={{ 
                    background: 'rgba(107, 114, 128, 0.1)', 
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    minHeight: '140px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 16px rgba(107, 114, 128, 0.3), 0 4px 16px rgba(75, 85, 99, 0.25)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(107, 114, 128, 0.4), 0 6px 20px rgba(75, 85, 99, 0.35)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>Biochar</Typography>
                      <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                        {yields?.charKg?.toFixed(1)} <Typography component="span" variant="body2" sx={{ color: '#ccc' }}>kg/day</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', opacity: 0.8 }}>Carbon for construction</Typography>
                    </CardContent>
                  </Card>

                  {/* 3D Printed Items */}
                  <Card sx={{ 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    minHeight: '140px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35), 0 4px 16px rgba(5, 150, 105, 0.2)',
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(16, 185, 129, 0.45), 0 6px 20px rgba(5, 150, 105, 0.3)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: '#10b981', mb: 1 }}>3D Printed Items</Typography>
                      <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                        {(plastics3D_to_printer * 10)?.toFixed(1)} <Typography component="span" variant="body2" sx={{ color: '#ccc' }}>items/day</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#10b981', opacity: 0.8 }}>Utensils and components</Typography>

                      {/* Visual volume and allocation */}
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                          Printer allocation: {(plastics3D_to_printer || 0).toFixed(2)} kg • {plastics3D_to_printer_L.toFixed(2)} L ({pctPrinter.toFixed(0)}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={pctPrinter} sx={{ height: 10, borderRadius: 6, mt: 0.5, backgroundColor: 'rgba(255,255,255,0.04)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#9f7aea,#7c3aed)' } }} />

                        <Typography variant="caption" sx={{ color: '#cbd5e1', mt: 1, display: 'block' }}>
                          Pyrolyzer allocation: {(plastics3D_to_pyro || 0).toFixed(2)} kg • {plastics3D_to_pyro_L.toFixed(2)} L ({pctPyro.toFixed(0)}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={pctPyro} sx={{ height: 10, borderRadius: 6, mt: 0.5, backgroundColor: 'rgba(255,255,255,0.04)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#fb923c,#f97316)' } }} />
                      </Box>
                    </CardContent>
                  </Card>
                  
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Process Flow Summary */}
      <div className="dashboard2-card dashboard2-card-glass dashboard2-card-summary mt-8 p-6" style={{ width: '100%', margin: '1.5rem auto 0' }}>
        <div className="mb-6">
          <h3 className="text-xl font-bold dashboard2-text-light-primary mb-2 tracking-wide">
            Process Flow Summary
          </h3>
        </div>
        <div className="text-sm space-y-2">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-orange-200">Metals & Glass → Arc Furnace → {arcThermal?.toFixed(1)} kWh thermal/day</span>
          </div>
          
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-blue-200">Plastics & Fabrics → Pyrolyzer → {yields?.oilL?.toFixed(1)}L oil + {yields?.charKg?.toFixed(1)}kg char/day</span>
          </div>
          
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
              <div className="dashboard2-text-purple-200">
                3D Plastics → {plastics3D > 0 ? (100 * (plastics3D_to_printer || 0) / plastics3D).toFixed(0) : 0}% Extruder ({(plastics3D_to_printer || 0).toFixed(2)} kg • {(plastics3D_to_printer_L).toFixed(2)} L • {(plastics3D_to_printer_m3).toFixed(4)} m³)
                  {' '} + {plastics3D > 0 ? (100 * (plastics3D_to_pyro || 0) / plastics3D).toFixed(0) : 0}% Pyrolyzer ({(plastics3D_to_pyro || 0).toFixed(2)} kg • {(plastics3D_to_pyro_L).toFixed(2)} L • {(plastics3D_to_pyro_m3).toFixed(4)} m³)
                {override && <span style={{ color: '#ff6b35', fontWeight: 'bold' }}> [MANUAL OVERRIDE ACTIVE]</span>}
                <div style={{ fontSize: '0.75rem', color: '#bfbfbf', marginTop: '4px' }}>
                  (Volumes computed using density ≈ {PLASTIC_DENSITY_KG_PER_L} kg/L — {((1/PLASTIC_DENSITY_KG_PER_L)*1000).toFixed(0)} g/L conversion)
                </div>
              </div>
          </div>
          
          <div className="flex items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></span>
            <span className="dashboard2-text-emerald-200">Syngas → SOFC → {energy?.electricKWh?.toFixed(1)} kWh electricity/day</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex items-center mb-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 flex-shrink-0"></span>
              <span className="dashboard2-text-yellow-200">Recycling Batch ({intervalDays} days): {((metals + glass + plastics + fabrics) * intervalDays)?.toFixed(1)}kg total materials</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
              <span className="dashboard2-text-cyan-200">Output Period ({customInterval} sols): {totalOutput(energy?.electricKWh || 0)?.toFixed(1)}kWh energy + {totalOutput(yields?.oilL || 0)?.toFixed(1)}L fuel</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

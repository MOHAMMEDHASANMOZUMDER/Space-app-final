import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { useSystem } from '../context/SystemContext';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard3() {
  const {
    energy,
    arcThermal,
    selfSufficiencyPercent,
    externalNeeded,
    waterUsage,
    waterReused,
    brickCalc,
    yields,
    systemNeed,
    pyroFeed,
    plastics3D_to_printer,
    pyrolyzerNeed,
    arcFurnaceNeed,
    printingNeed,
    brickProductionNeed,
    lifeSupportNeed,
    arcThermalEfficiency,
    generated
  } = useSystem();

  const waterSavingsPercent = Math.round((waterReused / waterUsage) * 100);

  // Computed system status (dynamic label and color)
  const statusLabel = selfSufficiencyPercent >= 60 ? 'Adequate' : selfSufficiencyPercent >= 30 ? 'Warning' : 'Critical';
  const statusColor = selfSufficiencyPercent >= 60 ? '#00ff88' : selfSufficiencyPercent >= 30 ? '#ffa500' : '#ff6b35';

  const energyData = [
    { name: 'SOFC Electricity', value: energy.electricKWh, color: '#00ff88' },
    { name: `Arc Thermal (${Math.round(arcThermalEfficiency * 100)}%)`, value: arcThermalEfficiency * arcThermal, color: '#ff6b35' },
    { name: 'External Needed', value: externalNeeded, color: '#666' }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    // compute label position outside the slice
    const radius = outerRadius + 20; // push labels outside
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const entry = energyData[index] || {};
    return (
      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: 12 }}>
        {`${entry.name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Dynamic system components using actual calculated needs from SystemContext
  const systemComponents = [
    { 
      name: 'Pyrolyzer', 
      usage: pyrolyzerNeed,
      color: '#ff6b35' 
    },
    { 
      name: 'Arc Furnace', 
      usage: arcFurnaceNeed,
      color: '#ffa500' 
    },
    { 
      name: '3D Printing', 
      usage: printingNeed,
      color: '#9932cc' 
    },
    { 
      name: 'Brick Production', 
      usage: brickProductionNeed,
      color: '#00ff88' 
    },
    {
      name: 'Life Support',
      usage: lifeSupportNeed,
      color: '#00bfff'
    }
  ];

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 100%)', minHeight: '100vh' }}>
      {/* System Status Bar at Top */}
      <Card sx={{ 
        mb: 3, 
        background: 'rgba(15, 20, 35, 0.9) !important', 
        border: `2px solid ${statusColor} !important`,
        borderRadius: '16px !important',
        overflow: 'hidden',
        backdropFilter: 'blur(10px) !important',
        boxShadow: `0 8px 32px ${statusColor}40 !important`
      }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                System Status: 
              </Typography>
              <Typography variant="h6" sx={{ color: statusColor, fontWeight: 'bold' }}>
                {statusLabel}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', ml: 1 }}>
                {selfSufficiencyPercent}% energy self-sufficient
              </Typography>
            </Box>
            <Box sx={{ 
              width: 24, 
              height: 16, 
              background: statusColor,
              borderRadius: 1,
              border: `1px solid ${statusColor}`
            }} />
          </Box>
          <LinearProgress
            variant="determinate"
            value={selfSufficiencyPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              mt: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: statusColor,
                borderRadius: 4,
              }
            }}
          />
        </CardContent>
      </Card>

      <Typography variant="h4" sx={{ mb: 3, color: '#9932cc', textAlign: 'center' }}>
        ⚡ System Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(153, 50, 204, 0.15) !important', 
            border: '1px solid #9932cc !important',
            borderRadius: '16px !important',
            backdropFilter: 'blur(10px) !important',
            boxShadow: '0 8px 32px rgba(153, 50, 204, 0.2) !important'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#9932cc', fontWeight: 'bold', textAlign: 'center' }}>Energy Balance</Typography>

              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <CircularProgress
                  variant="determinate"
                  value={selfSufficiencyPercent}
                  size={120}
                  thickness={8}
                  sx={{ color: selfSufficiencyPercent > 70 ? '#00ff88' : selfSufficiencyPercent > 40 ? '#ffa500' : '#ff6b35' }}
                />
                <Typography variant="h4" sx={{ mt: 1, color: '#fff' }}>
                  {selfSufficiencyPercent}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#ccc' }}>
                  Self-Sufficiency
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography>System Requirements: {systemNeed} kWh/day</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(generated / systemNeed) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    mt: 1,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: generated >= systemNeed ? '#00ff88' : '#ffa500'
                    }
                  }}
                />
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography>Energy Generation:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label={`SOFC: ${energy.electricKWh.toFixed(2)} kWh`} sx={{ background: '#00ff88', color: '#000' }} />
                    <Chip label={`Arc Thermal: ${arcThermal.toFixed(2)} kWh`} sx={{ background: '#ff6b35', color: '#fff' }} />
                    <Chip label={`Total Generated: ${generated.toFixed(2)} kWh`} sx={{ background: '#9932cc', color: '#fff' }} />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography>External Power Needed:</Typography>
                  <Chip
                    label={`${externalNeeded.toFixed(2)} kWh/day`}
                    sx={{
                      background: externalNeeded > 0 ? '#ff6b35' : '#00ff88',
                      color: '#fff',
                      fontSize: '1.2em'
                    }}
                  />
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(153, 50, 204, 0.15) !important', 
            border: '1px solid #9932cc !important',
            borderRadius: '16px !important',
            backdropFilter: 'blur(10px) !important',
            boxShadow: '0 8px 32px rgba(153, 50, 204, 0.2) !important'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#9932cc', fontWeight: 'bold', textAlign: 'center' }}>System Components</Typography>

              {/* Compact System Status card (dynamic) */}
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Card sx={{ 
                  background: `${statusColor}18 !important`, 
                  border: `1px solid ${statusColor} !important`, 
                  minWidth: 220,
                  borderRadius: '12px !important'
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: statusColor }}>System Status</Typography>
                    <Typography variant="h6" sx={{ color: '#fff' }}>{statusLabel}</Typography>
                    <Typography variant="caption" sx={{ color: '#ccc' }}>{selfSufficiencyPercent}% energy self-sufficient</Typography>
                  </CardContent>
                </Card>
              </Box>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={systemComponents}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #9932cc' }} />
                  <Bar dataKey="usage" fill="#9932cc" />
                </BarChart>
              </ResponsiveContainer>

              <Typography sx={{ mt: 2, mb: 1 }}>Water Recycling System:</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography>Daily Water Usage: {waterUsage.toFixed(1)} L</Typography>
                <Typography>Water Reused: {waterReused.toFixed(1)} L ({waterSavingsPercent}%)</Typography>
                <LinearProgress
                  variant="determinate"
                  value={waterSavingsPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mt: 1,
                    '& .MuiLinearProgress-bar': { backgroundColor: '#00bfff' }
                  }}
                />
              </Box>

              <Typography sx={{ mb: 1 }}>Production Summary:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label={`Bricks: ${brickCalc.count}/batch`} sx={{ background: '#ff6b35', color: '#fff' }} />
                <Chip label={`Oil: ${yields.oilL.toFixed(1)} L/day`} sx={{ background: '#00ff88', color: '#000' }} />
                <Chip label={`Char: ${yields.charKg.toFixed(1)} kg/day`} sx={{ background: '#9932cc', color: '#fff' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'rgba(153, 50, 204, 0.15) !important', 
            border: '1px solid #9932cc !important',
            borderRadius: '16px !important',
            backdropFilter: 'blur(10px) !important',
            boxShadow: '0 8px 32px rgba(153, 50, 204, 0.2) !important'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#9932cc', fontWeight: 'bold', textAlign: 'center' }}>Energy Distribution</Typography>

                  <ResponsiveContainer width="100%" height={380}>
                    <PieChart margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
                      <Pie
                        data={energyData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={4}
                      >
                        {energyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #9932cc' }} />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

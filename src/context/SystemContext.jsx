import React, { createContext, useContext, useState, useEffect } from 'react';

// Utility functions for calculations
export const pyroToEnergy = (pyroFeed) => {
  const thermalKWh = (pyroFeed * 20) / 3.6; // MJ/kg to kWh
  const electricKWh = thermalKWh * 0.55; // 55% SOFC efficiency
  return { thermalKWh, electricKWh };
};

export const pyroYields = (pyroFeed) => {
  const oilL = pyroFeed * 0.05 / 0.9; // 5% yield, density 0.9 kg/L
  const charKg = pyroFeed * 0.20; // 20% yield
  return { oilL, charKg };
};

export const bricksFromBatch = (regMass, binderMass) => {
  const totalMass = regMass + binderMass;
  const brickCount = Math.floor(totalMass / 1.6); // 1.6 kg per brick
  const brickMassKg = totalMass - (brickCount * 1.6);
  return { count: brickCount, brickMassKg };
};

export const estimateBrickStrength = (metalPercent, glassPercent, charPercent, oilPercent, regolithType, regolithData = null) => {
  let base = 5.0; // Base MPa for regolith sinter
  
  // If regolith data is available, use mineral composition
  if (regolithData && regolithData.mineral_wt_percent) {
    const minerals = regolithData.mineral_wt_percent;
    // Silica and glass help strength
    base += 0.02 * (minerals.SiO2 - 40.0);
    base += 0.05 * (regolithData.glass_content_pct || 0);
    // Iron oxide slightly helps
    base += 0.01 * (minerals.Fe2O3 || 0);
  }
  
  // Metal/glass additions help
  base += 0.04 * metalPercent;
  base += 0.02 * glassPercent;
  
  // Char/oil lower compressive strength
  base -= 0.03 * charPercent;
  base -= 0.02 * oilPercent;

  const multipliers = {
    'Basaltic': 1.1,
    'Silica-rich': 1.3,
    'Sulfate-rich': 0.9,
    'Carbonate-rich': 1.0
  };

  return Math.max(0.5, Number((base * multipliers[regolithType]).toFixed(2)));
};

const SystemContext = createContext();

export const useSystem = () => useContext(SystemContext);

export function SystemProvider({ children }) {
  console.log('SystemProvider initializing');
  
  // Dashboard 1 inputs
  const [metals, setMetals] = useState(1.2);
  const [glass, setGlass] = useState(0.8);
  const [fabrics, setFabrics] = useState(2.0);
  const [plastics, setPlastics] = useState(3.5);
  const [plastics3D, setPlastics3D] = useState(1.5);
  
  // Filament storage for 3D printing (kg)
  const [filamentStorageKg, setFilamentStorageKg] = useState(0.5);
  const filamentStorageCapacityKg = 5.0; // Max storage capacity (kg)
  const [intervalDays, setIntervalDays] = useState(7);
  const [override, setOverride] = useState(false);
  const [customInterval, setCustomInterval] = useState(30);

  // Dashboard 2 inputs
  const [raw_regPercent, setRaw_regPercent] = useState(80);
  const [raw_metalPercent, setRaw_metalPercent] = useState(5);
  const [raw_glassPercent, setRaw_glassPercent] = useState(5);
  const [raw_charPercent, setRaw_charPercent] = useState(5);
  const [raw_oilPercent, setRaw_oilPercent] = useState(5);
  const [raw_residuePercent, setRaw_residuePercent] = useState(0);
  
  // Regolith type selection
  const [regolithType, setRegolithType] = useState('Basaltic');
  
  // Computed percentages after normalization
  const [regPercent, setRegPercent] = useState(80);
  const [metalPercent, setMetalPercent] = useState(5);
  const [glassPercent, setGlassPercent] = useState(5);
  const [charPercent, setCharPercent] = useState(5);
  const [oilPercent, setOilPercent] = useState(5);
  const [residuePercent, setResiduePercent] = useState(0);

  // NASA regolith data
  const [regolithData, setRegolithData] = useState(null);

  // Fetch NASA regolith data based on selected regolith type
  useEffect(() => {
    const fetchRegolithData = async () => {
      const siteMap = {
        'Basaltic': 'jezero',
        'Silica-rich': 'gale'
      };
      
      const site = siteMap[regolithType] || 'jezero';
      
      try {
        // Try to fetch directly from public folder
        const response = await fetch(`/data/regolith_${site}.json`);
        
        if (response.ok) {
          const data = await response.json();
          setRegolithData(data);
          console.log('Regolith data loaded for', site, ':', data);
        } else {
          throw new Error(`No regolith data available for ${site}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch regolith data for ${site}, using fallback:`, error);
        
        // Use hardcoded data as fallback based on site
        const fallbackData = site === 'gale' ? {
          site: "Gale Crater",
          source: "NASA MSL Curiosity rover studies (2012–2023)",
          bulk_density_kg_m3: 1580,
          grain_size_mm: {
            median: 0.35,
            d10: 0.06,
            d90: 1.2
          },
          mineral_wt_percent: {
            SiO2: 52.3,
            Al2O3: 9.8,
            Fe2O3: 10.2,
            MgO: 6.1,
            CaO: 4.9,
            Na2O: 2.8,
            K2O: 0.6,
            TiO2: 0.8,
            SO3: 1.5,
            Cl: 0.4
          },
          glass_content_pct: 12.5,
          carbonate_pct: 1.8,
          perchlorate_ppm: 650,
          notes: "Fallback Gale Crater composition from Curiosity rover studies"
        } : {
          site: "Jezero Crater",
          source: "NASA PDS / Perseverance Rover PIXL-SHERLOC studies (2021–2023)",
          bulk_density_kg_m3: 1420,
          grain_size_mm: {
            median: 0.45,
            d10: 0.08,
            d90: 1.6
          },
          mineral_wt_percent: {
            SiO2: 44.8,
            Al2O3: 7.9,
            Fe2O3: 13.6,
            MgO: 7.5,
            CaO: 6.8,
            Na2O: 1.9,
            K2O: 0.4,
            TiO2: 1.0,
            SO3: 2.1,
            Cl: 0.6
          },
          glass_content_pct: 9.0,
          carbonate_pct: 2.5,
          perchlorate_ppm: 900,
          notes: "Fallback Jezero Crater composition from Perseverance rover studies"
        };
        
        setRegolithData(fallbackData);
      }
    };

    fetchRegolithData();
  }, [regolithType]); // Re-fetch when regolith type changes

  // Derived calculations
  const pyroFeedDefault = plastics * 0.6 + fabrics;
  const extruderDivertFraction = override ? 1.0 : 0.5;
  const pyroFeed = pyroFeedDefault + plastics3D * extruderDivertFraction;

  const energy = pyroToEnergy(pyroFeed);
  const yields = pyroYields(pyroFeed);
  const arcThermal = (metals + glass) * 3.0; // kWh/day

  const totalAvailableMass = (yields?.charKg || 0) + (yields?.oilL || 0) * 0.9 + (metals + glass); // Approximate residues
  const totalPercentage = regPercent + metalPercent + glassPercent + charPercent + oilPercent + residuePercent;
  
  // Clamp percentages if they exceed available mass
  const clampedRegPercent = totalPercentage > 100 ? (regPercent / totalPercentage) * 100 : regPercent;
  const clampedMetalPercent = totalPercentage > 100 ? (metalPercent / totalPercentage) * 100 : metalPercent;
  const clampedGlassPercent = totalPercentage > 100 ? (glassPercent / totalPercentage) * 100 : glassPercent;
  const clampedCharPercent = totalPercentage > 100 ? (charPercent / totalPercentage) * 100 : charPercent;
  const clampedOilPercent = totalPercentage > 100 ? (oilPercent / totalPercentage) * 100 : oilPercent;
  const clampedResiduePercent = totalPercentage > 100 ? (residuePercent / totalPercentage) * 100 : residuePercent;

  // Flag to indicate user-specified composition is over 100%
  const isOverallocated = totalPercentage > 100;

  const batchMass = 100; // 100 kg batch for calculations
  const regMass = batchMass * (clampedRegPercent / 100);
  const binderMass = batchMass * ((clampedCharPercent + clampedOilPercent + clampedResiduePercent) / 100);
  const brickCalc = bricksFromBatch(regMass, binderMass);
  const strengthMPa = estimateBrickStrength(clampedMetalPercent, clampedGlassPercent, clampedCharPercent, clampedOilPercent, regolithType, regolithData);

  // Dynamic system energy requirements based on actual usage
  const pyrolyzerNeed = Math.max(2, pyroFeed * 0.8); // Base 2 kWh + proportional to feed
  const arcFurnaceNeed = Math.max(3, (arcThermal * 0.2) + 3); // Base 3 kWh + thermal load
  const printingNeed = Math.max(1, plastics3D * 2); // Proportional to 3D plastic input (max potential)
  const brickProductionNeed = Math.max(2, (brickCalc?.count || 0) * 0.5 + 2); // Base 2 kWh + brick production
  const lifeSupportNeed = 12; // Fixed life support systems
  const systemNeed = pyrolyzerNeed + arcFurnaceNeed + printingNeed + brickProductionNeed + lifeSupportNeed;
  
  const arcThermalEfficiency = 0.3; // 30% thermal to electrical conversion efficiency
  const generated = energy.electricKWh + (arcThermalEfficiency * arcThermal);
  const selfSufficiencyPercent = Math.min(100, Math.round((generated / systemNeed) * 100));
  const externalNeeded = Math.max(0, systemNeed - generated);
  const waterUsage = plastics * 5; // 5 L/kg plastic washed
  const waterReused = waterUsage * 0.8; // 80% reused

  // --- Plastic routing utility (adapted from user's Python snippet) ---
  const plasticRouting = (
    plastics_3d_input_kg,
    energy_demand_kWh,
    sofc_output_kWh,
    storage_capacity_kg,
    filament_storage_kg,
    override_manual = false
  ) => {
    let to_printer = plastics_3d_input_kg;
    let to_pyro = 0.0;

    // Rule 1: If energy deficit, divert to pyro for power
    if (sofc_output_kWh < energy_demand_kWh) {
      const deficit = energy_demand_kWh - sofc_output_kWh;
      const diversion_fraction = Math.min(1.0, deficit / (energy_demand_kWh + 1e-6));
      to_pyro = plastics_3d_input_kg * diversion_fraction;
      to_printer = plastics_3d_input_kg - to_pyro;
    }

    // Rule 2: If filament storage is full, divert excess to pyro
    if (filament_storage_kg >= storage_capacity_kg) {
      to_pyro += to_printer;
      to_printer = 0.0;
    }

    // Rule 3: Manual override always sends everything to pyro
    if (override_manual) {
      to_pyro = plastics_3d_input_kg;
      to_printer = 0.0;
    }

    return { to_printer, to_pyro };
  };

  // Compute plastics3D routing using current system values
  const { to_printer: plastics3D_to_printer, to_pyro: plastics3D_to_pyro } = plasticRouting(
    plastics3D,
    systemNeed,
    generated,
    filamentStorageCapacityKg,
    filamentStorageKg,
    override
  );

  const state = {
    // Dashboard 2 raw inputs
    raw_regPercent, setRaw_regPercent,
    raw_metalPercent, setRaw_metalPercent,
    raw_glassPercent, setRaw_glassPercent,
    raw_charPercent, setRaw_charPercent,
    raw_oilPercent, setRaw_oilPercent,
    raw_residuePercent, setRaw_residuePercent,
    // Over-allocation flag
    isOverallocated,
    metals, setMetals,
    glass, setGlass,
    fabrics, setFabrics,
    plastics, setPlastics,
    plastics3D, setPlastics3D,
    intervalDays, setIntervalDays,
    override, setOverride,
    outputInterval: customInterval, setOutputInterval: setCustomInterval,
    customInterval, setCustomInterval,
    
    // Dashboard 2 computed values
    regPercent, setRegPercent,
    metalPercent, setMetalPercent,
    glassPercent, setGlassPercent,
    charPercent, setCharPercent,
    oilPercent, setOilPercent,
    residuePercent, setResiduePercent,
    regolithType, setRegolithType,

    // Derived outputs
    pyroFeed,
    energy,
  // Filament storage
  filamentStorageKg, setFilamentStorageKg,
  filamentStorageCapacityKg,
  // plastic routing outputs
  plastics3D_to_printer,
  plastics3D_to_pyro,
    yields,
    arcThermal,
    brickCalc,
    strengthMPa,
    totalAvailableMass,
    selfSufficiencyPercent,
    externalNeeded,
    waterUsage,
    waterReused,
    regolithData,
    // System component energy needs for dynamic display
    pyrolyzerNeed,
    arcFurnaceNeed,
    printingNeed,
    brickProductionNeed,
    lifeSupportNeed,
    arcThermalEfficiency,
    generated
  };

  return <SystemContext.Provider value={state}>{children}</SystemContext.Provider>;
}

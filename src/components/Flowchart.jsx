import React, { Suspense, useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- GLTF model loader component (only rendered when path exists) ---------- */
function GLTFModel({ path, scale = 1 }) {
  try {
    const gltf = useGLTF(path);
    return <primitive object={gltf.scene} scale={scale} />;
  } catch (error) {
    console.warn(`Failed to load model: ${path}`, error);
    return <ReactorFallback />;
  }
}

/* ---------- fallback primitives ---------- */
const ReactorFallback = () => (
  <mesh rotation={[0, 0, 0]}>
    <cylinderGeometry args={[0.5, 0.5, 1.0, 24]} />
    <meshStandardMaterial color={'#ff6b35'} metalness={0.3} roughness={0.5}/>
  </mesh>
);

const BatteryFallback = () => (
  <mesh>
    <boxGeometry args={[1.0, 0.5, 0.6]} />
    <meshStandardMaterial color={'#2ec4b6'} metalness={0.2} roughness={0.4}/>
  </mesh>
);

const FurnaceFallback = () => (
  <mesh>
    <sphereGeometry args={[0.6, 24, 24]} />
    <meshStandardMaterial color={'#4d7cff'} metalness={0.4} roughness={0.3}/>
  </mesh>
);

const SolarFallback = () => (
  <mesh>
    <boxGeometry args={[1.2, 0.1, 0.8]} />
    <meshStandardMaterial color={'#f59e0b'} metalness={0.1} roughness={0.2}/>
  </mesh>
);

const PrinterFallback = () => (
  <mesh>
    <boxGeometry args={[0.8, 0.6, 0.8]} />
    <meshStandardMaterial color={'#ec4899'} metalness={0.3} roughness={0.4}/>
  </mesh>
);

const ShredderFallback = () => (
  <mesh>
    <cylinderGeometry args={[0.4, 0.6, 0.8, 8]} />
    <meshStandardMaterial color={'#64748b'} metalness={0.5} roughness={0.3}/>
  </mesh>
);

const MixerFallback = () => (
  <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshStandardMaterial color={'#f97316'} metalness={0.4} roughness={0.5}/>
  </mesh>
);

/* ---------- Enhanced Custom node with animations ---------- */
const CustomNode = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getFallbackComponent = (id) => {
    if (id.includes('battery')) return <BatteryFallback />;
    if (id.includes('furnace')) return <FurnaceFallback />;
    if (id.includes('solar')) return <SolarFallback />;
    if (id.includes('printer')) return <PrinterFallback />;
    if (id.includes('shredder')) return <ShredderFallback />;
    if (id.includes('mixer')) return <MixerFallback />;
    return <ReactorFallback />;
  };

  // Simulate energy flow activity
  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 2000);
    }, 5000 + Math.random() * 3000);
    
    return () => clearInterval(interval);
  }, []);

  const nodeVariants = {
    idle: { 
      scale: 1, 
      boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
      filter: "brightness(1)"
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 12px 40px rgba(255, 107, 53, 0.4)",
      filter: "brightness(1.2)"
    },
    active: {
      scale: [1, 1.08, 1],
      boxShadow: ["0 6px 20px rgba(0,0,0,0.6)", "0 15px 50px rgba(255, 107, 53, 0.8)", "0 6px 20px rgba(0,0,0,0.6)"],
      filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"]
    }
  };

  const glowVariants = {
    idle: { opacity: 0 },
    active: { 
      opacity: [0, 0.8, 0],
      scale: [1, 1.2, 1]
    }
  };

  return (
    <div 
      style={{ width: 220, position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rf-node-group"
    >
      {/* Energy glow effect */}
      <motion.div
        variants={glowVariants}
        animate={isActive ? "active" : "idle"}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: -10,
          left: -10,
          right: -10,
          bottom: -10,
          borderRadius: 22,
          background: `radial-gradient(circle, ${data.color || '#223249'}40, transparent)`,
          filter: 'blur(8px)',
          zIndex: -1
        }}
      />

      <motion.div
        variants={nodeVariants}
        animate={isActive ? "active" : isHovered ? "hover" : "idle"}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: isActive ? 2 : 0.3
        }}
        style={{
          background: `linear-gradient(135deg, ${data.color || '#223249'}, ${data.color || '#223249'}dd)`,
          padding: '12px 16px',
          borderRadius: 12,
          textAlign:'center',
          color:'#fff',
          fontWeight:700,
          cursor:'pointer',
          boxShadow:'0 8px 25px rgba(0,0,0,0.4)',
          border: '2px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{fontSize:16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
          <motion.span 
            style={{fontSize: '20px'}}
            animate={isActive ? { 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            {data.icon}
          </motion.span>
          <motion.span
            animate={isActive ? {
              color: ['#fff', '#ff6b35', '#fff']
            } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            {data.label}
          </motion.span>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ff6b35',
                boxShadow: '0 0 10px #ff6b35'
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Enhanced hover tooltip with 3D model */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.8, rotateX: -15 }}
          transition={{ duration: 0.2 }}
          className="node-tooltip"
          style={{
            position:'absolute', 
            left:'50%', 
            transform:'translateX(-50%)',
            marginTop: 15,
            width: 380, 
            zIndex: 1200,
            background: 'linear-gradient(135deg, #1a1f2e, #2d3748)',
            borderRadius: 16,
            padding: 20,
            border: '2px solid rgba(255, 107, 53, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: 8 }}>
            {data.icon} {data.label}
          </div>
          <div style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 8, lineHeight: 1.4 }}>
            <strong>Specs:</strong> {data.specs}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 15, lineHeight: 1.4 }}>
            <strong>Purpose:</strong> {data.significance}
          </div>
          
          <div style={{ borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(180deg, #071028, #021221)' }}>
            <Canvas 
              style={{ width: '100%', height: '180px' }}
              camera={{ position: [2, 1.5, 2], fov: 45 }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.9} />
              <directionalLight position={[-5, -5, -5]} intensity={0.3} />
              <Suspense fallback={null}>
                {data.modelPath ? (
                  <GLTFModel path={data.modelPath} scale={data.modelScale || 1} />
                ) : (
                  getFallbackComponent(data.id)
                )}
              </Suspense>
              <OrbitControls 
                enableZoom={false} 
                autoRotate 
                autoRotateSpeed={2}
                enablePan={false}
              />
            </Canvas>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <Handle type="target" position="top" style={{ background: "#ff6b35", width: 8, height: 8 }} />
      <Handle type="source" position="bottom" style={{ background: "#ff6b35", width: 8, height: 8 }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

/* ---------- Waste2Watt system nodes & edges ---------- */
const initialNodes = [
  // Inputs
  { id: "metals", type: "custom", position: { x: -800, y: 0 }, data: { id: "metals", label: "Metals", icon: "🛠", specs: "• Sorted by ML camera\n• Direct to Arc Furnace", significance: "Metal waste input from crew.", color: "#b0b8c4" } },
  { id: "glass", type: "custom", position: { x: -800, y: 100 }, data: { id: "glass", label: "Glass", icon: "🧪", specs: "• Sorted by ML camera\n• Direct to Arc Furnace", significance: "Glass waste input from crew.", color: "#b0b8c4" } },
  { id: "fabrics", type: "custom", position: { x: -800, y: 200 }, data: { id: "fabrics", label: "Fabrics & Foams", icon: "🧵", specs: "• Sorted by ML camera\n• To Shredder", significance: "Fabric and foam waste input.", color: "#b0b8c4" } },
  { id: "plastics", type: "custom", position: { x: -800, y: 300 }, data: { id: "plastics", label: "Plastics", icon: "♻", specs: "• Sorted by ML camera\n• To Shredder", significance: "Plastic waste input.", color: "#b0b8c4" } },
  { id: "plastics3d", type: "custom", position: { x: -800, y: 400 }, data: { id: "plastics3d", label: "Plastics (3D Print)", icon: "🖨", specs: "• Sorted by ML camera\n• To Shredder", significance: "3D-printable plastics input.", color: "#b0b8c4" } },
  // ML Pre-sort
  { id: "mlsort", type: "custom", position: { x: -600, y: 200 }, data: { id: "mlsort", label: "ML Pre-sort Camera", icon: "🤖", specs: "• AI vision sorting\n• Directs waste to correct path", significance: "Automated sorting of all input waste.", color: "#fbbf24" } },
  // Shredder
  { id: "shredder", type: "custom", position: { x: -400, y: 200 }, data: { id: "shredder", label: "Shredder", icon: "🔪", specs: "• 3 kW motor\n• 20–40 kg/hr\n• Multi-material", significance: "Reduces size of plastics, fabrics, foams.", color: "#64748b" } },
  // 3D Printing Path
  { id: "washer", type: "custom", position: { x: -200, y: 100 }, data: { id: "washer", label: "Washer Tank", icon: "💧", specs: "• Water-based cleaning\n• Greywater output", significance: "Washes shredded plastics for printing.", color: "#06b6d4" } },
  { id: "greytank", type: "custom", position: { x: 0, y: 100 }, data: { id: "greytank", label: "Greywater Tank", icon: "🪣", specs: "• Collects used wash water\n• Feeds filter train", significance: "Stores greywater for recycling.", color: "#06b6d4" } },
  { id: "filter", type: "custom", position: { x: 200, y: 100 }, data: { id: "filter", label: "Filter Train", icon: "🧼", specs: "• Multi-stage filtration\n• Removes solids/contaminants", significance: "Cleans greywater for reuse.", color: "#06b6d4" } },
  { id: "sludge", type: "custom", position: { x: 400, y: 100 }, data: { id: "sludge", label: "Sludge → Pyro", icon: "🟫", specs: "• Settled solids\n• Sent to pyrolysis", significance: "Waste solids from water cleaning.", color: "#ef4444" } },
  { id: "dryer", type: "custom", position: { x: -200, y: 200 }, data: { id: "dryer", label: "Dryer", icon: "🌬", specs: "• Removes moisture\n• Prepares for extrusion", significance: "Dries washed plastics.", color: "#fbbf24" } },
  { id: "extruder", type: "custom", position: { x: 0, y: 200 }, data: { id: "extruder", label: "Extruder + Spooler", icon: "🎛", specs: "• Melts & extrudes plastic\n• Spools filament", significance: "Creates 3D printer filament.", color: "#ec4899" } },
  { id: "printer", type: "custom", position: { x: 200, y: 200 }, data: { id: "printer", label: "3D Printer / Storage", icon: "🖨", specs: "• 1–2 kWh/kg filament\n• Multi-material\n• 0.2mm precision", significance: "Prints tools, parts, stores filament.", color: "#ec4899" } },
  // Pyrolysis Path
  { id: "pyro", type: "custom", position: { x: 400, y: 300 }, data: { id: "pyro", label: "Pyrolyzer", icon: "🔥", specs: "• 6 kW heater\n• 400-600°C\n• Syngas, char, oil", significance: "Thermal breakdown of waste.", color: "#ef4444" } },
  { id: "cyclone", type: "custom", position: { x: 600, y: 300 }, data: { id: "cyclone", label: "Cyclone Separator", icon: "🌀", specs: "• Removes particulates\n• Protects downstream units", significance: "Cleans pyro-gas.", color: "#fbbf24" } },
  { id: "char", type: "custom", position: { x: 800, y: 300 }, data: { id: "char", label: "Char", icon: "🟫", specs: "• Solid carbon\n• Feedstock for mixer", significance: "Char for regolith composites.", color: "#f97316" } },
  { id: "condenser", type: "custom", position: { x: 400, y: 400 }, data: { id: "condenser", label: "Condenser", icon: "❄️", specs: "• Cools pyro-gas\n• Collects oil", significance: "Condenses oil from pyro-gas.", color: "#06b6d4" } },
  { id: "oilsump", type: "custom", position: { x: 600, y: 400 }, data: { id: "oilsump", label: "Oil Sump", icon: "🛢", specs: "• Collects oil\n• Feeds oil tank", significance: "Oil collection for storage.", color: "#fbbf24" } },
  { id: "oiltank", type: "custom", position: { x: 800, y: 400 }, data: { id: "oiltank", label: "Heated Oil Tank", icon: "🔥", specs: "• Keeps oil liquid\n• Feeds polisher", significance: "Stores oil for use in composites.", color: "#ef4444" } },
  { id: "oilpolish", type: "custom", position: { x: 1000, y: 400 }, data: { id: "oilpolish", label: "Polishing Filter", icon: "🧽", specs: "• Removes impurities\n• Feeds mixer", significance: "Final oil cleaning.", color: "#06b6d4" } },
  { id: "gasclean", type: "custom", position: { x: 400, y: 500 }, data: { id: "gasclean", label: "Gas Cleanup + Cracker", icon: "🧪", specs: "• Removes tars\n• Prepares gas for SOFC", significance: "Cleans gas for fuel cell.", color: "#7c3aed" } },
  { id: "sofc", type: "custom", position: { x: 600, y: 500 }, data: { id: "sofc", label: "SOFC Generator", icon: "⚡", specs: "• 14 kWh/day output\n• 800-1000°C\n• 60% efficiency", significance: "Converts syngas to electricity & heat.", color: "#7c3aed" } },
  { id: "pyroheat", type: "custom", position: { x: 800, y: 500 }, data: { id: "pyroheat", label: "Pyro Heat (HX)", icon: "♨", specs: "• Heat recovery\n• Feeds thermal battery", significance: "Captures waste heat from pyrolysis.", color: "#f59e0b" } },
  // Arc Furnace Path
  { id: "arc", type: "custom", position: { x: 400, y: 600 }, data: { id: "arc", label: "Arc Furnace", icon: "⚡", specs: "• 50 kW pulse\n• 1500°C\n• Melts metals/glass", significance: "Melts metals and glass.", color: "#2563eb" } },
  { id: "hx", type: "custom", position: { x: 600, y: 600 }, data: { id: "hx", label: "Heat Recovery (HX)", icon: "♨", specs: "• Recovers heat\n• Feeds thermal battery", significance: "Captures waste heat from arc furnace.", color: "#f59e0b" } },
  { id: "molten", type: "custom", position: { x: 800, y: 600 }, data: { id: "molten", label: "Molten Metal/Glass", icon: "🫙", specs: "• Feeds mixer", significance: "Molten output for composites.", color: "#f97316" } },
  // Structural/Composites Path
  { id: "mix", type: "custom", position: { x: 1000, y: 600 }, data: { id: "mix", label: "Mixer: Regolith + Char + Oil + Residues", icon: "🧱", specs: "• Combines all feedstocks\n• 0.7 kWh/block", significance: "Mixes for bricks/panels.", color: "#f97316" } },
  { id: "press", type: "custom", position: { x: 1200, y: 600 }, data: { id: "press", label: "Hydraulic Press", icon: "🛠", specs: "• Forms blocks", significance: "Presses mix into shape.", color: "#b0b8c4" } },
  { id: "sinter", type: "custom", position: { x: 1400, y: 600 }, data: { id: "sinter", label: "Sinterer / Kiln", icon: "🔥", specs: "• High-temp sintering", significance: "Hardens blocks.", color: "#ef4444" } },
  { id: "bricks", type: "custom", position: { x: 1600, y: 600 }, data: { id: "bricks", label: "Bricks / Panels", icon: "🧱", specs: "• Habitat construction", significance: "Final output for building.", color: "#b0b8c4" } },
  // Energy & Water Loops
  { id: "missionbus", type: "custom", position: { x: -100, y: -200 }, data: { id: "missionbus", label: "Mission Power Bus (Input)", icon: "🔌", specs: "• External power\n• Feeds all subsystems", significance: "Backup/primary power input.", color: "#10b981" } },
  { id: "thermalbatt", type: "custom", position: { x: 1000, y: 200 }, data: { id: "thermalbatt", label: "Thermal Battery", icon: "🟠", specs: "• Stores waste heat\n• Feeds washer, dryer, pyro, sinter", significance: "Thermal energy storage and reuse.", color: "#f59e0b" } },
  { id: "waterloop", type: "custom", position: { x: 200, y: 0 }, data: { id: "waterloop", label: "Water Recycling Loop", icon: "🔄", specs: "• 95% recovery\n• Feeds washer, dryer", significance: "Closed-loop water reuse.", color: "#06b6d4" } },
  { id: "outelec", type: "custom", position: { x: 600, y: -100 }, data: { id: "outelec", label: "Electrical Output (SOFC)", icon: "⚡", specs: "• Feeds mission bus", significance: "Electricity for habitat.", color: "#7c3aed" } },
  { id: "outtherm", type: "custom", position: { x: 1000, y: -100 }, data: { id: "outtherm", label: "Thermal Output (HX)", icon: "♨", specs: "• Feeds thermal battery", significance: "Thermal energy for reuse.", color: "#f59e0b" } },
];

const initialEdges = [
      // Inputs to ML sort
      { id: "e_metals_mlsort", source: "metals", target: "mlsort", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      { id: "e_glass_mlsort", source: "glass", target: "mlsort", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      { id: "e_fabrics_mlsort", source: "fabrics", target: "mlsort", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      { id: "e_plastics_mlsort", source: "plastics", target: "mlsort", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      { id: "e_plastics3d_mlsort", source: "plastics3d", target: "mlsort", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      // ML sort to Shredder/Arc
      { id: "e_mlsort_shredder", source: "mlsort", target: "shredder", animated: true, style: { stroke: '#64748b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, label: "Plastics, Fabrics, Foams" },
      { id: "e_mlsort_arc", source: "mlsort", target: "arc", animated: true, style: { stroke: '#2563eb', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' }, label: "Metals, Glass" },
      // Shredder to Washer/Pyro
      { id: "e_shredder_washer", source: "shredder", target: "washer", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' }, label: "40% Plastics" },
      { id: "e_shredder_pyro", source: "shredder", target: "pyro", animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, label: "60% Plastics, Fabrics" },
      // Washer to GreyTank/Dryer
      { id: "e_washer_greytank", source: "washer", target: "greytank", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
      { id: "e_washer_dryer", source: "washer", target: "dryer", animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' } },
      // GreyTank to Filter/Sludge
      { id: "e_greytank_filter", source: "greytank", target: "filter", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
      { id: "e_greytank_sludge", source: "greytank", target: "sludge", animated: true, style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '4 4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, label: "Sludge" },
      // Filter to Washer (loop)
      { id: "e_filter_washer", source: "filter", target: "washer", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
      // Sludge to Pyro
      { id: "e_sludge_pyro", source: "sludge", target: "pyro", animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
      // Dryer to Extruder
      { id: "e_dryer_extruder", source: "dryer", target: "extruder", animated: true, style: { stroke: '#ec4899', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
      // Extruder to Printer
      { id: "e_extruder_printer", source: "extruder", target: "printer", animated: true, style: { stroke: '#ec4899', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
      // Extruder override to Pyro
      { id: "e_extruder_pyro", source: "extruder", target: "pyro", animated: true, style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '2 6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, label: "Override Feed" },
      // Pyro to Cyclone/PyroHeat
      { id: "e_pyro_cyclone", source: "pyro", target: "cyclone", animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' } },
      { id: "e_pyro_pyroheat", source: "pyro", target: "pyroheat", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      // Cyclone to Char/Condenser
      { id: "e_cyclone_char", source: "cyclone", target: "char", animated: true, style: { stroke: '#f97316', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
      { id: "e_cyclone_condenser", source: "cyclone", target: "condenser", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
      // Char to Mixer
      { id: "e_char_mix", source: "char", target: "mix", animated: true, style: { stroke: '#f97316', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
      // Condenser to OilSump/GasClean
      { id: "e_condenser_oilsump", source: "condenser", target: "oilsump", animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' } },
      { id: "e_condenser_gasclean", source: "condenser", target: "gasclean", animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' } },
      // OilSump to OilTank
      { id: "e_oilsump_oiltank", source: "oilsump", target: "oiltank", animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
      // OilTank to OilPolish
      { id: "e_oiltank_oilpolish", source: "oiltank", target: "oilpolish", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
      // OilPolish to Mixer
      { id: "e_oilpolish_mix", source: "oilpolish", target: "mix", animated: true, style: { stroke: '#f97316', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
      // GasClean to SOFC
      { id: "e_gasclean_sofc", source: "gasclean", target: "sofc", animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' } },
      // SOFC to OutElec
      { id: "e_sofc_outelec", source: "sofc", target: "outelec", animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed' } },
      // PyroHeat to OutTherm
      { id: "e_pyroheat_outtherm", source: "pyroheat", target: "outtherm", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      // Arc to HX/Molten
      { id: "e_arc_hx", source: "arc", target: "hx", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      { id: "e_arc_molten", source: "arc", target: "molten", animated: true, style: { stroke: '#f97316', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
      // HX to OutTherm
      { id: "e_hx_outtherm", source: "hx", target: "outtherm", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      // Molten to Mixer
      { id: "e_molten_mix", source: "molten", target: "mix", animated: true, style: { stroke: '#f97316', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
      // Mixer to Press
      { id: "e_mix_press", source: "mix", target: "press", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      // Press to Sinter
      { id: "e_press_sinter", source: "press", target: "sinter", animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
      // Sinter to Bricks
      { id: "e_sinter_bricks", source: "sinter", target: "bricks", animated: true, style: { stroke: '#b0b8c4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#b0b8c4' } },
      // OutElec to MissionBus
      { id: "e_outelec_missionbus", source: "outelec", target: "missionbus", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      // OutTherm to ThermalBatt
      { id: "e_outtherm_thermalbatt", source: "outtherm", target: "thermalbatt", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      // ThermalBatt to Washer/Dryer/Pyro/Sinter
      { id: "e_thermalbatt_washer", source: "thermalbatt", target: "washer", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      { id: "e_thermalbatt_dryer", source: "thermalbatt", target: "dryer", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      { id: "e_thermalbatt_pyro", source: "thermalbatt", target: "pyro", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      { id: "e_thermalbatt_sinter", source: "thermalbatt", target: "sinter", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      // MissionBus to all powered nodes
      { id: "e_missionbus_shredder", source: "missionbus", target: "shredder", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_washer", source: "missionbus", target: "washer", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_dryer", source: "missionbus", target: "dryer", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_extruder", source: "missionbus", target: "extruder", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_pyro", source: "missionbus", target: "pyro", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_arc", source: "missionbus", target: "arc", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_mix", source: "missionbus", target: "mix", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_press", source: "missionbus", target: "press", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      { id: "e_missionbus_sinter", source: "missionbus", target: "sinter", animated: true, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
      // Water loop
      { id: "e_waterloop_washer", source: "waterloop", target: "washer", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
      { id: "e_waterloop_dryer", source: "waterloop", target: "dryer", animated: true, style: { stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '2 2' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
];

export default function Flowchart() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '800px', background: 'linear-gradient(135deg, #0a0f1a, #1a1f2e)', borderRadius: 16, overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
      >
        <Controls 
          style={{ 
            button: { 
              backgroundColor: '#1a1f2e', 
              color: '#fff', 
              borderColor: '#ff6b35' 
            } 
          }} 
        />
        <MiniMap 
          nodeColor={(node) => node.data.color ?? '#888'} 
          style={{ 
            backgroundColor: '#1a1f2e',
            border: '2px solid rgba(255, 107, 53, 0.3)'
          }}
        />
        <Background 
          gap={20} 
          size={1} 
          color="#2d3748" 
          style={{ backgroundColor: 'transparent' }}
        />
      </ReactFlow>
    </div>
  );
}
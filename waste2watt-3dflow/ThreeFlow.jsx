// Required dependencies:
//   react, react-dom
//   @react-three/fiber
//   three
//   @react-three/drei (for OrbitControls, etc.)
//   lil-gui (or another GUI library, optional)

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import GUI from 'lil-gui';

function Node({ position, name, color = 0xffffff, size = 1.2 }) {
  const meshRef = useRef();
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        metalness={0.1}
        roughness={0.4}
      />
      <Html distanceFactor={10}>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '2px 6px',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '14px'
        }}>
          {name}
        </div>
      </Html>
    </mesh>
  );
}

// Flow component: renders tube + animated particles
function Flow({ start, end, color = 0xffffff, radius = 0.1, particleCount = 20, speed = 0.5, heightBias = 1, visible = true }) {
  const groupRef = useRef();
  const particles = useRef([]);
  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += heightBias;
    return new THREE.CatmullRomCurve3([start.clone(), mid, end.clone()]);
  }, [start, end, heightBias]);

  const tube = useMemo(() => {
    const geo = new THREE.TubeGeometry(curve, 80, radius, 8, false);
    const mat = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    return <mesh geometry={geo} material={mat} />;
  }, [curve, color, radius]);

  // initialize particles
  useEffect(() => {
    const arr = [];
    const pGeo = new THREE.SphereGeometry(radius * 0.45, 10, 10);
    const pMat = new THREE.MeshBasicMaterial({
      color,
      toneMapped: false,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.8,
    });
    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(pGeo, pMat);
      arr.push({ mesh, t: i / particleCount });
      groupRef.current.add(mesh);
    }
    particles.current = arr;
    // cleanup
    return () => {
      arr.forEach(p => {
        groupRef.current.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });
    };
  }, [particleCount, color, radius]);

  useFrame((state, delta) => {
    if (!visible) return;
    particles.current.forEach(p => {
      p.t = (p.t + speed * delta * 0.2) % 1;
      const pt = curve.getPointAt(p.t);
      p.mesh.position.copy(pt);
    });
  });

  return (
    <group ref={groupRef} visible={visible}>
      {tube}
    </group>
  );
}

// Main scene component
export default function Waste2WattFlow({ overrideMode = false }) {
  // config / GUI state
  const [cfg, setCfg] = useState({
    speedMultiplier: 1.0,
    showGas: true,
    showSolids: true,
    showWater: true,
    showElectricity: true,
    showOverride: overrideMode,
    labels: true,
  });

  const flows = useRef([]);

  // on mount: initialize GUI
  useEffect(() => {
    const gui = new GUI({ title: 'Flow Controls' });
    gui.add(cfg, 'speedMultiplier', 0.1, 3.0, 0.05).name('Speed x').onChange(v => {
      setCfg(c => ({ ...c, speedMultiplier: v }));
    });
    gui.add(cfg, 'showGas').name('Show Gas/Oil').onChange(v => {
      setCfg(c => ({ ...c, showGas: v }));
    });
    gui.add(cfg, 'showSolids').name('Show Char/Bricks').onChange(v => {
      setCfg(c => ({ ...c, showSolids: v }));
    });
    gui.add(cfg, 'showWater').name('Show Water/Grey').onChange(v => {
      setCfg(c => ({ ...c, showWater: v }));
    });
    gui.add(cfg, 'showElectricity').name('Show Electricity').onChange(v => {
      setCfg(c => ({ ...c, showElectricity: v }));
    });
    gui.add(cfg, 'showOverride').name('Override: 3D→Pyro').onChange(v => {
      setCfg(c => ({ ...c, showOverride: v }));
    });
    gui.add(cfg, 'labels').name('Show labels').onChange(v => {
      setCfg(c => ({ ...c, labels: v }));
    });

    return () => {
      gui.destroy();
    };
  }, [cfg]);

  // define node positions (same as before)
  const pos = {
    bins: new THREE.Vector3(-14, 0, 0),
    ML: new THREE.Vector3(-9, 0, 0),
    Shred: new THREE.Vector3(-4, 0, 0),
    Washer: new THREE.Vector3(-1.5, 0, -6),
    Dryer: new THREE.Vector3(1.5, 0, -6),
    Extruder: new THREE.Vector3(4, 0, -6),
    Printer: new THREE.Vector3(7.5, 0, -6),
    Pyro: new THREE.Vector3(2.5, 0, 0),
    Cyclone: new THREE.Vector3(5.5, 0, 0),
    Condenser: new THREE.Vector3(8.5, 0, 0),
    OilTank: new THREE.Vector3(11.5, 0, 0),
    SOFC: new THREE.Vector3(11.5, 4, 0),
    Arc: new THREE.Vector3(16, 0, 0),
    HX: new THREE.Vector3(19, 2.5, 0),
    Mixer: new THREE.Vector3(14, -4, 4),
    Press: new THREE.Vector3(16, -4, 8),
    Sinter: new THREE.Vector3(18, -4, 12),
    Bricks: new THREE.Vector3(21, -4, 12),
    MissionBus: new THREE.Vector3(11.5, -4, 0),
  };

  return (
    <Canvas camera={{ position: [18, 14, 28], fov: 50, near: 0.1, far: 1000 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[30, 40, 20]} intensity={1.6} />
      <OrbitControls />

      {/* Nodes */}
      {Object.entries(pos).map(([key, v]) => (
        <Node key={key} position={v} name={key} />
      ))}

      {/* Flows */}
      <Flow
        start={pos.bins}
        end={pos.ML}
        color={0xaaaaaa}
        radius={0.08}
        particleCount={8}
        speed={0.2 * cfg.speedMultiplier}
        visible={true}
      />
      <Flow
        start={pos.ML}
        end={pos.Shred}
        color={0xffff66}
        radius={0.08}
        particleCount={10}
        speed={0.25 * cfg.speedMultiplier}
        visible={true}
      />
      <Flow
        start={pos.Shred}
        end={pos.Washer}
        color={0xf2b8c3}
        radius={0.12}
        particleCount={14}
        speed={0.34 * cfg.speedMultiplier}
        visible={cfg.showWater}
      />
      {/* Add the rest in same fashion... */}
      <Flow
        start={pos.Extruder}
        end={pos.Pyro}
        color={0xff6b6b}
        radius={0.12}
        particleCount={16}
        speed={0.45 * cfg.speedMultiplier}
        visible={cfg.showOverride}
      />
      {/* etc */}
    </Canvas>
  );
}

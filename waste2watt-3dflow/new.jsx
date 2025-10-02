import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, GizmoHelper, GizmoViewport, useTexture } from
"@react-three/drei";
import * as THREE from "three";
/* ----------------------
Node with label
---------------------- */
function Node({ name, color = 0xffffff, position = [0, 0, 0], size = 1 }) {
const ref = useRef();
useFrame(() => {
const t = performance.now() * 0.001;
const s = 1 + 0.03 * Math.sin(t * (name.length + 2));
if (ref.current) ref.current.scale.set(s, s, s);
});
return (
<group position={position}>
<mesh ref={ref}>
<sphereGeometry args={[size, 32, 32]} />
<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
</mesh>
<Html distanceFactor={6} position={[0, size + 0.4, 0]}>
<div style={{
background: "rgba(0,0,0,0.65)",
padding: "4px 8px",
borderRadius: 6,
color: "#fff",
fontSize: 12
}}>
{name}
</div>
</Html>
</group>
);
}
/* ----------------------
TubeFlow with labels
---------------------- */
function TubeFlow({ points, color, radius, particleCount, speed, label, content }) {
const curve = useMemo(
() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
[points]
);
const particles = useMemo(
() =>
Array.from({ length: particleCount }).map((_, i) => ({
t: i / particleCount,
pos: new THREE.Vector3()
})),
[particleCount]
);
useFrame((_, delta) => {
particles.forEach((p) => {
p.t = (p.t + speed * delta * 0.25) % 1;
curve.getPointAt(p.t, p.pos);
});
});
const mid = useMemo(() => {
const v = new THREE.Vector3();
curve.getPointAt(0.5, v);
return v;
}, [curve]);
return (
<group>
<mesh>
<tubeGeometry args={[curve, 64, radius, 8, false]} />
<meshStandardMaterial color={color} transparent opacity={0.25} />
</mesh>
{particles.map((p, i) => (
<mesh key={i} position={p.pos}>
<sphereGeometry args={[radius * 0.5, 10, 10]} />
<meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
</mesh>
))}
<Html position={[mid.x, mid.y + radius * 1.5, mid.z]} distanceFactor={8}>
<div style={{
background: "rgba(20,20,20,0.8)",
padding: "4px 8px",
borderRadius: 6,
fontSize: 11,
color: "#fff",
textAlign: "center"
}}>
<strong>{label}</strong>
<div style={{ fontSize: 10, opacity: 0.8 }}>{content}</div>
</div>
</Html>
</group>
);
}
/* ----------------------
Main Scene
---------------------- */
export default function ThreeFlow({ width = "100%", height = "720px" }) {
const pos = {
bins: [-14, 0, 0],
ML: [-9, 0, 0],
Shred: [-4, 0, 0],
Washer: [-1.5, 0, -6],
Dryer: [1.5, 0, -6],
Extruder: [4, 0, -6],
Printer: [7.5, 0, -6],
Pyro: [2.5, 0, 0],
Cyclone: [5.5, 0, 0],
Condenser: [8.5, 0, 0],
Oil: [11.5, 0, 0],
SOFC: [11.5, 4, 0],
Arc: [16, 0, 0],
HX: [19, 2.5, 0],
Mixer: [14, -4, 4],
Press: [16, -4, 8],
Sinter: [18, -4, 12],
Bricks: [21, -4, 12],
Bus: [11.5, -4, 0]
};
const nodes = useMemo(() => ({
bins: { name: "Input Bins", color: 0x8b8b8b, pos: pos.bins, size: 1.4 },
ML: { name: "ML Pre-sort", color: 0xffd166, pos: pos.ML, size: 1 },
Shred: { name: "Shredder", color: 0xf77f00, pos: pos.Shred, size: 1.1 },
Washer: { name: "Washer", color: 0x2ec4ff, pos: pos.Washer, size: 1 },
Dryer: { name: "Dryer", color: 0x9bdc8b, pos: pos.Dryer, size: 1 },
Extruder: { name: "Extruder", color: 0xfff1c1, pos: pos.Extruder, size: 1 },
Printer: { name: "3D Printer", color: 0xd0bfff, pos: pos.Printer, size: 1 },
Pyro: { name: "Pyrolyzer", color: 0xff7f50, pos: pos.Pyro, size: 1.4 },
Cyclone: { name: "Cyclone", color: 0xc78b3a, pos: pos.Cyclone, size: 1 },
Condenser: { name: "Condenser", color: 0x2fa6ff, pos: pos.Condenser, size: 1 },
Oil: { name: "Oil Tank", color: 0xdb4b6b, pos: pos.Oil, size: 1 },
SOFC: { name: "SOFC Stack", color: 0x00ffad, pos: pos.SOFC, size: 1.2 },
Arc: { name: "Arc Furnace", color: 0x7f8cff, pos: pos.Arc, size: 1.4 },
HX: { name: "Heat Exchanger", color: 0xffcc66, pos: pos.HX, size: 1 },
Mixer: { name: "Regolith Mixer", color: 0xb47f3f, pos: pos.Mixer, size: 1.1 },
Press: { name: "Hydraulic Press", color: 0xffe099, pos: pos.Press, size: 1 },
Sinter: { name: "Sinterer", color: 0xffb3a7, pos: pos.Sinter, size: 1 },
Bricks: { name: "Bricks", color: 0x9be7a3, pos: pos.Bricks, size: 1 },
Bus: { name: "Mission Bus", color: 0x3bf0ff, pos: pos.Bus, size: 1 }
}), []);
const flows = useMemo(() => [
{ from: nodes.bins.pos, to: nodes.ML.pos, color: "#aaaaaa", label: "Bins → ML", content:
"Mixed Waste" },
{ from: nodes.ML.pos, to: nodes.Shred.pos, color: "#ffff66", label: "ML → Shredder", content:
"Sorted Waste" },
{ from: nodes.Shred.pos, to: nodes.Washer.pos, color: "#00cfff", label: "Shredder → Washer",
content: "Plastic Flakes" },
{ from: nodes.Washer.pos, to: nodes.Dryer.pos, color: "#7fe0ff", label: "Washer → Dryer",
content: "Wet Plastic" },
{ from: nodes.Dryer.pos, to: nodes.Extruder.pos, color: "#ffd27f", label: "Dryer → Extruder",
content: "Dry Flakes" },
{ from: nodes.Extruder.pos, to: nodes.Printer.pos, color: "#cfa8ff", label: "Extruder → Printer",
content: "Filament" },
{ from: nodes.Shred.pos, to: nodes.Pyro.pos, color: "#ff7f50", label: "Shredder → Pyro",
content: "Feedstock" },
{ from: nodes.Pyro.pos, to: nodes.Cyclone.pos, color: "#c78b3a", label: "Pyro → Cyclone",
content: "Hot Vapors" },
{ from: nodes.Cyclone.pos, to: nodes.Condenser.pos, color: "#2fa6ff", label: "Cyclone → Condenser", content: "Clean Gas" },
{ from: nodes.Condenser.pos, to: nodes.Oil.pos, color: "#db4b6b", label: "Condenser → Oil Tank", content: "Pyro-oil" },
{ from: nodes.Condenser.pos, to: nodes.SOFC.pos, color: "#ffd166", label: "Condenser → SOFC", content: "Syngas" },
{ from: nodes.Arc.pos, to: nodes.HX.pos, color: "#ffcc66", label: "Arc → HX", content: "Waste Heat" },
{ from: nodes.Arc.pos, to: nodes.Mixer.pos, color: "#7f8cff", label: "Arc → Mixer", content: "Molten Metals" },
{ from: nodes.Mixer.pos, to: nodes.Press.pos, color: "#c78b3a", label: "Mixer → Press",
content: "Composite Mix" },
{ from: nodes.Press.pos, to: nodes.Sinter.pos, color: "#c78b3a", label: "Press → Sinter",
content: "Pressed Blocks" },
{ from: nodes.Sinter.pos, to: nodes.Bricks.pos, color: "#9be7a3", label: "Sinter → Storage",
content: "Bricks" },
{ from: nodes.Oil.pos, to: nodes.Mixer.pos, color: "#db4b6b", label: "Oil → Mixer", content:
"Binder" },
{ from: nodes.Bus.pos, to: nodes.Shred.pos, color: "#00ffad", label: "Bus → Shredder",
content: "Power" },
{ from: nodes.Bus.pos, to: nodes.Pyro.pos, color: "#00ffad", label: "Bus → Pyro", content:
"Power" },
{ from: nodes.Bus.pos, to: nodes.Arc.pos, color: "#00ffad", label: "Bus → Arc", content:
"Power" }
], [nodes]);
const texture = useTexture("/assets/jezero.jpg");
return (
<div style={{ width, height, position: "relative" }}>
{/* Legend */}
<div style={{
position: "absolute", top: 16, left: 16, zIndex: 10,
background: "rgba(0,0,0,0.6)", color: "#fff",
padding: 10, borderRadius: 8, fontSize: 12
}}>
<strong>Legend:</strong><br />
🔵 Water / Coolant<br />
🟠 Pyro Feedstock<br />
🟣 Plastics → Printer<br />
🟢 Electrical Power<br />
🔴 Oil<br />
🌟 Syngas / Vapors
</div>
<Canvas camera={{ position: [18, 14, 28], fov: 50 }}>
<ambientLight intensity={0.4} />
<pointLight position={[30, 40, 20]} intensity={1.2} />
<GizmoHelper alignment="bottom-right" margin={[80, 80]}>
<GizmoViewport />
</GizmoHelper>
<OrbitControls />
{/* Background plane with Jezero Crater */}
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
<planeGeometry args={[200, 200]} />
<meshBasicMaterial map={texture} />
</mesh>
{/* Nodes */}
{Object.values(nodes).map((n, i) => (
<Node key={i} name={n.name} color={n.color} position={n.pos} size={n.size} />
))}
{/* Flows */}
{flows.map((f, i) => (
<TubeFlow
key={i}
points={[f.from, f.to]}
color={f.color}
radius={0.12}
particleCount={14}
speed={0.6}
label={f.label}
content={f.content}
/>
))}
</Canvas>
</div>
);
}
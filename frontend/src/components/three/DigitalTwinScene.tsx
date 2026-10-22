import { useState, useEffect, useRef, useMemo } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TwinNodeStatus = 'healthy' | 'anomaly' | 'dim';

export interface TwinNode {
  id: string;
  status: TwinNodeStatus;
}

interface NodeDef {
  id: string;
  position: [number, number, number];
  status: TwinNodeStatus;
}

// ─── Scene constants ─────────────────────────────────────────────────────────

const HUB_POS: [number, number, number] = [0, 0, 0];

const COLOR_HEALTHY = new THREE.Color('#6366f1'); // Indigo
const COLOR_ANOMALY = new THREE.Color('#f59e0b'); // Amber
const COLOR_DIM     = new THREE.Color('#94a3b8'); // Slate 400 (visible on dark & light)
const COLOR_HUB     = new THREE.Color('#a855f7'); // Purple

// ─── Hub ─────────────────────────────────────────────────────────────────────

function Hub({ paused }: { paused: boolean }) {
  const meshRef    = useRef<THREE.Mesh>(null);
  const ringRef    = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (paused) return;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      const t = performance.now() / 1000;
      const s = 1 + 0.08 * Math.sin(t * 1.4);
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.25 + 0.1 * Math.sin(t * 1.4);
    }
  });

  return (
    <group position={HUB_POS}>
      {/* Core sphere */}
      <Sphere ref={meshRef} args={[0.42, 32, 32]}>
        <meshStandardMaterial
          color={COLOR_HUB}
          emissive={COLOR_HUB}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.7}
        />
      </Sphere>
      {/* Glow ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.015, 8, 64]} />
        <meshBasicMaterial color={COLOR_HUB} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ─── Satellite node ───────────────────────────────────────────────────────────

function Node({ node, paused }: { node: NodeDef; paused: boolean }) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const ringRef   = useRef<THREE.Mesh>(null);
  const color     = node.status === 'healthy' ? COLOR_HEALTHY
                  : node.status === 'anomaly' ? COLOR_ANOMALY
                  : COLOR_DIM;
  const emissiveIntensity = node.status === 'dim' ? 0 : 0.35;

  useFrame(() => {
    if (paused) return;
    if (node.status === 'anomaly' && ringRef.current) {
      const t = performance.now() / 1000;
      const s = 1 + 0.3 * Math.abs(Math.sin(t * 1.8));
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.6 - 0.4 * Math.abs(Math.sin(t * 1.8));
    }
  });

  return (
    <group position={node.position}>
      <Sphere ref={meshRef} args={[0.22, 20, 20]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.5}
        />
      </Sphere>
      {node.status === 'anomaly' && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.02, 8, 48]} />
          <meshBasicMaterial color={COLOR_ANOMALY} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// ─── Telemetry pulse on a connection ─────────────────────────────────────────

function TelemetryPulse({
  start,
  end,
  color,
  speed,
  offset,
  paused,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: THREE.Color;
  speed: number;
  offset: number;
  paused: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tRef    = useRef(offset);

  useFrame((_, delta) => {
    if (paused) return;
    tRef.current = (tRef.current + delta * speed) % 1;
    if (meshRef.current) {
      meshRef.current.position.lerpVectors(start, end, tRef.current);
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.055, 8, 8]}>
      <meshBasicMaterial color={color} />
    </Sphere>
  );
}

// ─── Connection line + pulse ──────────────────────────────────────────────────

function Connection({
  from,
  to,
  status,
  paused,
}: {
  from: [number, number, number];
  to: [number, number, number];
  status: NodeDef['status'];
  paused: boolean;
}) {
  const color = status === 'healthy' ? COLOR_HEALTHY
              : status === 'anomaly' ? COLOR_ANOMALY
              : COLOR_DIM;

  const points  = useMemo(
    () => [new THREE.Vector3(...from), new THREE.Vector3(...to)],
    [from, to],
  );
  const vStart  = points[0];
  const vEnd    = points[1];
  const opacity = status === 'dim' ? 0.12 : 0.28;
  const pulseSpeed = status === 'anomaly' ? 0.28 : 0.18;

  return (
    <>
      <Line
        points={points}
        color={color}
        lineWidth={status === 'dim' ? 0.5 : 0.8}
        transparent
        opacity={opacity}
      />
      {status !== 'dim' && (
        <TelemetryPulse
          start={vStart}
          end={vEnd}
          color={color}
          speed={pulseSpeed}
          offset={Math.random()}
          paused={paused}
        />
      )}
    </>
  );
}

// ─── Main scene graph ─────────────────────────────────────────────────────────

function SceneGraph({ paused, nodes }: { paused: boolean, nodes: NodeDef[] }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#e0f7fa" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#22d3ee" distance={7} />

      <Hub paused={paused} />

      {nodes.map((node) => (
        <Node key={node.id} node={node} paused={paused} />
      ))}

      {nodes.map((node) => (
        <Connection
          key={`conn-${node.id}`}
          from={HUB_POS}
          to={node.position}
          status={node.status}
          paused={paused}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!paused}
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

// ─── CSS fallback (no-WebGL) ──────────────────────────────────────────────────

function StaticFallback({ nodes }: { nodes: NodeDef[] }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 300 300"
        width="300"
        height="300"
        style={{ opacity: 0.7 }}
        aria-hidden="true"
      >
        {/* Hub */}
        <circle cx="150" cy="150" r="24" fill="#a855f7" opacity="0.9" />
        <circle cx="150" cy="150" r="36" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />

        {/* Satellite positions */}
        {nodes.map((n) => {
          // Map 3D coordinates [-4, 4] to SVG [0, 300] roughly
          const cx = 150 + (n.position[0] * 35);
          const cy = 150 + (n.position[1] * -35); // Invert Y
          return (
            <g key={n.id}>
              <line
                x1="150" y1="150" x2={cx} y2={cy}
                stroke={n.status === 'healthy' ? '#6366f1' : n.status === 'anomaly' ? '#f59e0b' : '#94a3b8'}
                strokeWidth="0.8"
                opacity={n.status === 'dim' ? 0.15 : 0.35}
              />
              <circle
                cx={cx} cy={cy} r="10"
                fill={n.status === 'healthy' ? '#6366f1' : n.status === 'anomaly' ? '#f59e0b' : '#94a3b8'}
                opacity={n.status === 'dim' ? 0.3 : 0.85}
              />
              {n.status === 'anomaly' && (
                <circle cx={cx} cy={cy} r="17" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface DigitalTwinSceneProps {
  className?: string;
  style?: React.CSSProperties;
  nodes?: TwinNode[];
}

export function DigitalTwinScene({ className, style, nodes = [] }: DigitalTwinSceneProps) {
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [paused, setPaused] = useState(false);

  // Generate stable positions for nodes
  const nodeDefs = useMemo<NodeDef[]>(() => {
    // If no dynamic nodes passed, provide dummy nodes for landing page
    const actualNodes = nodes.length > 0 ? nodes : [
      { id: 'dummy-0', status: 'healthy' as TwinNodeStatus },
      { id: 'dummy-1', status: 'healthy' as TwinNodeStatus },
      { id: 'dummy-2', status: 'healthy' as TwinNodeStatus },
      { id: 'dummy-3', status: 'anomaly' as TwinNodeStatus },
      { id: 'dummy-4', status: 'healthy' as TwinNodeStatus },
      { id: 'dummy-5', status: 'dim' as TwinNodeStatus },
      { id: 'dummy-6', status: 'healthy' as TwinNodeStatus },
    ];

    return actualNodes.map((node, i) => {
      // Create a nice spherical distribution
      const phi = Math.acos(-1 + (2 * i) / actualNodes.length);
      const theta = Math.sqrt(actualNodes.length * Math.PI) * phi;
      
      const r = 3.5 + Math.sin(i * 4567) * 0.5; // Randomize radius slightly
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      return {
        id: node.id,
        position: [x, y, z],
        status: node.status,
      };
    });
  }, [nodes]);

  // Detect WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx =
        canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl');
      if (!ctx) setWebGLAvailable(false);
    } catch {
      setWebGLAvailable(false);
    }
  }, []);

  // Pause when tab is hidden or user prefers reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setPaused(document.hidden || mq.matches);
    };

    update();
    document.addEventListener('visibilitychange', update);
    mq.addEventListener('change', update);

    return () => {
      document.removeEventListener('visibilitychange', update);
      mq.removeEventListener('change', update);
    };
  }, []);

  if (!webGLAvailable) {
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', minHeight: 340, ...style }}
        role="img"
        aria-label="SentinelTwin AI network diagram — static fallback"
      >
        <StaticFallback nodes={nodeDefs} />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 340, ...style }}
      role="img"
      aria-label="SentinelTwin AI interactive digital-twin network visualization"
    >
      <Canvas
        camera={{ position: [0, 2, 9], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneGraph paused={paused} nodes={nodeDefs} />
      </Canvas>
    </div>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function StadiumRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.06;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <torusGeometry args={[4.5, 0.07, 24, 180]} />
        <meshStandardMaterial color="#4be1ff" emissive="#4be1ff" emissiveIntensity={1.8} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <torusGeometry args={[3.25, 0.05, 24, 180]} />
        <meshStandardMaterial color="#71ffbb" emissive="#71ffbb" emissiveIntensity={1.4} transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]}>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#061124" emissive="#09182e" emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
}

function LightPillars() {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        return {
          position: [Math.cos(angle) * 4.8, -0.8, Math.sin(angle) * 4.8] as [number, number, number],
          rotation: [0, angle, 0] as [number, number, number]
        };
      }),
    []
  );

  return (
    <group>
      {items.map((item, index) => (
        <mesh key={index} position={item.position} rotation={item.rotation}>
          <cylinderGeometry args={[0.06, 0.14, 2.8, 16]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#4be1ff" : "#ffd166"}
            emissive={index % 2 === 0 ? "#4be1ff" : "#ffd166"}
            emissiveIntensity={2}
            transparent
            opacity={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((index) => (
        <Float key={index} speed={1 + index * 0.3} floatIntensity={0.8 + index * 0.2}>
          <mesh position={[index * 1.8 - 1.8, 1.1 + index * 0.25, -1.8 + index]}>
            <sphereGeometry args={[0.17 + index * 0.04, 32, 32]} />
            <meshStandardMaterial
              color={index === 1 ? "#ff4fd8" : "#4be1ff"}
              emissive={index === 1 ? "#ff4fd8" : "#4be1ff"}
              emissiveIntensity={2.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function StadiumScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.4, 8.4]} fov={42} />
        <color attach="background" args={["#050816"]} />
        <ambientLight intensity={1.1} color="#8ccfff" />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, 2, 0]} intensity={20} distance={12} color="#4be1ff" />
        <pointLight position={[4, 2, 0]} intensity={18} distance={12} color="#ffd166" />

        <StadiumRings />
        <LightPillars />
        <OrbitingOrbs />
        <Sparkles count={130} scale={[13, 6, 13]} size={4} speed={0.4} color="#73dcff" />
        <Sparkles count={45} scale={[10, 4, 10]} size={6} speed={0.2} color="#ffd166" />
      </Canvas>
    </div>
  );
}

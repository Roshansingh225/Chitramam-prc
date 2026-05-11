"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function StadiumBowl() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.025;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.25, 0]}>
        <circleGeometry args={[5.7, 64]} />
        <meshStandardMaterial color="#0f2d1b" emissive="#0d2416" emissiveIntensity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.21, 0]}>
        <ringGeometry args={[1.1, 5.45, 64]} />
        <meshStandardMaterial color="#1c4b2d" emissive="#153120" emissiveIntensity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.18, 0]}>
        <torusGeometry args={[4.8, 0.06, 18, 160]} />
        <meshStandardMaterial color="#f4ebd0" emissive="#f4ebd0" emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.12, 0]}>
        <boxGeometry args={[0.7, 3.25, 0.06]} />
        <meshStandardMaterial color="#b78b56" emissive="#7a5635" emissiveIntensity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.09, 0.95]}>
        <boxGeometry args={[1.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#f4ebd0" emissive="#f4ebd0" emissiveIntensity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.09, -0.95]}>
        <boxGeometry args={[1.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#f4ebd0" emissive="#f4ebd0" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

function SightScreens() {
  return (
    <group>
      <mesh position={[0, -0.65, -4.4]}>
        <boxGeometry args={[1.5, 1.4, 0.12]} />
        <meshStandardMaterial color="#f1e9cf" emissive="#f1e9cf" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, -0.65, 4.4]}>
        <boxGeometry args={[1.5, 1.4, 0.12]} />
        <meshStandardMaterial color="#f1e9cf" emissive="#f1e9cf" emissiveIntensity={0.1} opacity={0.92} transparent />
      </mesh>
    </group>
  );
}

function LightTowers() {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        return {
          position: [Math.cos(angle) * 4.95, -0.35, Math.sin(angle) * 4.95] as [number, number, number],
          rotation: [0, angle, 0] as [number, number, number]
        };
      }),
    []
  );

  return (
    <group>
      {items.map((item, index) => (
        <mesh key={index} position={item.position} rotation={item.rotation}>
          <cylinderGeometry args={[0.05, 0.08, 3.6, 16]} />
          <meshStandardMaterial
            color="#f4ebd0"
            emissive="#d7ad57"
            emissiveIntensity={1.25}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function CricketBall() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    groupRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.35) * 1.8;
    groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.35) * 1.4;
  });

  return (
    <group ref={groupRef} position={[0, 0.95, -0.1]}>
      <Float speed={1.1} floatIntensity={0.65}>
        <mesh>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color="#8b3b26" emissive="#5f1e12" emissiveIntensity={0.45} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.19, 0.012, 14, 64]} />
          <meshStandardMaterial color="#f4ebd0" emissive="#f4ebd0" emissiveIntensity={0.8} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.012, 14, 64]} />
          <meshStandardMaterial color="#f4ebd0" emissive="#f4ebd0" emissiveIntensity={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

export function StadiumScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.4, 8.4]} fov={42} />
        <color attach="background" args={["#08150d"]} />
        <ambientLight intensity={1.15} color="#f5ecd8" />
        <directionalLight position={[5, 8, 5]} intensity={1.55} color="#fff9ec" />
        <pointLight position={[-4, 2.8, 0]} intensity={15} distance={13} color="#f4ebd0" />
        <pointLight position={[4, 2.8, 0]} intensity={17} distance={13} color="#d7ad57" />

        <StadiumBowl />
        <SightScreens />
        <LightTowers />
        <CricketBall />
        <Sparkles count={110} scale={[13, 5, 13]} size={4} speed={0.36} color="#f4ebd0" />
        <Sparkles count={32} scale={[10, 4, 10]} size={6} speed={0.18} color="#d7ad57" />
      </Canvas>
    </div>
  );
}

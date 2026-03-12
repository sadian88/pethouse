'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, Suspense } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PetHouseModel from './PetHouseModel';
import PetNameLabel from './PetNameLabel';

function Controls() {
  const { camera, gl } = useThree();
  const ref = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = false;
    c.enableZoom = false;
    c.enablePan = false;
    c.minPolarAngle = 0.2;
    c.maxPolarAngle = Math.PI / 2;
    c.target.set(0, 2, 0);
    c.update();
    ref.current = c;
    return () => { c.dispose(); ref.current = null; };
  }, [camera, gl]);

  useFrame(() => ref.current?.update());
  return null;
}

export default function Scene3D() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-sky-200 to-stone-300">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 2, 0)}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmicToneMapping */ }}
        shadows
      >
        {/* Luz hemisférica: cielo azul arriba, tierra cálida abajo */}
        <hemisphereLight args={['#b9d5ff', '#c8a97e', 0.6]} />

        {/* Sol principal — desde arriba derecha, con sombras */}
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.1}
          shadow-camera-far={40}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.001}
        />

        {/* Luz de relleno — desde la izquierda, suave */}
        <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#e8d5c0" />

        {/* Contra-luz trasera — separa el modelo del fondo */}
        <directionalLight position={[-3, 6, -8]} intensity={0.3} color="#b0c8e8" />

        <PetHouseModel />
        <Suspense fallback={null}>
          <PetNameLabel />
        </Suspense>

        {/* Plano que recibe sombras */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.25} />
        </mesh>

        <gridHelper args={[12, 12, '#99887766', '#bbaa9966']} />

        <Controls />
      </Canvas>
    </div>
  );
}

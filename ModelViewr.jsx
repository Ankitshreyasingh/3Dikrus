// src/components/ModelViewer.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, Html } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={3} />; // Scale the model by a factor of 3
}

function ModelViewer({ modelUrl }) {
  return (
    <Canvas style={{ width: '100%', height: '500px' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-2, 5, 2]} intensity={1} />
      <Suspense fallback={<Html center>Loading...</Html>}>
        <Model url={modelUrl} />
        <Preload all />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export default ModelViewer;
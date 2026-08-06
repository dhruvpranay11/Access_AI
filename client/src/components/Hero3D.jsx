import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedSphere = ({ position, scale, color, speed, distort }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
            // Add slight floating motion
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
        }
    });

    return (
        <Sphere ref={meshRef} position={position} args={[1, 64, 64]} scale={scale}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={distort}
                speed={speed * 2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
};

export const Hero3D = () => {
    return (
        <div className="absolute inset-0 -z-10 opacity-60">
            <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#00f5d4" />
                <directionalLight position={[-10, -10, 5]} intensity={0.5} color="#9d4edd" />
                
                {/* Main large center bubble */}
                <AnimatedSphere position={[0, 0, 0]} scale={2.5} color="#9d4edd" speed={1} distort={0.4} />
                
                {/* Smaller surrounding bubbles */}
                <AnimatedSphere position={[-4, 2, -2]} scale={1.2} color="#00f5d4" speed={1.5} distort={0.5} />
                <AnimatedSphere position={[4, -2, -1]} scale={1.5} color="#7b2cbf" speed={1.2} distort={0.3} />
                <AnimatedSphere position={[-3, -3, -3]} scale={1.8} color="#00b4d8" speed={0.8} distort={0.6} />
                <AnimatedSphere position={[3, 3, -4]} scale={1} color="#9d4edd" speed={2} distort={0.4} />
                <AnimatedSphere position={[0, -4, -2]} scale={0.8} color="#00f5d4" speed={1.7} distort={0.5} />

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
            </Canvas>
        </div>
    );
};

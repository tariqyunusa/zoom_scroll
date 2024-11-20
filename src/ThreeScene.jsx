import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import VirtualScroll from 'virtual-scroll';
import { vertex } from './shaders/vertex';
import { fragment } from './shaders/fragment';

const ThreeScene = () => {
    const mountRef = useRef(null); 
    const scrollTarget = useRef(0); 
    const scrollCurrent = useRef(0); 
    const initialPos = useRef([]); 

    useEffect(() => {
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.set(0, 0, 5);

        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Create meshes with shaders
        const meshesArray = [];
        const meshCount = 7;
        for (let i = 0; i < meshCount; i++) {
            const initialPosY = i * 4 - (4 * (meshCount - 1)) / 2; // Space meshes evenly
            const plane = new THREE.PlaneGeometry(3, 2, 16, 16);
            const material = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.DoubleSide,
                uniforms: {
                    progress: { value: 0 },
                },
            });
            const mesh = new THREE.Mesh(plane, material);
            mesh.position.set(0, initialPosY, 0); 
            scene.add(mesh);
            meshesArray.push(mesh);
            initialPos.current.push(initialPosY); 
        }

        // Resize handler
        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };

        // Virtual scroll setup
        const scroller = new VirtualScroll();
        scroller.on((event) => {
            scrollTarget.current += event.deltaY * 0.1; // Adjust scroll speed
        });

        // Animation loop
        let time = 0
        const animate = () => {
            // Smooth scroll interpolation
            scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.1;
            time+= 0.01

            // Update each mesh's position and shader uniform
            meshesArray.forEach((mesh, index) => {
                mesh.position.y = initialPos.current[index] - scrollCurrent.current; // Scroll meshes
                mesh.material.uniforms.progress.value = scrollCurrent.current * 0.5 - index * 0.3; // Update shader uniform
            });

            // Render the scene
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup resources
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            scroller.destroy();
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeScene;
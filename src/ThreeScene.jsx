import React, { useRef } from 'react';
import * as THREE from 'three';
import VirtualScroll from 'virtual-scroll';
import { vertex } from './shaders/vertex';
import { fragment } from './shaders/fragment';
import image1 from '/image-01.jpg?url';
import image2 from '/image-02.jpg?url';
import image3 from '/image-03.jpg?url';
import image4 from '/image-04.jpg?url';
import image5 from '/image-05.jpg?url';
import image6 from '/image-06.jpg?url';
import image7 from '/image-07.jpg?url';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const scrollTarget = useRef(0);
    const scrollCurrent = useRef(0);

    const initializeScene = () => {
        // Preload textures
        const textureLoader = new THREE.TextureLoader();
        const textures = [
            textureLoader.load(image1),
            textureLoader.load(image2),
            textureLoader.load(image3),
            textureLoader.load(image4),
            textureLoader.load(image5),
            textureLoader.load(image6),
            textureLoader.load(image7),
        ];

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor('#FAF9F6', 1); // Off-white background

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // Create Meshes
        const meshesArray = [];
        const initialPos = [];
        textures.forEach((texture, index) => {
            const initialPosY = index * 4 - (4 * (textures.length - 1)) / 2;
            initialPos.push(initialPosY);

            const plane = new THREE.PlaneGeometry(3, 2, 16, 16);
            const material = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.DoubleSide,
                uniforms: {
                    uTexture: { value: texture },
                    progress: { value: 0 }, // Reverted progress logic
                },
            });

            const mesh = new THREE.Mesh(plane, material);
            mesh.position.set(0, initialPosY, 0);
            scene.add(mesh);
            meshesArray.push(mesh);
        });

        // Resize handler
        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        // Virtual Scroll Setup
        const scroller = new VirtualScroll();
        scroller.on((event) => {
            scrollTarget.current += event.deltaY * 0.01; // Adjust scroll sensitivity
        });

        // Animation Loop
        const animate = () => {
            scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.1;

            // Update Mesh Positions and Shader Uniforms
            meshesArray.forEach((mesh, index) => {
                mesh.position.y = initialPos[index] - scrollCurrent.current;
                mesh.material.uniforms.progress.value = scrollCurrent.current * 0.5 - index * 0.3;
            });

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            scroller.destroy();
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    };

    // Initialize the scene immediately
    React.useLayoutEffect(() => {
        const cleanup = initializeScene();
        return cleanup;
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeScene;

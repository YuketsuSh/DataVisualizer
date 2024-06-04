import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Visualization3D = ({ data }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        camera.position.z = 50;

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        const renderer = rendererRef.current;
        const camera = cameraRef.current;

        if (scene && data.length > 0) {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }

            const createTree = (data, scene) => {
                const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
                const geometry = new THREE.BufferGeometry();
                const positions = [];

                const addNode = (node, x, y, z, parentX, parentY, parentZ) => {
                    positions.push(parentX, parentY, parentZ);
                    positions.push(x, y, z);

                    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
                    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    sphere.position.set(x, y, z);
                    scene.add(sphere);
                };

                let currentX = 0;
                let currentY = 0;
                data.forEach((item, index) => {
                    addNode(item, currentX, currentY, index * 2, 0, 0, (index - 1) * 2);
                    currentX += 5;
                });

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                const line = new THREE.LineSegments(geometry, material);
                scene.add(line);
            };

            createTree(data, scene);

            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        }
    }, [data]);

    return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default Visualization3D;
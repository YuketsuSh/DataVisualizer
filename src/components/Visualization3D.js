import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Visualization3D = ({ data }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    useEffect(() => {
        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;

        camera.position.z = 50;
        controls.update();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, []);

    useEffect(() => {
        const mount = mountRef.current;
        const scene = sceneRef.current;

        if (scene && data.length > 0) {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }

            const createTree = (data, scene) => {
                const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
                const geometry = new THREE.BufferGeometry();
                const positions = [];

                const addBranch = (node, level, x, y, z) => {
                    if (!node) return;

                    const branchLength = 10;
                    const branchSpread = 15;
                    const newX = x + (level === 0 ? 0 : (Math.random() - 0.5) * branchSpread);
                    const newY = y + branchLength;
                    const newZ = z + (level === 0 ? 0 : (Math.random() - 0.5) * branchSpread);

                    positions.push(x, y, z, newX, newY, newZ);

                    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
                    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    sphere.position.set(newX, newY, newZ);
                    scene.add(sphere);

                    sphere.userData = { node, level };
                    sphere.callback = () => {
                        console.log(`Node: ${node.name}\nData: ${JSON.stringify(node.data, null, 2)}`);
                        if (expandedNodes.has(node.name)) {
                            expandedNodes.delete(node.name);
                        } else {
                            expandedNodes.add(node.name);
                        }
                        setExpandedNodes(new Set(expandedNodes));
                    };

                    if (expandedNodes.has(node.name) || level === 0) {
                        for (let i = 0; i < node.children.length; i++) {
                            addBranch(node.children[i], level + 1, newX, newY, newZ);
                        }
                    }
                };

                const treeData = {
                    name: 'root',
                    children: data.map((item, index) => ({
                        name: `ID: ${index + 1}`,
                        data: item,
                        children: Object.keys(item).map((key) => ({
                            name: key,
                            value: item[key],
                            children: [],
                        })),
                    })),
                };

                addBranch(treeData, 0, 0, 0, 0);

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                const line = new THREE.LineSegments(geometry, material);
                scene.add(line);
            };

            createTree(data, scene);

            const handleClick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('Double-click detected');
                const mouse = new THREE.Vector2();
                mouse.x = ((event.clientX - mount.offsetLeft) / mount.clientWidth) * 2 - 1;
                mouse.y = -((event.clientY - mount.offsetTop) / mount.clientHeight) * 2 + 1;

                console.log('Mouse coordinates:', mouse);

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, cameraRef.current);

                const intersects = raycaster.intersectObjects(scene.children, true);
                console.log('Intersects:', intersects);
                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.callback) {
                        console.log('Object callback detected');
                        object.callback();
                    }
                }
            };

            mount.addEventListener('dblclick', handleClick);

            return () => {
                mount.removeEventListener('dblclick', handleClick);
            };
        }
    }, [data, expandedNodes]);

    return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default Visualization3D;

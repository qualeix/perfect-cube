"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const CubeExample = () => {
  // Create container element for div
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add a check for null
    if (!containerRef.current) return;

    // Create new scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    // Create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append renderer's canvas to the container div
    containerRef.current.appendChild(renderer.domElement);

    // Position the camera
    camera.position.z = 5;

    // Create a cube

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    // Render the actual scene and add a rotation to the cube
    const renderScene = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      requestAnimationFrame(renderScene);

      renderer.render(scene, camera);
    };

    // Call the renderScene function to start the animation loop
    renderScene();

    // Handle window resizing
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef}></div>;
};

function handleResize(this: Window, ev: UIEvent) {
  throw new Error("Function not implemented.");
} // VSCode autofix because handleResize function did not exist

export default CubeExample;

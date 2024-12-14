import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const BusRouteIllustration = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Define Bus Route Points
    const routePoints = [
      new THREE.Vector3(-5, 0, 0), // Start point (A)
      new THREE.Vector3(-3, 1, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, -1, 0),
      new THREE.Vector3(5, 0, 0), // End point (B)
    ];

    // Create Line Geometry for Route
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    const routeLine = new THREE.Line(routeGeometry, routeMaterial);
    scene.add(routeLine);

    // Add Markers (Spheres) at Each Point
    const markerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    routePoints.forEach((point) => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(point);
      scene.add(marker);
    });

    // Create Moving Bus (Sphere for Representation)
    const busGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const busMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const bus = new THREE.Mesh(busGeometry, busMaterial);
    scene.add(bus);

    // Animation Loop
    let progress = 0; // Progress along the route
    const animate = () => {
      requestAnimationFrame(animate);

      // Move the bus along the route
      progress += 0.002; // Adjust speed here
      if (progress > 1) progress = 0;
      const currentPosition = new THREE.Vector3().lerpVectors(routePoints[0], routePoints[routePoints.length - 1], progress);
      bus.position.copy(currentPosition);

      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="relative w-full h-96" />;
};

export default BusRouteIllustration;

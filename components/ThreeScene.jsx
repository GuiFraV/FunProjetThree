"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Initialisation de la scène
    const scene = new THREE.Scene();

    // Initialisation de la caméra
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Initialisation du renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Créer la géométrie du cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Fonction d'animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Vous pouvez laisser cette rotation ou la commenter si vous voulez que le scroll contrôle entièrement la rotation
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Animer le cube en fonction du scroll
    gsap.to(cube.rotation, {
      x: Math.PI * 2, // Rotation complète sur l'axe X
      y: Math.PI * 2, // Rotation complète sur l'axe Y
      scrollTrigger: {
        trigger: mountRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage lors du démontage du composant
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      // Supprimer l'animation GSAP associée
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(cube.rotation);
    };
  }, []);

  // Style pour permettre le scroll (hauteur de 200% de la vue)
  return <div ref={mountRef} style={{ height: "200vh" }} />;
};

export default ThreeScene;

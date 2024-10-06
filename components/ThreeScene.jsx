"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = () => {
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

    // Ajouter le renderer au body du document
    document.body.appendChild(renderer.domElement);

    // Style du renderer pour qu'il reste fixe et en arrière-plan
    renderer.setClearColor(0x000000, 0); // Fond transparent
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "-1"; // Derrière le contenu

    // Créer la géométrie du cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Fonction d'animation
    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();

    // Animer le cube en fonction du scroll
    gsap.to(cube.rotation, {
      x: Math.PI * 4, // Rotation sur X
      y: Math.PI * 4, // Rotation sur Y
      scrollTrigger: {
        trigger: document.body, // Déclencher sur le scroll de la page
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage lors du démontage du composant
    return () => {
      renderer.dispose(); // Libérer les ressources du renderer
      document.body.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      // Supprimer les animations GSAP
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(cube.rotation);
    };
  }, []);

  // Pas besoin de retourner un élément, le renderer est ajouté directement au body
  return null;
};

export default ThreeScene;

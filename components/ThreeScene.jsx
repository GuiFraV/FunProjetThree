"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import fontData from "../app/fonts/helvetiker_regular.typeface.json";

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = () => {
  useEffect(() => {
    // Initialisation de la scène
    const scene = new THREE.Scene();

    // Initialisation de la caméra
    const camera = new THREE.PerspectiveCamera(
      75, // Champ de vision
      window.innerWidth / window.innerHeight, // Ratio
      0.1, // Plan proche
      1000 // Plan lointain
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

    // Charger la police directement importée
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(fontData);

    // Le texte à afficher
    const textString = "Section 4";

    // Créer un groupe pour les lettres
    const textGroup = new THREE.Group();

    // Rayon du cercle autour du cube
    const radius = 3;

    // Angle initial
    const startAngle = 0;

    // Angle entre chaque caractère
    const angleIncrement = (Math.PI * 2) / textString.length;

    // Créer les lettres individuelles
    for (let i = 0; i < textString.length; i++) {
      const char = textString[i];

      // Créer la géométrie pour la lettre
      const charGeometry = new TextGeometry(char, {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });

      // Créer le matériau pour la lettre (noir)
      const charMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

      // Créer le maillage pour la lettre
      const charMesh = new THREE.Mesh(charGeometry, charMaterial);

      // Calculer l'angle pour cette lettre
      const angle = startAngle + i * angleIncrement;

      // Calculer la position sur le cercle
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      charMesh.position.set(x, 0, z);

      // Orienter la lettre vers le centre
      charMesh.lookAt(0, 0, 0);

      // Ajouter la lettre au groupe
      textGroup.add(charMesh);
    }

    // Ajouter le groupe de texte à la scène
    scene.add(textGroup);

    // Animer la rotation du texte en fonction du scroll
    gsap.to(textGroup.rotation, {
      y: Math.PI * 2, // Rotation complète autour de l'axe Y
      scrollTrigger: {
        trigger: ".section-4", // Cible la section 4
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

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
      gsap.killTweensOf(textGroup.rotation);
    };
  }, []);

  // Pas besoin de retourner un élément, le renderer est ajouté directement au body
  return null;
};

export default ThreeScene;

"use client";

import { useRef, useEffect } from "react";
import ThreeScene from "../components/ThreeScene";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const textRef = useRef(null);

  useEffect(() => {
    // Animer l'opacité du texte en fonction du scroll
    gsap.fromTo(
      textRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top top",
          end: "center top",
          scrub: true,
        },
      }
    );

    // Nettoyage lors du démontage du composant
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(textRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <h1
        ref={textRef}
        className="fixed top-10 left-0 right-0 text-center text-4xl font-bold"
      >
        Bienvenue dans mon projet 3D
      </h1>
      <ThreeScene />
      <p className="absolute bottom-10 left-0 right-0 text-center text-2xl">
        Merci d&apos;avoir scrollé !
      </p>
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import ThreeScene from "../components/ThreeScene";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    sectionsRef.current.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    });

    // Nettoyage
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(sectionsRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <ThreeScene />
      <div className="flex flex-col items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <section
            key={i}
            ref={(el) => (sectionsRef.current[i] = el)}
            className="min-h-screen flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold">Section {i + 1}</h2>
          </section>
        ))}
      </div>
    </div>
  );
}

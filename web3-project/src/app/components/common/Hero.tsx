import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import Background3D from "./Background3D";

const Hero: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Animation for Background Icons
    if (sceneRef.current) {
      gsap.fromTo(
        sceneRef.current.children,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 0.1,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power2.inOut",
        }
      );
    }
  }, []);

  // Scroll to next section
  const handleScroll = () => {
    const nextSection = document.getElementById("next-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen  text-white overflow-hidden">
      {/* Icon Background */}

      <div ref={sceneRef} className="absolute inset-0 grid grid-cols-4 gap-4 opacity-100 pointer-events-none">
        <Background3D />
      </div>

      {/* Animated Text and CTA */}
      <motion.div
        className="absolute z-10 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.5,
        }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            delay: 1,
            ease: "easeInOut",
          }}
        >
          Earn Rewards for Sustainable Travel
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            delay: 1.5,
            ease: "easeInOut",
          }}
        >
          Reduce your carbon footprint and earn rewards by using eco-friendly transportation.
        </motion.p>
        <motion.button
          className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-600"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 15px rgba(0, 255, 150, 0.7)",
          }}
          whileTap={{
            scale: 0.9,
            boxShadow: "0px 0px 10px rgba(0, 255, 150, 0.5)",
          }}
        >
          SCAN NOW
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero;

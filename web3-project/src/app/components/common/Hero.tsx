import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Bus, Train, Leaf, CreditCard, TreePine, CloudFog } from "lucide-react";
import { gsap } from "gsap";
import Background3D from "./Background3D";

const Hero: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

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

    // GSAP Animation for Floating Icons
    if (iconsRef.current) {
      gsap.fromTo(
        iconsRef.current.children,
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 0.3,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);

  return (
    <div className="relative rounded-b-3xl flex flex-col items-center justify-center w-full h-screen text-white bg-gradient-to-br from-teal-500 to-blue-900 overflow-hidden">
      {/* 3D Background */}
      <div ref={sceneRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <Background3D />
      </div>

      {/* Floating Icons */}
      <div ref={iconsRef} className="absolute inset-0 z-10 flex items-center justify-center max-w-full overflow-hidden">
        {/* Left Column */}
        <div className="absolute top-20 left-20 animate-float-slow">
          <Bus className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-1/3 left-32 animate-float-medium">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <div className="absolute top-2/3 left-20 animate-float-fast">
          <TreePine className="w-14 h-14 text-white" />
        </div>

        {/* Right Column */}
        <div className="absolute top-20 right-20 animate-float-medium">
          <Train className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-1/3 right-32 animate-float-slow">
          <CreditCard className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-2/3 right-20 animate-float-fast">
          <CloudFog className="w-14 h-14 text-white" />
        </div>
      </div>

      {/* Animated Text and CTA */}
      <motion.div
        className="relative z-20 text-center px-6"
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

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;

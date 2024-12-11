"use client";
import React from "react";
import Hero from "../components/common/Hero";
import { motion } from "framer-motion";

import { useInView } from "react-intersection-observer";
import { FaLeaf, FaCoins, FaGlobeAmericas } from "react-icons/fa";

export default function Home() {
  return (
    <div id="hero" className="text-white ">
      <Hero />

      {/* Animated Section with Scroll Trigger */}
      <ScrollAnimatedSection />
    </div>
  );
}

// Scroll Animated Section Component
const ScrollAnimatedSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Animasi hanya terjadi sekali
    threshold: 0.2, // Animasi dimulai ketika 20% elemen terlihat
  });

  const features = [
    {
      icon: <FaLeaf size={40} className="text-teal-400" />,
      title: "Track Your Carbon",
      description: "Easily monitor your daily carbon impact with real-time tracking.",
    },
    {
      icon: <FaCoins size={40} className="text-yellow-400" />,
      title: "Earn Rewards",
      description: "Accumulate points for every eco-friendly step you take.",
    },
    {
      icon: <FaGlobeAmericas size={40} className="text-blue-400" />,
      title: "Make a Difference",
      description: "Join a growing community driving global environmental change.",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="flex flex-col justify-center items-center p-10 py-20 w-full max-w-screen-xl mx-auto text-center text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-4">Join the Green Movement</h2>

      <p className="text-lg mb-8">Embrace sustainable travel and turn your carbon-saving habits into valuable rewards. Together, we can make a difference.</p>
      {/* Animated Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-8 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

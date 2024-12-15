"use client";
import React from "react";
import Hero from "../components/common/Hero";
import { motion } from "framer-motion";
import JourneyAnimation from "../components/common/JourneyAnimation";
import { useInView } from "react-intersection-observer";
import { FaLeaf, FaCoins, FaGlobeAmericas, FaQrcode, FaShoppingBag } from "react-icons/fa";

export default function Home() {
  return (
    <div id="hero" className="text-white  ">
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
      icon: <FaLeaf size={40} className="text-green-700" />,
      title: "Track Your Carbon",
      description: "Monitor your carbon emissions by tracking your daily use of public transportation like buses and trains.",
    },
    {
      icon: <FaCoins size={40} className="text-yellow-400" />,
      title: "Earn Rewards",
      description: "Collect points for every journey you take using eco-friendly public transport options.",
    },
    {
      icon: <FaGlobeAmericas size={40} className="text-blue-300" />,
      title: "Make a Difference",
      description: "Be part of a community committed to reducing carbon emissions and creating a greener planet.",
    },
  ];

  return (
    <div className="">
      {/* Background Wrapper for Section 1 */}
      <div className="bg-bluess rounded-b-3xl">
        <motion.section
          ref={ref}
          className="flex flex-col justify-center items-center p-10 py-20 w-full mx-auto text-center text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            {" "}
            Join the <span className="text-green-500">Green</span> Movement
          </h2>
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
                className="p-6 bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl text-white hover:from-gray-700 hover:to-gray-800 transition-transform duration-300"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex justify-start mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>

      {/* Background Wrapper for Section 2 */}
      <div className="">
        <motion.section
          className="flex flex-col md:flex-row items-center justify-between min-h-screen px-6 py-12"
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex-1">
            <h2 className="text-4xl font-bold">Start and Complete Journey</h2>
            <p className="mt-4 text-lg md:text-xl max-w-lg">Begin your eco-friendly journey by scanning the QR code at the start and completing it at your destination. Track your travel and reduce your carbon footprint with ease.</p>
          </div>
        </motion.section>
      </div>

      {/* Background Wrapper for Section 3 */}
      <div className="bg-gray-800 ">
        <motion.section
          className="flex flex-col md:flex-row-reverse items-center justify-between min-h-screen px-6 py-12"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex-1">
            <h2 className="text-4xl font-bold">Redeem Your Tokens</h2>
            <p className="mt-4 text-lg md:text-xl max-w-lg">Collect tokens for each completed journey and redeem them for rewards or benefits within the platform.</p>
          </div>
          <div className="flex-1 flex flex-col items-center mt-8 md:mt-0">
            <div className="p-6 bg-gray-700 rounded-full">
              <FaCoins size={60} className="text-yellow-400" />
            </div>
            <img src="/images/redeem-token.png" alt="Redeem Token Illustration" className="mt-6 w-full max-w-sm" />
          </div>
        </motion.section>
      </div>

      {/* Background Wrapper for Section 4 */}
      <div className="bg-gray-700">
        <motion.section
          className="flex flex-col md:flex-row items-center justify-between min-h-screen px-6 py-12"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          viewport={{ once: true }}
        >
          <div className="flex-1">
            <h2 className="text-4xl font-bold">Exchange for Merchandise</h2>
            <p className="mt-4 text-lg md:text-xl max-w-lg">Use your tokens to purchase exclusive merchandise and show your commitment to sustainability.</p>
          </div>
          <div className="flex-1 flex flex-col items-center mt-8 md:mt-0">
            <div className="p-6 bg-gray-600 rounded-full">
              <FaShoppingBag size={60} className="text-blue-400" />
            </div>
            <img src="/images/exchange-merch.png" alt="Merchandise Illustration" className="mt-6 w-full max-w-sm" />
          </div>
        </motion.section>
      </div>
    </div>
  );
};

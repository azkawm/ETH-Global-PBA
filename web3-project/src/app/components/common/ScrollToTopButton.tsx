// components/ScrollToTopButton.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-gray-800/70 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 border border-gray-600">
          <FaChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;

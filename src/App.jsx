import React from "react";
import scratch from "./assets/scratch-logo.png";
import { motion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi"; // Icon for extra visual appeal

function App() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white text-gray-800">
      {/* Animated Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <img src={scratch} alt="New Logo" className="w-[250px] md:w-[350px] rounded-full shadow-lg" />
      </motion.div>

      {/* Text Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.7 }}
        className="text-lg md:text-2xl font-semibold text-gray-700 mb-8 text-center"
      >
        Code, Create, Innovate with Scratch
      </motion.div>

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="w-[90%] md:w-[70%] border border-gray-300 bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8 pb-16 md:pb-24 text-base md:text-lg font-medium text-gray-800">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Hackascratch</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Hackascratch helps high school students learn programming through a fun, interactive digital canvas. It promotes creativity, collaboration, and problem-solving, preparing students for future challenges and enabling them to express themselves in various fields.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;

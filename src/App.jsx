import React from "react";
import scratch from "./assets/scratch-logo.png";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center pb-24">
      {/* Animated Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <img src={scratch} alt="New Logo" className="w-[200px] md:w-[300px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.7 }}
        className="text-base md:text-xl font-semibold text-gray-600 mb-4"
      >
        Code, Create, Innovate with Scratch
      </motion.div>

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.7 }}
        className="fixed bottom-0 w-[85%] md:w-[60%] border border-slate-200 bg-white rounded-t-lg shadow-lg overflow-hidden"
      >
        <div className="p-10 pb-20 md:pb-36 text-base md:text-xl font-semibold text-gray-600">
          <h2 className="text-lg md:text-2xl font-bold mb-4">Hackerscratch</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Hackerscratch helps high school students learn programming through a fun, interactive digital canvas. It promotes creativity, collaboration, and problem-solving, preparing students for future challenges and enabling them to express themselves in various fields.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;

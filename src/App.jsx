import React from "react";
import scratch from "./assets/scratch-logo.png";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
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
        Code , Create, Invovate with Scratch
      </motion.div>
    </div>
  );
}

export default App;

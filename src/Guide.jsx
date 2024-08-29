import React from "react";
import { motion } from "framer-motion";
import hackascratchGuide from "./assets/hackascratch-guide.pdf";

const Guide = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="w-screen h-screen flex flex-col items-start bg-gray-100 p-5 pt-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-xl md:text-3xl font-bold mb-2"
        variants={titleVariants}
      >
        Hackascratch Guide
      </motion.h1>
      <motion.p
        className="text-base md:text-lg text-slate-500 mb-2"
        variants={descriptionVariants}
      >
        Check out this guidebook to learn more about Scratch!
      </motion.p>
      <div className="flex justify-center items-center w-full h-full">
        <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full h-full">
          <iframe
            src={hackascratchGuide}
            className="w-full h-full"
            title="Hackascratch Guide"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Guide;

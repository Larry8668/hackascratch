import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMenu, HiX } from "react-icons/hi"; // Importing icons for hamburger and close button
import tams from "../assets/tams-logo.png";

const NavBar = () => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for controlling the mobile menu

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const halfScreenHeight = window.innerHeight / 2;
      setLogoVisible(scrollTop > halfScreenHeight);
      setScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen p-3 md:px-10 flex justify-between items-center z-50 text-black ${
        scrolled ? "backdrop-blur-lg" : ""
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img src={tams} alt="tams-logo" className="w-[100px] md:w-[150px]" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-10 px-5">
        <Link to="/" className="font-semibold text-xl">
          Home
        </Link>
        <Link to="/explore" className="font-semibold text-xl">
          Explore
        </Link>
        <Link to="/about" className="font-semibold text-xl">
          About
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden text-3xl p-2 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <HiX /> : <HiOutlineMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-14 right-0 bg-white w-48 shadow-lg rounded-lg py-4 flex flex-col items-center md:hidden"
        >
          <Link
            to="/"
            className="w-full text-center py-2 font-semibold text-lg"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <div className="w-[85%] h-[1px] bg-slate-400" />
          <Link
            to="/explore"
            className="w-full text-center py-2 font-semibold text-lg"
            onClick={toggleMenu}
          >
            Explore
          </Link>
          <div className="w-[85%] h-[1px] bg-slate-400" />
          <Link
            to="/about"
            className="w-full text-center py-2 font-semibold text-lg"
            onClick={toggleMenu}
          >
            About
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default NavBar;

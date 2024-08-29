import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import tams from "../assets/tams-logo.png";

const NavBar = () => {
  const { currentUser } = useAuth();
  const [logoVisible, setLogoVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen p-3 md:px-10 flex justify-between items-center z-50 text-black ${
        scrolled ? "backdrop-blur-lg" : ""
      }`}
    >
      <Link to="/">
        <img src={tams} alt="tams-logo" className="w-[100px] md:w-[150px]" />
      </Link>

      <div className="hidden md:flex gap-10 px-5">
        <Link to="/" className="font-semibold text-xl">
          Home
        </Link>
        <Link to="/explore" className="font-semibold text-xl">
          Explore
        </Link>
        <Link to="/guide" className="font-semibold text-xl">
          Guide
        </Link>
        {!currentUser ? (
          <Link to="/login" className="font-semibold text-xl">
            Login
          </Link>
        ) : (
          <Link to="/dashboard" className="font-semibold text-xl underline">
            {currentUser.name.length > 8
              ? currentUser.name.slice(0, 5) + "..."
              : currentUser.name}
          </Link>
        )}
      </div>

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
            to="/guide"
            className="w-full text-center py-2 font-semibold text-lg"
            onClick={toggleMenu}
          >
            Guide
          </Link>
          <div className="w-[85%] h-[1px] bg-slate-400" />

          {!currentUser ? (
            <Link
              to="/login"
              className="w-full text-center py-2 font-semibold text-lg"
              onClick={toggleMenu}
            >
              Login
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="w-full text-center py-2 font-semibold text-lg underline"
            >
              {currentUser.name.length > 8
                ? currentUser.name.slice(0, 5) + "..."
                : currentUser.name}
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NavBar;

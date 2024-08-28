import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tams from "../assets/tams-logo.png";

const NavBar = () => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div
      className={`fixed top-0 left-0 w-screen p-3 md:px-10 flex justify-between items-center z-50 text-black ${
        scrolled ? "backdrop-blur-lg" : ""
      }`}
    >
      <Link to="/">
        <img src={tams} alt="tams-logo" className="w-[100px] md:w-[150px]" />
      </Link>
      <div className="gap-10 px-5 hidden md:flex">
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
    </div>
  );
};

export default NavBar;

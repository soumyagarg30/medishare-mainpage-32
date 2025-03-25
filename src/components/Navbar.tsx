
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism py-3" : "bg-medishare-dark py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png" 
              alt="MediShare Logo" 
              className="h-12 w-auto"
            />
            <span className={`text-xl font-display font-bold ${isScrolled ? "text-medishare-dark" : "text-white"}`}>
              MediShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink href="/" label="Home" isScrolled={isScrolled} />
            <NavLink href="/about" label="About us" isScrolled={isScrolled} />
            <NavLink href="/ngos" label="NGOs" isScrolled={isScrolled} />
            <NavLink href="/providers" label="Providers" isScrolled={isScrolled} />
            <NavLink href="/contact" label="Contact Us" isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white rounded-md p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? "text-medishare-dark" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? "text-medishare-dark" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pt-4 pb-3 animate-fade-in-up">
            <div className="flex flex-col space-y-4">
              <MobileNavLink href="/" label="Home" onClick={toggleMenu} />
              <MobileNavLink href="/about" label="About us" onClick={toggleMenu} />
              <MobileNavLink href="/ngos" label="NGOs" onClick={toggleMenu} />
              <MobileNavLink href="/providers" label="Providers" onClick={toggleMenu} />
              <MobileNavLink href="/contact" label="Contact Us" onClick={toggleMenu} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ href, label, isScrolled }: { href: string; label: string; isScrolled: boolean }) => (
  <Link
    to={href}
    className={`font-medium transition duration-300 ${
      isScrolled
        ? "text-medishare-blue hover:text-medishare-orange"
        : "text-white hover:text-medishare-gold"
    } ${
      window.location.pathname === href ? "font-bold" : ""
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick: () => void }) => (
  <Link
    to={href}
    className="text-white hover:text-medishare-gold font-medium transition duration-300 block px-4"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Navbar;

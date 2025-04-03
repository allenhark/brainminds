import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full justify-center items-center transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-sm" : "bg-white/20 backdrop-blur-sm"
      }`}>
      <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold text-xl text-red-500">
          Brainminds
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <i className="fas fa-times text-2xl"></i>
          ) : (
            <i className="fas fa-bars text-2xl"></i>
          )}
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/pricing" className="text-gray-600">
            学习计划 Learning Plans
          </Link>
          <Link to="/become-tutor" className="text-gray-600">
            成为老师 Become a Tutor
          </Link>
          <Link to="/login" className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 text-center rounded-2xl">
            登录 Log in
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                to="/pricing"
                className="text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                学习计划 Learning Plans
              </Link>
              <Link
                to="/become-tutor"
                className="text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                成为老师 Become a Tutor
              </Link>
              <Link
                to="/login"
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 text-center rounded-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                登录 Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
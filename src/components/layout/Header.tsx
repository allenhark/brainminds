import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@/contexts/UserContext'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, refreshUser } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Get the role-specific dashboard path
  const getDashboardPath = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'STUDENT':
        return '/study/dashboard';
      case 'TUTOR':
        return '/my-tutor/dashboard';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  };

  const renderUserMenu = () => {
    if (!user) return null;

    // Profile and settings paths based on user role
    const profilePath = user.role === 'TUTOR'
      ? '/my-tutor/profile'
      : user.role === 'STUDENT'
        ? '/study/settings'
        : '/admin';

    const settingsPath = user.role === 'TUTOR'
      ? '/my-tutor/profile'
      : user.role === 'STUDENT'
        ? '/study/settings'
        : '/admin';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium">{user.firstName}</span>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?size=72&seed=${user.email}`}
              alt={user.firstName}
              className="bg-gray-50 h-10 rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link to={profilePath} className="flex items-center">
              <i className="far fa-user mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={settingsPath} className="flex items-center">
              <i className="far fa-cog mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center">
            <i className="far fa-sign-out-alt mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderRoleSpecificLinks = () => {
    if (!user) return null;

    const dashboardPath = getDashboardPath();

    return (
      <Link to={dashboardPath} className="text-gray-600 flex items-center">
        <i className="far fa-tachometer-alt mr-2 h-4 w-4" />
        Dashboard
      </Link>
    );
  };

  return (
    <header className={`sticky top-0 z-50 w-full justify-center items-center transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-sm" : "bg-white/20 backdrop-blur-sm"
      }`}>
      <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold text-xl text-red-500">
          <img src="/smalllogo.png" alt="学习English" className="h-14" />
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <i className="far fa-times h-6 w-6" /> : <i className="far fa-bars h-6 w-6" />}
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/pricing" className="text-gray-600">
                学习计划 Learning Plans
              </Link>
              <Link to="/become-tutor" className="text-gray-600">
                成为老师 Become a Tutor
              </Link>
              <Link to="/login" className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 text-center rounded-2xl">
                登录 Log in
              </Link>
            </>
          ) : (
            <>
              {renderRoleSpecificLinks()}
              {renderUserMenu()}
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              {!user ? (
                <>
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
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="far fa-tachometer-alt mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  {user.role === 'TUTOR' && (
                    <Link
                      to="/my-tutor/profile"
                      className="text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  )}
                  {user.role === 'STUDENT' && (
                    <Link
                      to="/study/settings"
                      className="text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
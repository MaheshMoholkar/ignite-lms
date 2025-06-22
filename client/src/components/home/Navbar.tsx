"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogOut,
  BookOpen,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, isLoading } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      queryClient.clear();
      toast.success("Logged out successfully");
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch {
      toast.error("Failed to logout");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              Ignite LMS
            </Link>
          </div>

          {/* Right side - Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-gray-700/50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-gray-700/50"
                  >
                    Get Started
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm border border-gray-700/50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700/50">
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                {!isLoading && (
                  <>
                    {user ? (
                      <div className="space-y-2">
                        <Link
                          href="/dashboard/courses"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-gray-300 hover:text-indigo-400 transition-all duration-200"
                        >
                          <BookOpen className="h-4 w-4 mr-3" />
                          My Courses
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-gray-300 hover:text-indigo-400 transition-all duration-200"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-300 transition-all duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                      >
                        Get Started
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";

import { Menu, Search } from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: user } = useUser();

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-md relative z-30">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between px-6 py-4 relative z-10">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200 border border-gray-600/50 hover:scale-105"
          >
            <Menu className="h-5 w-5 text-gray-300" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[300px] border border-gray-700/50">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, lessons..."
              className="bg-transparent border-none outline-none text-gray-300 placeholder-gray-400 flex-1"
            />
          </div>
        </div>

        {/* Right side - Notifications and user */}
        <div className="flex items-center space-x-4">
          {/* User avatar */}
          <div className="flex items-center space-x-3">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover shadow-lg border border-indigo-500/30"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg border border-indigo-500/30">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

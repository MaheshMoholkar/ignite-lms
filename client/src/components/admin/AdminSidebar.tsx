"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { X, Home, BookOpen, Users, BarChart3, LogOut } from "lucide-react";

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Background decorative elements */}
        <div className="absolute top-20 right-4 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-4 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="relative flex items-center justify-center p-6 border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
            <Link
              href="/admin"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              Ignite LMS
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 lg:hidden p-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200 hover:scale-105 border border-gray-600/50"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/30"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md border border-transparent hover:border-gray-600/50"
                  }`}
                >
                  {/* Icon */}
                  <item.icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white group-hover:scale-110"
                    }`}
                  />

                  {/* Label */}
                  <span className="relative z-10">{item.name}</span>

                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm space-y-2">
            <Link
              href="/"
              className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 relative overflow-hidden border border-transparent hover:border-gray-600/50"
            >
              <Home className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span>Back to Site</span>
              <div className="absolute inset-0 bg-gray-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            </Link>

            <button
              onClick={handleLogout}
              className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 relative overflow-hidden border border-transparent hover:border-red-500/30"
            >
              {/* Icon */}
              <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />

              {/* Label */}
              <span>Logout</span>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

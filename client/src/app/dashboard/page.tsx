"use client";

import { useUser } from "@/hooks/useUser";
import { BookOpen, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: user } = useUser();
  const router = useRouter();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  // Don't render anything while redirecting
  if (user && user.role === "admin") {
    return null;
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: "12",
      change: "+2 this month",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Study Hours",
      value: "48",
      change: "+12 this week",
      icon: Clock,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-300">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-green-400 mt-1">{stat.change}</p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

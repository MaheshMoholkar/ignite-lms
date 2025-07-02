"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/api";

interface DashboardStats {
  totalCourses: number;
  totalUsers: number;
  totalRevenue: number;
  totalEnrollments: number;
}

interface RecentCourse {
  _id: string;
  name: string;
  price: number;
  purchased: number;
  ratings: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, coursesResponse] = await Promise.all([
        api.get("/get-admin-stats"),
        api.get("/get-courses"),
      ]);

      setStats(statsResponse.data);
      setRecentCourses(coursesResponse.data.courses || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Courses</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats?.totalCourses || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">
                ${stats?.totalRevenue || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Enrollments</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats?.totalEnrollments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/admin/courses/new")}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Course</span>
          </button>
          <button
            onClick={() => router.push("/admin/users")}
            className="flex items-center justify-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
          >
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </button>
          <button
            onClick={() => router.push("/admin/analytics")}
            className="flex items-center justify-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
          >
            <TrendingUp className="h-5 w-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Courses</h2>
          <button
            onClick={() => router.push("/admin/courses")}
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {recentCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No courses found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium">{course.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>${course.price}</span>
                    <span>{course.purchased} students</span>
                    <span>⭐ {course.ratings.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/courses/${course._id}`)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="View Course"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/admin/courses/${course._id}/edit`)
                    }
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    title="Edit Course"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this course?")
                      ) {
                        // Handle delete
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

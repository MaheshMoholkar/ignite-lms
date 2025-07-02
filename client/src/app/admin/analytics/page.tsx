"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
} from "lucide-react";
import api from "@/lib/api";

interface AnalyticsData {
  totalCourses: number;
  totalUsers: number;
  totalRevenue: number;
  totalEnrollments: number;
  usersAnalytics: Array<{ month: string; count: number }>;
  coursesAnalytics: Array<{ month: string; count: number }>;
  ordersAnalytics: Array<{ month: string; count: number }>;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics data in parallel
      const [statsResponse, usersResponse, coursesResponse, ordersResponse] =
        await Promise.all([
          api.get("/get-admin-stats"),
          api.get("/get-users-analytics"),
          api.get("/get-courses-analytics"),
          api.get("/get-orders-analytics"),
        ]);

      setData({
        ...statsResponse.data,
        usersAnalytics: usersResponse.data.users || [],
        coursesAnalytics: coursesResponse.data.courses || [],
        ordersAnalytics: ordersResponse.data.orders || [],
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setError("Failed to load analytics data");
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

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400">
          Track your platform&apos;s performance and growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Courses</p>
              <p className="text-3xl font-bold text-white mt-2">
                {data?.totalCourses || 0}
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
                {data?.totalUsers || 0}
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
                ${data?.totalRevenue || 0}
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
                {data?.totalEnrollments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Platform Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-300">Active Courses</span>
              </div>
              <span className="text-white font-semibold">
                {data?.totalCourses || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Registered Users</span>
              </div>
              <span className="text-white font-semibold">
                {data?.totalUsers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">Total Enrollments</span>
              </div>
              <span className="text-white font-semibold">
                {data?.totalEnrollments || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Revenue Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Total Revenue</span>
              </div>
              <span className="text-white font-semibold">
                ${data?.totalRevenue || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">This Month</span>
              </div>
              <span className="text-white font-semibold">
                $
                {data?.ordersAnalytics?.[data.ordersAnalytics.length - 1]
                  ?.count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Growth Rate</span>
              </div>
              <span className="text-green-400 font-semibold">
                {data?.usersAnalytics && data.usersAnalytics.length > 1
                  ? `+${Math.round(
                      ((data.usersAnalytics[data.usersAnalytics.length - 1]
                        ?.count || 0) /
                        (data.usersAnalytics[data.usersAnalytics.length - 2]
                          ?.count || 1)) *
                        100
                    )}%`
                  : "+0%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">User Growth</h3>
          <div className="space-y-3">
            {data?.usersAnalytics?.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{item.month}</span>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Creation */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Course Creation</h3>
          <div className="space-y-3">
            {data?.coursesAnalytics?.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{item.month}</span>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Trends */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Order Trends</h3>
          <div className="space-y-3">
            {data?.ordersAnalytics?.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{item.month}</span>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
        <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Advanced Analytics Coming Soon
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We&apos;re working on advanced analytics features including detailed
          charts, user behavior tracking, and revenue analytics. Stay tuned!
        </p>
      </div>
    </div>
  );
}

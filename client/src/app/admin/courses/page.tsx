"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  Users,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface Course {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  estimatedPrice: number;
  level: string;
  totalVideos: number;
  ratings: number;
  purchased: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get-all-courses");
      setCourses(response.data.courses);
      setFilteredCourses(response.data.courses);
    } catch {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = useCallback(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    // Price filter
    if (selectedPrice !== "all") {
      switch (selectedPrice) {
        case "free":
          filtered = filtered.filter((course) => course.price === 0);
          break;
        case "paid":
          filtered = filtered.filter((course) => course.price > 0);
          break;
        case "under50":
          filtered = filtered.filter((course) => course.price < 50);
          break;
        case "under100":
          filtered = filtered.filter((course) => course.price < 100);
          break;
      }
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedLevel, selectedPrice]);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await api.delete(`/admin/courses/${courseId}`);
      toast.success("Course deleted successfully");
      fetchCourses(); // Refresh the list
    } catch {
      toast.error("Failed to delete course");
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-400"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Course Management
          </h1>
          <p className="text-gray-400">Manage all courses on your platform</p>
        </div>
        <button
          onClick={() => router.push("/admin/courses/new")}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>

          {/* Price Filter */}
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="under50">Under $50</option>
            <option value="under100">Under $100</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center px-4 py-2 bg-gray-700/30 rounded-lg border border-gray-600/50">
            <span className="text-gray-300 text-sm">
              {filteredCourses.length} courses
            </span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative">
            <Search className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">
            No courses found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gray-700 overflow-hidden">
                <Image
                  src={course.thumbnail.url}
                  alt="course thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {course.level}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(course.ratings)}
                    <span className="text-white text-sm font-medium ml-1">
                      {course.ratings.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {course.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.purchased}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{course.totalVideos} videos</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
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
                      onClick={() => handleDeleteCourse(course._id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

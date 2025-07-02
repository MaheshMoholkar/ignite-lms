"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Play,
  Clock,
  Star,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import api from "@/lib/api";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  price: number;
  estimatedPrice: number;
  tags: string;
  level: string;
  demoUrl: string;
  totalVideos: number;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: Review[];
  courseData: CourseData[];
  ratings: number;
  purchased: number;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CourseData {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: { title: string; url: string }[];
  suggestion: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const fetchUserCourses = async () => {
    try {
      const response = await api.get("/get-user-courses");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Failed to fetch user courses:", error);
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
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (for now, we'll show all as "in-progress" since we don't have progress tracking yet)
    if (filter !== "all") {
      // This can be enhanced later when we add progress tracking
      filtered = filtered.filter(() => {
        // For now, all courses are considered "in-progress"
        return filter === "in-progress";
      });
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filter]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, filter, filterCourses]);

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-400"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">My Courses</h1>
          <p className="text-gray-400 mt-1">
            Manage and track your learning progress
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="/dashboard/all-courses"
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse More Courses</span>
          </a>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all duration-200"
            >
              <option value="all">All Courses</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Course Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <span className="text-gray-300 text-sm">
            {filteredCourses.length} of {courses.length} purchased courses
          </span>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative">
            <BookOpen className="h-20 w-20 text-gray-600 mx-auto mb-6" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">
            {courses.length === 0
              ? "No courses purchased yet"
              : "No courses found"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {courses.length === 0
              ? "Start your learning journey by exploring our course catalog."
              : "Try adjusting your search terms or filters to find what you're looking for."}
          </p>
          {courses.length === 0 && (
            <a
              href="/dashboard/all-courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Courses
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/courses/${course._id}`)}
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                <Image
                  width={100}
                  height={100}
                  src={course.thumbnail.url}
                  alt="course thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-green-400/30">
                    Purchased
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
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
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      <span>{course.totalVideos} videos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (Placeholder for future implementation) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-indigo-400 font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Play className="h-4 w-4" />
                    <span>Continue</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/courses/${course._id}`);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Course</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

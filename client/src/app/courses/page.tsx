"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Star, Clock, Users, BookOpen } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import api from "@/lib/api";
import Navbar from "@/components/home/Navbar";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const { data: user } = useUser();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/get-courses");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
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
  }, [courses, searchTerm, selectedLevel, selectedPrice, filterCourses]);

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 pt-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-600/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              {courses.length} Courses Available
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Explore Our Courses
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover a world of knowledge with our comprehensive collection of
              courses designed to help you grow and succeed in your career.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for courses, topics, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-indigo-400" />
              <span className="text-gray-300 font-medium">Filter by:</span>
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm transition-all duration-200 hover:border-gray-500/50"
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
              className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm transition-all duration-200 hover:border-gray-500/50"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="under50">Under $50</option>
              <option value="under100">Under $100</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <p className="text-gray-300 font-medium">
                Showing{" "}
                <span className="text-indigo-400 font-semibold">
                  {filteredCourses.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-semibold">
                  {courses.length}
                </span>{" "}
                courses
              </p>
            </div>
            {filteredCourses.length > 0 && (
              <div className="text-sm text-gray-400">
                {Math.ceil(filteredCourses.length / 3)} pages of results
              </div>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <BookOpen className="h-20 w-20 text-gray-600 mx-auto mb-6" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
              No courses found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what
              you&apos;re looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <div
                key={course._id}
                className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2 hover:border-indigo-500/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Thumbnail */}
                <div className="relative h-56 bg-gray-700 overflow-hidden">
                  <Image
                    src={course.thumbnail.url}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-indigo-500/30">
                      {course.level}
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
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-indigo-400" />
                        <span>{course.totalVideos} videos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span>{course.purchased} students</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      {course.price === 0 ? (
                        <span className="text-green-400 font-bold text-lg">
                          Free
                        </span>
                      ) : (
                        <>
                          <span className="text-white font-bold text-lg">
                            ${course.price}
                          </span>
                          {course.estimatedPrice > course.price && (
                            <span className="text-gray-400 line-through text-sm">
                              ${course.estimatedPrice}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                      {user ? "Enroll Now" : "Get Started"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

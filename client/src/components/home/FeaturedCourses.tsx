"use client";

import { usePublicCourses } from "@/hooks/useApi";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FeaturedCourses() {
  const { data: courses, isLoading, error } = usePublicCourses();
  const router = useRouter();

  if (isLoading) {
    return (
      <section
        id="courses"
        className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-300">
              Start your learning journey with our most popular courses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-pulse border border-gray-700/50"
              >
                <div className="h-48 bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !courses || courses.length === 0) {
    return (
      <section
        id="courses"
        className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-300">
              No courses available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show only first 6 courses
  const featuredCourses = courses.slice(0, 6);

  return (
    <section
      id="courses"
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-300">
            Start your learning journey with our most popular courses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, index) => (
            <div
              key={course._id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-700/50 hover:border-indigo-500/50 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/courses/${course._id}`)}
            >
              <div className="relative h-48">
                <Image
                  src={course.thumbnail.url}
                  alt={course.name}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  ${course.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {course.name}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-300">
                        {course.ratings.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {course.purchased}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {course.level}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/courses/${course._id}`);
                  }}
                >
                  View Course
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-flex items-center px-8 py-4 border-2 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

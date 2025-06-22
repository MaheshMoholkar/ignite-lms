"use client";

import { ArrowRight, Play, Users, BookOpen, Award } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></span>
                Learn from the Best
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Master Skills with
                <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Expert-Led Courses
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                Join thousands of students learning from curated courses created
                by industry experts. Access premium content, track your
                progress, and master new skills at your own pace.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-gray-300 hover:border-indigo-400 hover:text-indigo-400 font-semibold rounded-xl transition-all duration-200 bg-gray-800/50 backdrop-blur-sm">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600/30 rounded-xl mx-auto mb-3 border border-indigo-500/30">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600/30 rounded-xl mx-auto mb-3 border border-purple-500/30">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Expert Courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-600/30 rounded-xl mx-auto mb-3 border border-pink-500/30">
                  <Award className="h-6 w-6 text-pink-400" />
                </div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-gray-400">
                  Student Satisfaction
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main illustration container */}
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-blue-500 rounded-full opacity-20"></div>

                {/* Mockup content */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-600/20 p-4 rounded-xl border border-indigo-500/30">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg mb-2"></div>
                      <div className="h-3 bg-indigo-600/50 rounded w-full mb-1"></div>
                      <div className="h-2 bg-indigo-600/50 rounded w-2/3"></div>
                    </div>
                    <div className="bg-purple-600/20 p-4 rounded-xl border border-purple-500/30">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg mb-2"></div>
                      <div className="h-3 bg-purple-600/50 rounded w-full mb-1"></div>
                      <div className="h-2 bg-purple-600/50 rounded w-2/3"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                      Live
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse hidden lg:block"></div>
            <div className="absolute bottom-20 -left-8 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-1000 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

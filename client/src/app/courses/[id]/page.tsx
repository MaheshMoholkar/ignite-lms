"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Clock,
  Users,
  Play,
  Check,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Award,
  Target,
  FileText,
  Video,
  MessageCircle,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import api from "@/lib/api";
import Navbar from "@/components/home/Navbar";
import Image from "next/image";

interface Course {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  price: number;
  estimatedPrice: number;
  tags: string[];
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
  _id: string;
  user: {
    name: string;
    avatar: {
      url: string;
    };
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface CourseData {
  title: string;
  description: string;
  videoFile?: {
    public_id: string;
    url: string;
  };
  videoThumbnail: {
    url: string;
  };
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: { title: string; url: string }[];
  suggestion: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/get-course/${params.id}`);
      setCourse(response.data.course);
    } catch (error) {
      setError((error as string) || "Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchCourseDetails();
    }
  }, [fetchCourseDetails, params.id]);

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

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const getTotalDuration = () => {
    if (!course?.courseData) return 0;
    return course.courseData.reduce(
      (total, item) => total + (item.videoLength || 0),
      0
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Check if user has purchased this course
  const isCoursePurchased = () => {
    if (!user || !course) return false;
    return (
      user.courses?.some(
        (purchasedCourse: { courseId: string }) =>
          purchasedCourse.courseId === course._id
      ) || false
    );
  };

  const getEnrollButtonText = () => {
    if (!user) return "Get Started";
    if (isCoursePurchased()) return "Go to Course";
    return "Enroll Now";
  };

  const handleEnrollClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isCoursePurchased()) {
      router.push("/dashboard/courses");
      return;
    }

    // Handle enrollment logic here
    // For now, just show a message
    alert("Enrollment functionality to be implemented");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Course Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              {error || "The course you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => router.push("/courses")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Courses</span>
              </button>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium rounded-full">
                    {course.level}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getRatingStars(course.ratings)}
                    <span className="text-white text-sm font-medium ml-1">
                      {course.ratings.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({course.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {course.name}
                </h1>

                <p className="text-lg text-gray-300 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    <span>{formatDuration(getTotalDuration())}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-purple-400" />
                    <span>{course.totalVideos} videos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-400" />
                    <span>{course.purchased} students enrolled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    <span>
                      Last updated{" "}
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 sticky top-20">
                {/* Course Thumbnail */}
                <div className="relative h-40 bg-gray-700 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={course.thumbnail.url}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <button className="absolute inset-0 flex items-center justify-center group">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </button>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {course.price === 0 ? (
                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-400">
                        Free
                      </span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          ${course.price}
                        </span>
                        {course.estimatedPrice > course.price && (
                          <span className="text-lg text-gray-400 line-through">
                            ${course.estimatedPrice}
                          </span>
                        )}
                      </div>
                      {course.estimatedPrice > course.price && (
                        <span className="text-green-400 text-sm font-medium">
                          {Math.round(
                            ((course.estimatedPrice - course.price) /
                              course.estimatedPrice) *
                              100
                          )}
                          % off
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {getEnrollButtonText()}
                  </button>
                  {course.demoUrl && (
                    <button className="w-full py-2.5 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Preview Course</span>
                    </button>
                  )}
                </div>

                {/* Course Includes */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <h4 className="text-white font-semibold mb-2 text-sm">
                    This course includes:
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Video className="h-3 w-3 text-indigo-400" />
                      <span>{course.totalVideos} hours on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3 w-3 text-purple-400" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-3 w-3 text-green-400" />
                      <span>Q&A support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-3 w-3 text-yellow-400" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700/50">
            {[
              { id: "overview", label: "Overview", icon: BookOpen },
              { id: "curriculum", label: "Curriculum", icon: FileText },
              { id: "reviews", label: "Reviews", icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* What you'll learn */}
                {course.benefits && course.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      What you&apos;ll learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {course.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">
                            {benefit.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Requirements
                    </h3>
                    <div className="space-y-2">
                      {course.prerequisites.map((prerequisite, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Target className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">
                            {prerequisite.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Description
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Course Content
                  </h3>
                  <div className="text-sm text-gray-400">
                    {course.courseData?.length || 0} sections •{" "}
                    {course.totalVideos} lectures •{" "}
                    {formatDuration(getTotalDuration())}
                  </div>
                </div>

                {course.courseData && course.courseData.length > 0 ? (
                  <div className="space-y-2">
                    {course.courseData.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className="border border-gray-700/50 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSection(section.title)}
                          className="w-full px-4 py-3 bg-gray-700/30 hover:bg-gray-700/50 text-left flex items-center justify-between transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-4 w-4 text-indigo-400" />
                            <span className="text-white font-medium text-sm">
                              {section.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">
                              {formatDuration(section.videoLength || 0)}
                            </span>
                            <div
                              className={`transform transition-transform duration-200 ${
                                expandedSections.has(section.title)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              ▼
                            </div>
                          </div>
                        </button>

                        {expandedSections.has(section.title) && (
                          <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-700/50">
                            <p className="text-gray-300 text-sm mb-2">
                              {section.description}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Video className="h-3 w-3" />
                              <span>1 lecture</span>
                              <span>•</span>
                              <span>
                                {formatDuration(section.videoLength || 0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      No curriculum available yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Student Reviews
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getRatingStars(course.ratings)}
                      <span className="text-white font-medium ml-1 text-sm">
                        {course.ratings.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      ({course.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>

                {course.reviews && course.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {course.reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border border-gray-700/50 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium text-sm">
                                {review.user.name}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {getRatingStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span>
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MessageCircle className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      No reviews yet. Be the first to review this course!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Play,
  Award,
  Clock,
  Users,
  Shield,
  Smartphone,
  BookOpen,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Play,
    title: "Video-Based Learning",
    description:
      "Learn through high-quality video content with interactive elements and real-time feedback.",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Earn certificates upon course completion to showcase your new skills and knowledge.",
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description:
      "Access courses anytime, anywhere with lifetime access to all purchased content.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join a community of learners and get help from peers and instructors.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Your data and progress are protected with enterprise-grade security measures.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Learn on any device with our responsive design optimized for mobile learning.",
  },
  {
    icon: BookOpen,
    title: "Structured Content",
    description:
      "Well-organized course materials with clear learning paths and objectives.",
  },
  {
    icon: Headphones,
    title: "Audio Support",
    description:
      "Listen to course content on the go with audio versions and transcripts.",
  },
];

export default function Features() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Experience the best in online learning with our comprehensive
            features designed to enhance your educational journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:border-indigo-500/50">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-6 group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their
              careers with our expert-led courses.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

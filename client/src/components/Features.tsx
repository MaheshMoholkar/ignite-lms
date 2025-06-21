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
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their
              careers with our expert-led courses.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useLayout } from "@/hooks/useApi";
import { BookOpen, Code, Palette, TrendingUp, Users, Zap } from "lucide-react";

const categoryIcons = {
  "Web Development": Code,
  Design: Palette,
  Business: TrendingUp,
  Marketing: Zap,
  Technology: Code,
  "Personal Development": Users,
  default: BookOpen,
};

export default function Categories() {
  const { data: categoriesData, isLoading, error } = useLayout("categories");

  if (isLoading) {
    return (
      <section id="categories" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover courses in your area of interest
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categoriesData?.categories) {
    return (
      <section id="categories" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No categories available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover courses in your area of interest
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesData.categories.map((category, index) => {
            const IconComponent =
              categoryIcons[category.title as keyof typeof categoryIcons] ||
              categoryIcons.default;

            return (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                  <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

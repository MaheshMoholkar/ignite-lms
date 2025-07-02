"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import Image from "next/image";

interface CourseFormData {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  tags: string;
  level: string;
  demoUrl: string;
  totalVideos: number;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseData: {
    title: string;
    description: string;
    videoFile?: { public_id: string; url: string };
    videoSection: string;
    videoLength: number;
    links: { title: string; url: string }[];
    suggestion: string;
  }[];
}

export default function NewCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadingVideos, setUploadingVideos] = useState<{
    [key: number]: boolean;
  }>({});
  const [formData, setFormData] = useState<CourseFormData>({
    name: "",
    description: "",
    price: 0,
    estimatedPrice: 0,
    tags: "",
    level: "Beginner",
    demoUrl: "",
    totalVideos: 0,
    benefits: [{ title: "" }],
    prerequisites: [{ title: "" }],
    courseData: [
      {
        title: "",
        description: "",
        videoSection: "",
        videoLength: 0,
        links: [{ title: "", url: "" }],
        suggestion: "",
      },
    ],
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = async (sectionIndex: number, file: File) => {
    try {
      setUploadingVideos((prev) => ({ ...prev, [sectionIndex]: true }));

      const formData = new FormData();
      formData.append("video", file);

      const response = await api.post("/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const videoFile = response.data.videoFile;

      setFormData((prev) => ({
        ...prev,
        courseData: prev.courseData.map((section, i) =>
          i === sectionIndex ? { ...section, videoFile: videoFile } : section
        ),
      }));

      toast.success("Video uploaded successfully!");
    } catch {
      toast.error("Failed to upload video");
    } finally {
      setUploadingVideos((prev) => ({ ...prev, [sectionIndex]: false }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { title: "" }],
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? { ...benefit, title: value } : benefit
      ),
    }));
  };

  const addPrerequisite = () => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, { title: "" }],
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prerequisite, i) =>
        i === index ? { ...prerequisite, title: value } : prerequisite
      ),
    }));
  };

  const addCourseSection = () => {
    setFormData((prev) => ({
      ...prev,
      courseData: [
        ...prev.courseData,
        {
          title: "",
          description: "",
          videoSection: "",
          videoLength: 0,
          links: [{ title: "", url: "" }],
          suggestion: "",
        },
      ],
    }));
  };

  const removeCourseSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      courseData: prev.courseData.filter((_, i) => i !== index),
    }));
  };

  const updateCourseSection = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      courseData: prev.courseData.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add thumbnail
      if (thumbnail) {
        formDataToSend.append("thumbnail", thumbnail);
      }

      // Add basic course data
      Object.keys(formData).forEach((key) => {
        if (key !== "courseData") {
          const value = formData[key as keyof CourseFormData];
          if (key === "tags" && typeof value === "string") {
            // Convert tags string to array for sending
            const tagsArray = value.split(",").map((tag: string) => tag.trim());
            formDataToSend.append(key, JSON.stringify(tagsArray));
            return; // Prevent further processing for tags
          } else if (typeof value === "string" || typeof value === "number") {
            formDataToSend.append(key, value.toString());
          } else if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          }
        }
      });

      // Add course data with video files
      formData.courseData.forEach((section, index) => {
        formDataToSend.append(`courseData[${index}].title`, section.title);
        formDataToSend.append(
          `courseData[${index}].description`,
          section.description
        );

        if (section.videoFile) {
          formDataToSend.append(
            `courseData[${index}].videoFile`,
            JSON.stringify(section.videoFile)
          );
        }
        formDataToSend.append(
          `courseData[${index}].videoSection`,
          section.videoSection
        );
        formDataToSend.append(
          `courseData[${index}].videoLength`,
          section.videoLength.toString()
        );
        formDataToSend.append(
          `courseData[${index}].suggestion`,
          section.suggestion
        );
      });

      await api.post("/create-course", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course created successfully!");
      router.push("/admin/courses");
    } catch {
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Course
          </h1>
          <p className="text-gray-400">Add a new course to your platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter course name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Price ($)
              </label>
              <input
                type="number"
                name="estimatedPrice"
                value={formData.estimatedPrice}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Videos
              </label>
              <input
                type="number"
                name="totalVideos"
                value={formData.totalVideos}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Demo URL
              </label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com/demo"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="JavaScript, React, Web Development"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter course description"
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Course Thumbnail
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600/50 border-dashed rounded-lg cursor-pointer bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>

            {thumbnailPreview && (
              <div className="relative w-48 h-32 mx-auto">
                <Image
                  width={100}
                  height={100}
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              What students will learn
            </h2>
            <button
              type="button"
              onClick={addBenefit}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Benefit</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter what students will learn"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Prerequisites</h2>
            <button
              type="button"
              onClick={addPrerequisite}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Prerequisite</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={prerequisite.title}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter prerequisite"
                />
                {formData.prerequisites.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrerequisite(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Course Content</h2>
            <button
              type="button"
              onClick={addCourseSection}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-6">
            {formData.courseData.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border border-gray-600/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Section {sectionIndex + 1}
                  </h3>
                  {formData.courseData.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourseSection(sectionIndex)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateCourseSection(sectionIndex, "title", e.target.value)
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Section title"
                  />
                  <input
                    type="text"
                    value={section.videoSection}
                    onChange={(e) =>
                      updateCourseSection(
                        sectionIndex,
                        "videoSection",
                        e.target.value
                      )
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Video section"
                  />
                  <input
                    type="number"
                    value={section.videoLength}
                    onChange={(e) =>
                      updateCourseSection(
                        sectionIndex,
                        "videoLength",
                        parseInt(e.target.value)
                      )
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Video length (minutes)"
                  />
                </div>

                {/* Video Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Upload
                  </label>
                  <div className="space-y-3">
                    {/* Video File Upload */}
                    <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-4">
                      <div className="text-center">
                        {section.videoFile ? (
                          <div className="space-y-2">
                            <p className="text-green-400 text-sm">
                              Video uploaded successfully!
                            </p>
                            <p className="text-gray-400 text-xs">
                              {section.videoFile.url}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  courseData: prev.courseData.map(
                                    (section, i) =>
                                      i === sectionIndex
                                        ? { ...section, videoFile: undefined }
                                        : section
                                  ),
                                }))
                              }
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove Video
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm mb-2">
                              Upload video file (MP4, WebM, OGG, MOV, AVI, WMV)
                            </p>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleVideoUpload(sectionIndex, file);
                                }
                              }}
                              className="hidden"
                              id={`video-upload-${sectionIndex}`}
                            />
                            <label
                              htmlFor={`video-upload-${sectionIndex}`}
                              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              {uploadingVideos[sectionIndex] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                              <span>
                                {uploadingVideos[sectionIndex]
                                  ? "Uploading..."
                                  : "Choose Video"}
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <textarea
                  value={section.description}
                  onChange={(e) =>
                    updateCourseSection(
                      sectionIndex,
                      "description",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                  placeholder="Section description"
                />

                <textarea
                  value={section.suggestion}
                  onChange={(e) =>
                    updateCourseSection(
                      sectionIndex,
                      "suggestion",
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                  placeholder="Suggestion for this section"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

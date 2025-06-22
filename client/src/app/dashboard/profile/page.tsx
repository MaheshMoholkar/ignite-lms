"use client";

import { useState, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import {
  User,
  Mail,
  Edit,
  Save,
  X,
  Camera,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ProfilePage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setErrors({});

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);

      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      await api.put("/update-user", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as ApiError).response?.data?.message ||
            "Failed to update profile"
          : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    setErrors({});

    // Validate passwords
    if (passwordData.newPassword.length < 3) {
      setErrors({ newPassword: "Password must be at least 3 characters long" });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      await api.put("/update-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as ApiError).response?.data?.message ||
            "Failed to update password"
          : "Failed to update password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrors({});
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setIsChangingPassword(false);
  };

  const stats = [
    { label: "Courses Enrolled", value: "12" },
    { label: "Courses Completed", value: "8" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="xs:flex-col md:flex gap-2 items-center space-x-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? "Saving..." : "Save"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="p-8">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  {previewUrl ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : user?.avatar?.url ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                      <Image
                        src={user.avatar.url}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-all duration-200"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.name}
                  </h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 px-4 py-3 bg-gray-700/30 rounded-xl">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-white">{formData.name}</span>
                      </div>
                    )}
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-700/30 rounded-xl">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-white">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Password</h3>
                  <p className="text-gray-400 text-sm">Update password</p>
                </div>
                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? "Updating..." : "Update"}</span>
                    </button>
                    <button
                      onClick={handleCancelPassword}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {isChangingPassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all duration-200 pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.oldPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.oldPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all duration-200 pr-12"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all duration-200 pr-12"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Learning Stats
            </h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className="text-white font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

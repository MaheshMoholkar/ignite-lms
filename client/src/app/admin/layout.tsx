"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 relative z-10"></div>
      </div>
    );
  }

  if (!user && !isLoading) {
    // Show a redirecting spinner/message to avoid hydration mismatch
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <span className="text-white text-lg">Redirecting...</span>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <span className="text-white text-lg">Access Denied</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-72 flex flex-col relative z-10">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { Shield, Loader2, Mail } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const Activation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get activation user info from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const activationEmail = getCookie("activation_email");
    const activationName = getCookie("activation_name");

    if (!activationEmail) {
      toast.error("No activation email found. Please register again.");
      router.replace("/register");
      return;
    }

    setUserEmail(decodeURIComponent(activationEmail));
    if (activationName) {
      setUserName(activationName);
    }
  }, [router]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearActivationToken = () => {
    document.cookie =
      "activation_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "activation_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "activation_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const activation_code = otp.join("");
    if (activation_code.length !== 4) {
      setError("Please enter a 4-digit code.");
      setLoading(false);
      return;
    }

    try {
      await api.post(`/activate-user`, {
        activation_code,
      });
      toast.success("Account activated successfully!");
      // Clear the activation token from cookies
      clearActivationToken();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.replace("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "An error occurred during activation.";

      // If token is invalid or expired, redirect to register
      if (
        axiosError.response?.status === 400 &&
        (errorMessage.includes("Invalid or expired activation token") ||
          errorMessage.includes("Please provide activation token"))
      ) {
        toast.error(
          "Activation token is invalid or expired. Please register again."
        );
        clearActivationToken();
        router.replace("/register");
        return;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await api.post(`/resend-activation-code`);
      toast.success("Activation code resent successfully!");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to resend code.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no email (means token is invalid)
  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/25">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Activate Your Account
          </h2>
          <p className="text-gray-400 text-lg mb-4">
            Enter the 4-digit activation code sent to your email.
          </p>

          {/* Email display */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-5 w-5 text-indigo-400" />
              <span className="text-white font-medium">{userEmail}</span>
            </div>
            {userName && (
              <p className="text-gray-400 text-sm mt-1">Welcome, {userName}!</p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <button
                type="button"
                onClick={() => {
                  clearActivationToken();
                  router.replace("/register");
                }}
                className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200 underline"
              >
                Wrong email? Register with different email
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-600 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Activating...
                </>
              ) : (
                "Activate Account"
              )}
            </button>
            {error && (
              <p className="mt-2 text-center text-sm text-red-400 flex items-center justify-center">
                <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {error}
              </p>
            )}

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend Activation Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Activation;

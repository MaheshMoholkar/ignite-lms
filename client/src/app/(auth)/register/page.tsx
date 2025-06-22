import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Join Our Community!
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Start your learning journey today and unlock access to thousands
              of courses.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">
                  Free access to basic courses
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">Learn at your own pace</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-600/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-pink-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-300">Earn certificates</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-600/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-600/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-pink-600/20 rounded-full"></div>
        <div className="absolute top-1/3 left-20 w-12 h-12 bg-blue-600/15 rounded-full"></div>
        <div className="absolute bottom-1/3 right-20 w-8 h-8 bg-indigo-600/25 rounded-full"></div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-600/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-600/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-indigo-600/8 rounded-full blur-lg"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/25">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Create your account
            </h2>
            <p className="text-gray-400 text-lg">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

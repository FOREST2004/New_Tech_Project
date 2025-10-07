import React, { useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FiCalendar, FiUsers, FiSettings } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";

function LoginForm({ onLogin, onForgot, error, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:4321'}/auth/google`;
  };

  return (
    <div className="min-h-screen 
      bg-gradient-to-br from-primary-500 via-white to-accent-300 
      dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
      flex items-center justify-center p-4 transition-all duration-300">
      
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle variant="simple" size="default" />
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 dark:bg-accent-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-warning-200 dark:bg-warning-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
              <FiCalendar className="w-8 h-8 text-gray dark:text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-secondary-600">
              Sign in to your Event Management account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <HiOutlineEye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-xl p-4">
                <p className="form-error text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-semibold shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                Sign in with Google
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={onForgot}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-xl mb-2">
              <FiCalendar className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-xs text-secondary-600 dark:text-gray-300 font-medium">Event Management</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-xl mb-2">
              <FiUsers className="w-6 h-6 text-accent-600" />
            </div>
            <p className="text-xs text-secondary-600 dark:text-gray-300 font-medium">Member Portal</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-warning-100 dark:bg-accent-800 rounded-xl mb-2">
              <FiSettings className="w-6 h-6 text-warning-600" />
            </div>
            <p className="text-xs text-secondary-600 dark:text-gray-300 font-medium">Admin Tools</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
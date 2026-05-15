'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  Loader2,
  KeyRound,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

import api from '@/services/api';
import { AxiosError } from 'axios';

// ================= TYPES =================

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role?: string;
  };
}

interface ApiErrorResponse {
  message: string;
}

export default function AdminLogin() {
  // ================= LOGIN STATES =================

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ================= PASSWORD CHANGE STATES =================

  const [oldPassword, setOldPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  // ================= PASSWORD TOGGLE STATES =================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  // ================= UI STATES =================

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [changeLoading, setChangeLoading] =
    useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const router = useRouter();

  // =========================================================
  // LOGIN FUNCTION
  // =========================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } =
        await api.post<LoginResponse>(
          '/auth/login',
          {
            username,
            password,
          }
        );

      // Save auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'adminToken',
          data.token
        );

        localStorage.setItem(
          'adminUser',
          JSON.stringify(data.user)
        );
      }

      // Redirect
      router.push('/inquiries');

    } catch (err) {
      const error =
        err as AxiosError<ApiErrorResponse>;

      setError(
        error.response?.data?.message ||
          'Login failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CHANGE PASSWORD FUNCTION
  // =========================================================

  const handleChangePassword = async () => {
    setChangeLoading(true);

    setError('');
    setSuccess('');

    try {
      const { data } = await api.post(
        '/auth/change-password',
        {
          username,
          oldPassword,
          newPassword,
        }
      );

      setSuccess(
        data.message ||
          'Password changed successfully'
      );

      // Clear fields
      setOldPassword('');
      setNewPassword('');

      // Auto switch to login
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccess('');
      }, 2000);

    } catch (err) {
      const error =
        err as AxiosError<ApiErrorResponse>;

      setError(
        error.response?.data?.message ||
          'Password change failed'
      );

    } finally {
      setChangeLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#0f2a55] flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* HEADER */}
        <div className="bg-hercules-gold p-6 text-center">
          <h2 className="text-2xl font-bold text-[#0f2a55]">
            Admin Login
          </h2>

          <p className="text-[#0f2a55]/80 text-sm">
            Secure Access Area
          </p>
        </div>

        {/* ================================================= */}
        {/* LOGIN FORM */}
        {/* ================================================= */}

        {!showChangePassword ? (
          <form
            onSubmit={handleLogin}
            className="p-8 space-y-6"
          >
            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center">
                ⚠️ {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm text-center">
                ✅ {success}
              </div>
            )}

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Username
              </label>

              <div className="relative group">
                <User
                  className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#0f2a55] transition-colors"
                  size={20}
                />

                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Password
              </label>

              <div className="relative group">
                <Lock
                  className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#0f2a55] transition-colors"
                  size={20}
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#0f2a55] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f2a55] hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                'Sign In'
              )}
            </button>

            {/* CHANGE PASSWORD BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowChangePassword(true);
                setError('');
                setSuccess('');
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Reset Password?
            </button>
          </form>
        ) : (
          /* ================================================= */
          /* CHANGE PASSWORD FORM */
          /* ================================================= */

          <div className="p-8 space-y-6">

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center">
                ⚠️ {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm text-center">
                ✅ {success}
              </div>
            )}

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Username
              </label>

              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* OLD PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                Old Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type={
                    showOldPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={oldPassword}
                  onChange={(e) =>
                    setOldPassword(e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                  placeholder="Enter old password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowOldPassword(
                      !showOldPassword
                    )
                  }
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#0f2a55]"
                >
                  {showOldPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">
                New Password
              </label>

              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />

                <input
                  type={
                    showNewPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#0f2a55]"
                >
                  {showNewPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* CHANGE PASSWORD BUTTON */}
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={changeLoading}
              className="w-full bg-[#0f2a55] hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {changeLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                'Change Password'
              )}
            </button>

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowChangePassword(false);
                setError('');
                setSuccess('');
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
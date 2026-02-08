'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2 } from 'lucide-react';
// 1. Import your centralized API instance instead of axios directly
import api from '@/services/api'; 
import { AxiosError } from 'axios';

// Define expected response types
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
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 2. Use the 'api' instance
      // Note: baseURL is already handled in api.ts, so we just pass the endpoint path
      const { data } = await api.post<LoginResponse>('/auth/login', {
        username,
        password
      });

      // Save token to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      }
      
      // Redirect to Dashboard
      router.push('/');
      
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2a55] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-hercules-gold p-6 text-center">
          <h2 className="text-2xl font-bold text-[#0f2a55]">Admin Login</h2>
          <p className="text-[#0f2a55]/80 text-sm">Secure Access Area</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#0f2a55] transition-colors" size={20} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#0f2a55] transition-colors" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#0f2a55] focus:ring-1 focus:ring-[#0f2a55] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0f2a55] hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
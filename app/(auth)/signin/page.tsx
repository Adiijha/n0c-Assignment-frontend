'use client';

import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from "../../lib/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useIsAuthenticated, useLogin } from "../../store/authStore";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

const Signin: React.FC = () => {
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [hasMounted, setHasMounted] = useState(false);
  
  const router = useRouter();

  const isAuthenticated = useIsAuthenticated();
  const login = useLogin();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [hasMounted, isAuthenticated, router]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      const accessToken = response?.message?.accessToken;
      const refreshToken = response?.message?.refreshToken;
      const user = response?.message?.user;

      if (!accessToken || !user) {
        throw new Error("Missing token or user data in response");
      }

      login(accessToken, user, refreshToken);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-10 border border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-300 text-base">
            Please sign in to continue to your dashboard.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
              placeholder="Enter your email"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white pr-10"
              placeholder="Enter your password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 text-gray-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md text-white font-semibold bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-700/30 border border-red-600 rounded-lg p-3">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        )}

        <p className="mt-8 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white underline hover:text-gray-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { registerUser } from '../../lib/api';
import { Loader2 } from 'lucide-react';
import { useIsAuthenticated } from '../../store/authStore';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string>('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState(false);

  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
      if (isAuthenticated) {
        router.replace('/dashboard');
      }
    }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (
      password.length < 6 ||
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        'Password must be at least 6 characters long and include both letters and numbers.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    const payload = { name, email, password };

    try {
      setIsLoading(true);
      const response = await registerUser(payload);
      console.log('Registration Response:', response);

      const rawMessage = response?.message;
  const successMessage =
    typeof rawMessage === 'string' && rawMessage.trim().length > 0
      ? rawMessage
      : 'Registration successful! Redirecting...';
      setSuccess(successMessage);
      setRedirecting(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: unknown) {
      console.error('Registration error:', err);

      let errorMessage = 'Something went wrong. Please try again.';

if (err && typeof err === 'object' && 'message' in err) {
  errorMessage =
    typeof err.message === 'string'
      ? err.message
      : JSON.stringify(err.message);
} else if (typeof err === 'string') {
  errorMessage = err;
}

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

if (redirecting) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      <p className="mt-4 text-lg">Redirecting to dashboard...</p>
    </div>
  );
}

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    router.replace('/dashboard');
  }
}, []);



  return (

    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-0">
      <div className="p-10 rounded-xl shadow-xl my-10 max-w-md w-full bg-white/5 backdrop-blur-md border border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Sign up to access your dashboard
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              required
              disabled={isLoading}
              className="w-full rounded-md bg-white/10 text-white placeholder-gray-500 border border-gray-700 p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>


          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="w-full rounded-md bg-white/10 text-white placeholder-gray-500 border border-gray-700 p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                required
                disabled={isLoading}
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-500 border border-gray-700 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                disabled={isLoading}
                className={`w-full rounded-md bg-white/10 text-white placeholder-gray-500 border p-3 pr-10 focus:outline-none focus:ring-2 ${
                  passwordsMatch
                    ? 'border-gray-700 focus:ring-purple-600'
                    : 'border-red-500 focus:ring-red-600'
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>
<div className="text-xs text-gray-400 bg-gray-800/40 rounded-md p-3 border border-gray-700">
  <p className="mb-1 font-semibold text-white">Password must:</p>
  <ul className="list-disc list-inside space-y-1 pl-2">
    <li>Be at least 6 characters long</li>
    <li>Contain at least one letter (a-z, A-Z)</li>
    <li>Contain at least one number (0-9)</li>
  </ul>
</div>
          {success && (
            <div className="p-3 text-green-400 border border-green-600 rounded-md text-center text-sm bg-green-900/30">
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 text-red-400 border border-red-600 rounded-md text-center text-sm bg-red-900/30">
              {error}
            </div>
          )}
<button
  type="submit"
  disabled={isLoading || !passwordsMatch}
  className="w-full py-3 rounded-md text-white font-semibold bg-purple-700 hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
>
  {isLoading ? (
    <Loader2 className="h-5 w-5 animate-spin" />
  ) : (
    'Sign Up'
  )}
</button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="text-white hover:text-gray-400 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

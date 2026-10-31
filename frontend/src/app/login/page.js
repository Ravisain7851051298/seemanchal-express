'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Shield,
  KeyRound,
  Users,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'reporter') {
        router.push('/reporter');
      } else {
        router.push('/member');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please enter valid email & password.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@seemanchalexpress.in');
      setPassword('Admin@123456');
    } else if (role === 'member') {
      setEmail('tariq.anwer@seemanchalexpress.in');
      setPassword('Member@123456');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <img
            src="/logo.jpeg"
            alt="Seemanchal Express Logo"
            className="w-16 h-16 object-contain rounded-2xl border border-slate-200 shadow-md mx-auto mb-3 bg-white p-1"
          />
          <h1 className="text-2xl font-black text-slate-900">
            Seemanchal Express Portal Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access Admin Panel, Reporter Desk, or Member Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@seemanchalexpress.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Demo Fill:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="py-1.5 px-2 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-semibold text-center transition-colors flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                Admin Fill
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('member')}
                className="py-1.5 px-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold text-center transition-colors flex items-center justify-center gap-1"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Member Fill
              </button>
            </div>
          </div>

          {/* Registration Links */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
            <p>Do not have an account yet?</p>
            <div className="flex justify-center gap-4 text-red-600 font-bold">
              <Link href="/apply-member" className="hover:underline">
                Apply as Member
              </Link>
              <span>•</span>
              <Link href="/apply-reporter" className="hover:underline">
                Apply as Reporter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

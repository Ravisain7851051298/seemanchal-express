'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Search,
  User,
  Shield,
  FileText,
  Menu,
  X,
  Flame,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import GoogleTranslate from './GoogleTranslate';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [breakingNews, setBreakingNews] = useState([]);

  // Fetch breaking news
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const newsRes = await api.get('/news/breaking');
        if (newsRes.data.success) {
          setBreakingNews(newsRes.data.news);
        }
      } catch (err) {
        console.error('Navbar data fetch error:', err);
      }
    };

    fetchNavbarData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'reporter') return '/reporter';
    return '/member';
  };

  const todayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      {/* 1. Top Utility Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-amber-400 font-medium">{todayDate}</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              F 65, Shaheen Bagh, Okhla, New Delhi-110025
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:9871023184"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+91 9871023184</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a
              href="mailto:mail@seemanchalexpress.in"
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-sky-400" />
              <span>mail@seemanchalexpress.in</span>
            </a>

            {/* Google Language Translation Feature */}
            <div className="ml-2 pl-2 border-l border-slate-700">
              <GoogleTranslate />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-0 flex justify-between items-center gap-4">
        {/* Brand Logo - Full Fill, No Margin, No Padding, No Border, No Name */}
        <Link href="/" className="flex items-center p-0 m-0 shrink-0">
          <img
            src="/logo.jpeg"
            alt="Seemanchal Express"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain block p-0 m-0 border-0 rounded-none shadow-none"
          />
        </Link>

        {/* Search bar & Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search news & stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3.5 pr-9 py-1.5 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-300 rounded-full w-52 focus:w-64 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Member / Reporter Apply CTAs */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                href="/apply-member"
                className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                Join Member
              </Link>
              <Link
                href="/apply-reporter"
                className="text-xs font-semibold px-3 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Apply Reporter
              </Link>
            </div>
          )}

          {/* User Profile / Dashboard Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardLink()}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                {user.role === 'admin'
                  ? 'Admin Panel'
                  : user.role === 'reporter'
                    ? 'Reporter Panel'
                    : 'Member Panel'}
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center gap-1"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-red-600"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 3. Primary Navigation Bar */}
      <nav className="bg-red-700 text-white font-medium text-sm hidden lg:block shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <ul className="flex items-center flex-wrap gap-0.5">
            <li>
              <Link
                href="/"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors font-semibold"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/category/seemanchal-special"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors bg-red-800 font-bold text-amber-200"
              >
                Seemanchal Special
              </Link>
            </li>
            <li>
              <Link
                href="/category/bihar"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                Bihar State
              </Link>
            </li>
            <li>
              <Link
                href="/category/national"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                National
              </Link>
            </li>
            <li>
              <Link
                href="/category/politics"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                Politics
              </Link>
            </li>
            <li>
              <Link
                href="/category/crime"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                Crime
              </Link>
            </li>
            <li>
              <Link
                href="/category/education"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                Education
              </Link>
            </li>
            <li>
              <Link
                href="/category/sports"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                Sports
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors bg-amber-500 text-slate-900 font-bold"
              >
                Executive Team
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="px-3.5 py-2.5 inline-block hover:bg-red-800 transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>

          <div className="flex items-center text-xs gap-3">
            <Link
              href="/verify"
              className="px-2.5 py-1 rounded bg-red-900 hover:bg-black text-amber-300 font-medium transition-colors"
            >
              Verify Digital ID
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Breaking News Ticker (Live Scrolling Bar) */}
      <div className="bg-amber-400 border-b border-amber-500 text-slate-900 text-xs font-semibold flex items-center overflow-hidden">
        <div className="bg-red-600 text-white px-3 py-1.5 flex items-center gap-1.5 shrink-0 z-10 font-bold shadow-md uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>Breaking News</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full py-1.5">
          <div className="inline-block animate-ticker">
            {breakingNews.length > 0 ? (
              [...breakingNews, ...breakingNews].map((item, idx) => (
                <Link
                  key={idx}
                  href={`/news/${item.slug}`}
                  className="mx-6 hover:text-red-700 transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>
                  <span>{item.title}</span>
                </Link>
              ))
            ) : (
              <span className="mx-6 text-slate-800">
                Seemanchal Express — Voice of the People | Dedicated to fearless and credible journalism across India.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white px-4 py-6 border-b border-slate-800">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded text-white"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-2 font-medium text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Home
            </Link>
            <Link
              href="/category/seemanchal-special"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 text-amber-300 font-bold"
            >
              Seemanchal Special
            </Link>
            <Link
              href="/category/bihar"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Bihar State
            </Link>
            <Link
              href="/category/national"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              National
            </Link>
            <Link
              href="/category/politics"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Politics
            </Link>
            <Link
              href="/category/crime"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Crime
            </Link>
            <Link
              href="/category/education"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Education
            </Link>
            <Link
              href="/category/sports"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Sports
            </Link>
            <Link
              href="/team"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 text-amber-400 font-bold"
            >
              Executive Team
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 hover:text-red-400"
            >
              Contact Us
            </Link>
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-800 text-sky-400"
            >
              Verify Digital ID Card
            </Link>

            <div className="pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-red-600 rounded text-white font-bold"
                  >
                    Dashboard ({user.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 bg-slate-800 rounded text-slate-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-red-600 rounded text-white font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/apply-member"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-blue-600 rounded text-white font-medium"
                  >
                    Join as Member
                  </Link>
                  <Link
                    href="/apply-reporter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-amber-600 rounded text-white font-medium"
                  >
                    Apply as Reporter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

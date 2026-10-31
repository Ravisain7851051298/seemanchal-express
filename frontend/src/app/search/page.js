'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Eye, Sparkles, TrendingUp, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [similarNews, setSimilarNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const quickTopics = [
    'सीमांचल', 'Kishanganj', 'Purnea', 'Katihar', 'Araria',
    'Politics', 'Education', 'Crime', 'Development', 'Flood'
  ];

  const performSearch = async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/news?search=${encodeURIComponent(term.trim())}`);
      if (res.data.success) {
        setResults(res.data.news || []);
        setSimilarNews(res.data.similarNews || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleQuickTopicClick = (topic) => {
    setSearchTerm(topic);
    performSearch(topic);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Search Input Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <Search className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900">Search News & Verified Ground Reports</h1>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Search across headlines, regional ground coverage, categories, authors, and keywords.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by keywords, place, topic (e.g. Purnea, Kishanganj, Education, Flood)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-900 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick topic tags */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Topics:</span>
            {quickTopics.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickTopicClick(topic)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg transition-colors font-medium border border-slate-200"
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-700">Searching records & matching keywords...</p>
            <p className="text-xs text-slate-400 mt-1">Checking headlines, location archives and reporter reports</p>
          </div>
        ) : hasSearched && results.length > 0 ? (
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-5 pb-2 border-b border-slate-200">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Results for &ldquo;{searchTerm}&rdquo;</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {results.length} Stories
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item, idx) => (
                  <article
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                  >
                    <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={item.thumbnail || '/uploads/default-news.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        {item.location || 'Seemanchal'}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-[11px] font-bold text-red-600 uppercase mb-1">
                        {item.categoryName || item.category?.name || 'News'}
                      </span>
                      <Link href={`/news/${item.slug}`} className="flex-grow">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                          {item.subtitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {item.views || 0}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Similar / Related News Section */}
            {similarNews.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Similar & Related Stories (सम्बंधित और अनुशंसित खबरें)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Discover more related coverage</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {similarNews.map((item, idx) => (
                    <article
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-red-400 transition-all flex flex-col group"
                    >
                      <div className="h-40 w-full bg-slate-100 overflow-hidden relative">
                        <img
                          src={item.thumbnail || '/uploads/default-news.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                          {item.location || 'Seemanchal'}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <span className="text-[10px] font-bold text-amber-700 uppercase mb-1">
                          {item.categoryName || item.category?.name || 'Related'}
                        </span>
                        <Link href={`/news/${item.slug}`} className="flex-grow">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                          <span>
                            {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-red-600 font-semibold flex items-center gap-0.5">
                            Read Story <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="space-y-10">
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No direct matches found for &ldquo;{searchTerm}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                We couldn&apos;t find an exact article matching this phrase. Explore our recommended & similar news below:
              </p>
            </div>

            {/* Similar / Recommended News Fallback */}
            {similarNews.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="p-1 rounded-md bg-red-100 text-red-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Recommended News For You (अनुशंसित प्रमुख समाचार)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {similarNews.map((item, idx) => (
                    <article
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-red-400 transition-all flex flex-col group"
                    >
                      <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                        <img
                          src={item.thumbnail || '/uploads/default-news.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                          {item.location || 'Seemanchal'}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <span className="text-[11px] font-bold text-red-600 uppercase mb-1">
                          {item.categoryName || item.category?.name || 'News'}
                        </span>
                        <Link href={`/news/${item.slug}`} className="flex-grow">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                          <span>
                            {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-red-600 font-semibold flex items-center gap-0.5">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">Enter a keyword or click any quick topic above to search.</p>
            <p className="text-xs text-slate-400 mt-1">Explore real-time journalism, state headlines, and ground investigation reports.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading Search Desk...</div>}>
      <SearchContent />
    </Suspense>
  );
}

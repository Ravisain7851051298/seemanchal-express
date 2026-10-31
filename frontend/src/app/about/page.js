'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  Shield,
  Target,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-red-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-md border-b-4 border-red-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-800">
              About Organization
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 mb-4">
              Seemanchal Express (सीमांचल एक्सप्रेस)
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              &ldquo;Voice of the People | सच की निर्भीक आवाज&rdquo; — A pioneering digital news publication and grassroots organization committed to public integrity, social justice, and fearless independent journalism across Seemanchal and India.
            </p>
          </div>
          <img
            src="/logo.jpeg"
            alt="Seemanchal Express Logo"
            className="w-24 h-24 object-contain rounded-2xl bg-white p-2 border-2 border-red-500 shadow-xl shrink-0"
          />
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To bring the pressing challenges of Seemanchal (Kishanganj, Araria, Purnea, and Katihar) — including flood control, quality education, healthcare infrastructure, and rural economic empowerment — to the forefront of national policy, driving positive democratic change.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Core Principles</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Truth, impartiality, fearless reporting without political bias, amplifying the voices of marginalized communities, and safeguarding constitutional and democratic values represent the unwavering pillars of Seemanchal Express.
            </p>
          </div>
        </div>

        {/* Structure Overview */}
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-4 border-l-4 border-red-600 pl-3">
            Organizational Architecture
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Seemanchal Express operates on a structured, democratic six-tier institutional hierarchy:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">A. National Executive</strong>
              <p className="text-slate-500">Apex National Leadership, Advisory Board & Policy Committee</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">B. State Executive</strong>
              <p className="text-slate-500">State Leadership & Bihar Provincial Committee Coordination</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">C. District Executive</strong>
              <p className="text-slate-500">District Committees across Kishanganj, Purnea, Araria, Katihar</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">D. Block / Taluka Committee</strong>
              <p className="text-slate-500">Sub-divisional and Block Level Field Coordination</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">E. Gram Panchayat Committee</strong>
              <p className="text-slate-500">Village Coordinators, Education & Healthcare Promoters</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">F. Ward Committee</strong>
              <p className="text-slate-500">Urban Ward Representatives, Youth Mobilizers & Volunteers</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/team"
              className="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
            >
              Explore Full Leadership Directory
            </Link>
          </div>
        </div>

        {/* Official Address Card */}
        <div className="bg-slate-900 text-white rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-white">Central Secretariat & Contact Office</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <strong className="text-white block mb-1">Headquarters Address:</strong>
                F 65, Shaheen Bagh, Okhla,<br />
                New Delhi-110025, India
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block mb-1">Phone Helpline:</strong>
                <a href="tel:9871023184" className="hover:text-white">+91 9871023184</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <strong className="text-white block mb-1">Email Contact:</strong>
                <a href="mailto:mail@seemanchalexpress.in" className="hover:text-white">mail@seemanchalexpress.in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

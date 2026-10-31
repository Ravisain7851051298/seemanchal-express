'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  FileCheck,
  Users,
  Award,
  Globe,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-6 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Mission */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpeg"
                alt="Seemanchal Express"
                className="w-11 h-11 object-contain rounded-lg border border-slate-700 bg-white p-0.5 shadow-md"
              />
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  SEEMANCHAL <span className="text-red-500">EXPRESS</span>
                </span>
                <p className="text-xs text-slate-400">Digital News & Community Network</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Empowering Seemanchal (Kishanganj, Araria, Purnea, Katihar) and all of India with true, unbiased, and fearless reporting. Dedicated to public welfare, rural growth, and transparent governance.
            </p>
            <div className="text-xs text-amber-400 font-semibold mb-3">
              Voice of the People | Fearless Journalism
            </div>
          </div>

          {/* Column 2: Committees & Coverage */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              Organizational Committees
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  A. National Executive Committee
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  B. State Executive Committee (Bihar)
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  C. District Executive Committee
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  D. Block / Taluka Committee
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  E. Gram Panchayat Committee
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  F. Ward Committee
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors text-amber-400">
                  Field Correspondents & Press Bureau
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Verification */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              Portals & Verification
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/apply-member"
                  className="flex items-center gap-1.5 hover:text-white text-slate-300"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Membership Application Form
                </Link>
              </li>
              <li>
                <Link
                  href="/apply-reporter"
                  className="flex items-center gap-1.5 hover:text-white text-slate-300"
                >
                  <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                  Press Reporter Application
                </Link>
              </li>
              <li>
                <Link
                  href="/verify"
                  className="flex items-center gap-1.5 hover:text-white text-amber-300 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Digital ID Card Online Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:text-white text-slate-300"
                >
                  <Award className="w-3.5 h-3.5 text-red-400" />
                  Member / Reporter Portal Login
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:text-white text-slate-400"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Central Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Central Office & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              Headquarters & Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Headquarters Address:</strong>
                  <br />
                  F 65, Shaheen Bagh, Okhla,
                  <br />
                  New Delhi-110025, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:9871023184" className="hover:text-white font-medium">
                  +91 9871023184
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:mail@seemanchalexpress.in" className="hover:text-white font-medium">
                  mail@seemanchalexpress.in
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>https://seemanchalexpress.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Seemanchal Express. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400">
              Editorial Guidelines
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-400">
              Grievance Redressal
            </Link>
            <span>•</span>
            <Link href="/verify" className="hover:text-slate-400">
              ID Card Verification
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

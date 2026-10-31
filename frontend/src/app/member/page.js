'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  MapPin,
  LogOut,
  Edit,
  Save,
  Lock,
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Camera,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../lib/api';
import getMediaUrl from '../../lib/imageHelper';
import MarkdownView from '../../components/common/MarkdownView';
import DigitalIdCard from '../../components/documents/DigitalIdCard';
import AppointmentLetter from '../../components/documents/AppointmentLetter';

export default function MemberDashboard() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'id-card', 'appointment-letter', 'committee', 'security'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [idCardData, setIdCardData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [fetchingDocs, setFetchingDocs] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [previewBioMarkdown, setPreviewBioMarkdown] = useState(false);

  // Profile Edit State
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    bio: '',
    photo: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Password Change State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchDocs = async () => {
    if (!user) return;
    setFetchingDocs(true);
    try {
      const [cardRes, apptRes] = await Promise.allSettled([
        api.get(`/documents/id-card/${user.id || user._id}`),
        api.get(`/documents/appointment-letter/${user.id || user._id}`),
      ]);

      if (cardRes.status === 'fulfilled' && cardRes.value.data.success) {
        setIdCardData(cardRes.value.data.cardData);
      }
      if (apptRes.status === 'fulfilled' && apptRes.value.data.success) {
        setAppointmentData(apptRes.value.data.appointmentData);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setFetchingDocs(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        photo: user.photo || '',
      });

      if (user.status === 'approved') {
        fetchDocs();
      }
    }
  }, [user]);

  // Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put('/auth/profile', editForm);
      if (res.data.success) {
        alert('Profile details updated successfully');
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  // Upload & update profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);

    setUploadingPhoto(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const uploadRes = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (uploadRes.data.success) {
        const uploadedUrl = uploadRes.data.fileUrl;
        setEditForm((prev) => ({ ...prev, photo: uploadedUrl }));
        // Persist photo directly in database & update Redux auth state
        const profileRes = await api.put('/auth/profile', { photo: uploadedUrl });
        if (profileRes.data.success && refreshUser) {
          refreshUser();
        }
      }
    } catch (err) {
      console.error('Member photo upload error:', err);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (res.data.success) {
        setPasswordMsg({ text: 'Password successfully updated!', type: 'success' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMsg({
        text: err.response?.data?.message || 'Failed to update password. Verify current password.',
        type: 'error',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isApproved = user.status === 'approved';
  const isPending = user.status === 'pending';
  const isRejected = user.status === 'rejected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* 1. Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center p-0 m-0">
          <img
            src="/logo.jpeg"
            alt="Seemanchal Express"
            className="h-10 sm:h-12 w-auto object-contain rounded bg-white p-0.5 block shadow-sm"
          />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5`}
      >
        <div>
          {/* Brand Logo - Big Logo, No Name */}
          <div className="pb-5 border-b border-slate-800 mb-6">
            <Link href="/" className="block p-0 m-0">
              <img
                src="/logo.jpeg"
                alt="Seemanchal Express"
                className="w-full h-auto max-h-20 object-contain rounded-lg bg-white p-1 block shadow-sm hover:opacity-95 transition-opacity"
              />
            </Link>
          </div>

          {/* Member Profile Badge */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-700 border-2 border-red-500 shrink-0">
                <img
                  src={getMediaUrl(user.photo)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs font-bold text-white truncate">{user.name}</h3>
                <span className="text-[11px] text-red-400 font-semibold block truncate">
                  {user.assignedDesignation || 'Executive Member'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {user.idCardNumber || 'Verification Pending'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-700/60 text-slate-400">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                <span className="truncate">{user.assignedLocation || 'Bihar'}</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                  isApproved
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : isPending
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-red-600 text-white shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Membership Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('id-card');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'id-card'
                  ? 'bg-red-600 text-white shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital ID Card</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('appointment-letter');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'appointment-letter'
                  ? 'bg-red-600 text-white shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Appointment Letter</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('committee');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'committee'
                  ? 'bg-red-600 text-white shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Committee Hierarchy</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('security');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-red-600 text-white shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Profile & Security</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>Public News Portal</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest block mb-1">
              Member Executive Portal
            </span>
            <h2 className="text-2xl font-black text-white">
              {activeTab === 'overview' && 'Membership Status & Credentials'}
              {activeTab === 'id-card' && 'Official Digital Identity Card'}
              {activeTab === 'appointment-letter' && 'Official Executive Appointment Letter'}
              {activeTab === 'committee' && 'Assigned Committee Structure'}
              {activeTab === 'security' && 'Member Profile & Security Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${
                isApproved
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : isPending
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
              {isPending && <Clock className="w-3.5 h-3.5" />}
              {isRejected && <AlertCircle className="w-3.5 h-3.5" />}
              {user.status === 'approved' ? 'Verified Member' : user.status}
            </span>
            <button
              onClick={fetchDocs}
              title="Refresh"
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Alert if not approved */}
            {isPending && (
              <div className="p-4 bg-amber-950/60 border border-amber-800 rounded-2xl flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    Application Under Administrative Review
                  </h4>
                  <p className="text-xs text-amber-200/80 mt-1">
                    Your membership application is being reviewed by the central leadership committee.
                    Once approved, your assigned committee level, designation, digital ID card, and appointment letter will be active.
                  </p>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-300">
                    Membership Application Not Approved
                  </h4>
                  <p className="text-xs text-red-200/80 mt-1">
                    {user.rejectionReason || 'Your application could not be verified at this time.'}
                  </p>
                </div>
              </div>
            )}

            {/* 3 Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-slate-400 block mb-1">Committee Tier</span>
                <strong className="text-xl font-black text-white">
                  {user.committeeLevel ? `${user.committeeLevel} Level` : 'General Member'}
                </strong>
                <span className="text-[10px] text-red-400 block mt-1">
                  {user.assignedDesignation || 'Member'}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-slate-400 block mb-1">Assigned Area</span>
                <strong className="text-xl font-black text-white truncate block">
                  {user.assignedLocation || 'National HQ, New Delhi'}
                </strong>
                <span className="text-[10px] text-slate-400 block mt-1">Jurisdiction Beat</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400">ID Card Number</span>
                  {user.idCardNumber && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(user.idCardNumber);
                        setCopiedId(true);
                        setTimeout(() => setCopiedId(false), 2000);
                      }}
                      className="text-[10px] text-amber-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                      title="Copy ID Card Number"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
                <strong className="text-xl font-black text-amber-400 font-mono">
                  {user.idCardNumber || 'Pending'}
                </strong>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  {isApproved ? 'Verified & Active' : 'Awaiting Approval'}
                </span>
              </div>
            </div>

            {/* Member Profile Bio with Markdown */}
            {user.bio && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-red-500" /> Member Profile Statement / Bio
                </h3>
                <div className="text-slate-200 text-xs sm:text-sm">
                  <MarkdownView content={user.bio} isDark={true} />
                </div>
              </div>
            )}

            {/* Quick Actions to View ID and Letter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Executive Digital ID Card</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your official digital ID card with scannable QR verification code, committee level, and organization seal.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('id-card')}
                  disabled={!isApproved}
                  className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs rounded-xl self-start transition-all"
                >
                  {isApproved ? 'Inspect & Print ID Card →' : 'Available After Approval'}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-500 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Formal Appointment Letter</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Official authorization document issued by the central administration appointing you to your office.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('appointment-letter')}
                  disabled={!isApproved}
                  className="mt-6 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl self-start transition-all"
                >
                  {isApproved ? 'Inspect & Print Letter →' : 'Available After Approval'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL ID CARD */}
        {activeTab === 'id-card' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
              <h3 className="text-lg font-black text-white">Official Executive ID Card</h3>
              <p className="text-xs text-slate-400 mt-1">
                Authorized identity credential for Seemanchal Express leadership. Scan QR to verify live online.
              </p>
            </div>

            {isApproved ? (
              <div className="w-full flex justify-center">
                <DigitalIdCard cardData={idCardData || user} />
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Digital ID Card will be generated as soon as your application is approved by the admin.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPOINTMENT LETTER */}
        {activeTab === 'appointment-letter' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
              <h3 className="text-lg font-black text-white">Official Appointment Letter</h3>
              <p className="text-xs text-slate-400 mt-1">
                Executive appointment decree signed by the National Leadership Committee.
              </p>
            </div>

            {isApproved ? (
              <div className="w-full flex justify-center">
                <AppointmentLetter appointmentData={appointmentData || user} />
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Official Appointment Letter will be issued upon approval.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMMITTEE STRUCTURE */}
        {activeTab === 'committee' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">Organizational Hierarchy & Tier System</h3>
              <p className="text-xs text-slate-400 mt-1">
                Seemanchal Express operates across 6 decentralized executive committee tiers from the National capital down to Ward units.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                {
                  id: 'National',
                  title: 'A. National Executive Committee',
                  desc: 'Apex policy and strategic decision-making council headquartered in New Delhi. Oversees national representation and press governance.',
                },
                {
                  id: 'State',
                  title: 'B. State Executive Committee (Bihar)',
                  desc: 'State leadership council coordinating inter-district affairs, government liaisons, and regional welfare.',
                },
                {
                  id: 'District',
                  title: 'C. District Executive Committee',
                  desc: 'Active in Kishanganj, Purnea, Katihar, and Araria. Oversees block coordinators and ground public representation.',
                },
                {
                  id: 'Block',
                  title: 'D. Block / Taluka Committee',
                  desc: 'Connects village clusters and blocks with sub-divisional administrative desks and grievance redressing.',
                },
                {
                  id: 'Panchayat',
                  title: 'E. Gram Panchayat Committee',
                  desc: 'Village-level empowerment bodies advocating for rural welfare, flood defense, health, and primary education.',
                },
                {
                  id: 'Ward',
                  title: 'F. Ward Committee',
                  desc: 'Hyper-local grassroots mobilization engaging residents, volunteers, and citizen journalists directly.',
                },
              ].map((tier) => {
                const isMyTier = user.committeeLevel === tier.id;
                return (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-xl border transition-all relative ${
                      isMyTier
                        ? 'bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-500/50'
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  >
                    {isMyTier && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white uppercase tracking-wider">
                        Your Assigned Tier
                      </span>
                    )}
                    <strong className="text-amber-400 block text-sm mb-1">{tier.title}</strong>
                    <p className="text-slate-300 leading-relaxed">{tier.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE & SECURITY */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Left: Profile Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">
                Member Profile Information
              </h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                {/* Profile Picture Card with Upload */}
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70">
                  <label className="block font-bold text-slate-300 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-red-500 shrink-0 bg-slate-900 shadow-sm">
                      <img
                        src={getMediaUrl(editForm.photo || user.photo)}
                        alt={editForm.name || user.name}
                        className="w-full h-full object-cover"
                      />
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Upload your recent photo. Max size 10MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-300">
                      Bio / Statement <span className="text-[10px] text-amber-400 font-normal">(Markdown Supported)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewBioMarkdown(!previewBioMarkdown)}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {previewBioMarkdown ? 'Edit Bio' : 'Preview Bio'}
                    </button>
                  </div>

                  {previewBioMarkdown ? (
                    <div className="w-full min-h-[100px] p-3 bg-slate-950 border border-slate-700 rounded-lg text-white">
                      {editForm.bio ? (
                        <MarkdownView content={editForm.bio} isDark={true} />
                      ) : (
                        <span className="text-slate-500 italic text-xs">No bio entered yet.</span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Short bio regarding your community engagement (Markdown formatted with **bold**, - bullet points, etc.)..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                >
                  {profileLoading ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>

            {/* Right: Change Password */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">
                Change Password
              </h3>

              {passwordMsg.text && (
                <div
                  className={`p-3 rounded-lg text-xs font-bold mb-4 ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                >
                  {passwordLoading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

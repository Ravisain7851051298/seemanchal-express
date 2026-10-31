'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Newspaper,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Eye,
  MapPin,
  LogOut,
  Send,
  Video,
  Image as ImageIcon,
  ExternalLink,
  Shield,
  User,
  Lock,
  RotateCcw,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Printer,
  Search,
  Filter,
  Camera,
  Edit3,
  Trash2,
  Upload,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import {
  setMySubmissions,
  addSubmission,
  updateSubmission,
  removeSubmission,
  setReporterLoading,
} from '../../store/slices/reporterSlice';
import api from '../../lib/api';
import getMediaUrl from '../../lib/imageHelper';
import MarkdownView from '../../components/common/MarkdownView';
import DigitalIdCard from '../../components/documents/DigitalIdCard';
import AppointmentLetter from '../../components/documents/AppointmentLetter';

export default function ReporterDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading: authLoading, logout, refreshUser } = useAuth();
  const { mySubmissions, loading: submissionsLoading } = useSelector((state) => state.reporter);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'submit', 'my-reports', 'press-card', 'appointment-letter', 'account-security'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Documents state
  const [idCardData, setIdCardData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [fetchingDocs, setFetchingDocs] = useState(false);

  // New Story Form State
  const [newsForm, setNewsForm] = useState({
    title: '',
    subtitle: '',
    category: '',
    location: '',
    content: '',
    thumbnail: '',
    videoUrl: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMarkdown, setPreviewMarkdown] = useState(false);

  // Edit Report Modal State (for pending/rejected stories)
  const [editingReport, setEditingReport] = useState(null);
  const [editReportForm, setEditReportForm] = useState({
    title: '',
    subtitle: '',
    category: '',
    location: '',
    content: '',
    thumbnail: '',
    videoUrl: '',
    tags: '',
  });
  const [editReportSubmitting, setEditReportSubmitting] = useState(false);
  const [editPreviewMarkdown, setEditPreviewMarkdown] = useState(false);

  // Filter & Search on My Reports
  const [reportsFilter, setReportsFilter] = useState('all'); // 'all', 'published', 'pending', 'rejected'
  const [reportsSearch, setReportsSearch] = useState('');
  const [selectedReportModal, setSelectedReportModal] = useState(null);

  // Password Change Form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    photo: '',
    bio: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Access control
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (user?.role !== 'reporter' && user?.role !== 'admin'))) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, user, router]);

  // Load initial data
  const loadReporterData = async () => {
    if (!user) return;
    dispatch(setReporterLoading(true));

    try {
      const [subRes, catRes] = await Promise.allSettled([
        api.get('/news/reporter/my-submissions'),
        api.get('/categories'),
      ]);

      if (subRes.status === 'fulfilled' && subRes.value.data.success) {
        dispatch(setMySubmissions(subRes.value.data.news));
      }
      if (catRes.status === 'fulfilled' && catRes.value.data.success) {
        setCategories(catRes.value.data.categories);
        if (catRes.value.data.categories.length > 0) {
          setNewsForm((prev) => ({
            ...prev,
            category: prev.category || catRes.value.data.categories[0]._id,
          }));
        }
      }
    } catch (err) {
      console.error('Reporter data load error:', err);
    } finally {
      dispatch(setReporterLoading(false));
    }
  };

  useEffect(() => {
    if (user && (user.role === 'reporter' || user.role === 'admin')) {
      loadReporterData();
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        photo: user.photo || '',
        bio: user.bio || '',
      });
      setNewsForm((prev) => ({
        ...prev,
        location: user.assignedLocation || 'Kishanganj, Bihar',
      }));
    }
  }, [user]);

  // Load credentials documents
  const fetchDocuments = async () => {
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
    } catch (e) {
      console.error('Doc load error:', e);
    } finally {
      setFetchingDocs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'press-card' || activeTab === 'appointment-letter') {
      if (!idCardData || !appointmentData) {
        fetchDocuments();
      }
    }
  }, [activeTab]);

  // Submit news story
  const handleSubmitNews = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitSuccess(false);

    if (!newsForm.title.trim()) {
      setFormError('Please enter a headline for the report.');
      return;
    }
    if (!newsForm.content.trim()) {
      setFormError('Please enter the report body content.');
      return;
    }
    if (!newsForm.category) {
      setFormError('Please select a news category.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: newsForm.title.trim(),
        subtitle: newsForm.subtitle.trim(),
        category: newsForm.category,
        location: newsForm.location.trim() || user?.assignedLocation || 'Seemanchal',
        content: newsForm.content.trim(),
        thumbnail:
          newsForm.thumbnail.trim() ||
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
        videoUrl: newsForm.videoUrl.trim(),
        tags: newsForm.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await api.post('/news', payload);
      if (res.data.success) {
        dispatch(addSubmission(res.data.news));
        setSubmitSuccess(true);
        setNewsForm({
          title: '',
          subtitle: '',
          category: categories[0]?._id || '',
          location: user?.assignedLocation || 'Kishanganj, Bihar',
          content: '',
          thumbnail: '',
          videoUrl: '',
          tags: '',
        });
        // Switch to my reports tab after 1.5s
        setTimeout(() => {
          setActiveTab('my-reports');
          setSubmitSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Upload image file for report thumbnail (creation or editing)
  const handleNewsImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        if (isEdit) {
          setEditReportForm((prev) => ({ ...prev, thumbnail: res.data.fileUrl }));
        } else {
          setNewsForm((prev) => ({ ...prev, thumbnail: res.data.fileUrl }));
        }
      }
    } catch (err) {
      alert('Photo upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  // Quick Markdown tag inserter
  const insertMarkdownTag = (tagType, isEdit = false) => {
    const setForm = isEdit ? setEditReportForm : setNewsForm;
    let snippet = '';
    if (tagType === 'bold') snippet = '**Bold Headline** ';
    if (tagType === 'italic') snippet = '*Italic Emphasis* ';
    if (tagType === 'heading') snippet = '\n\n### Dateline Section Heading\n';
    if (tagType === 'quote') snippet = '\n> "Official quote or eyewitness testimony..."\n';
    if (tagType === 'bullet') snippet = '\n- Key development point 1\n- Key development point 2\n';

    setForm((prev) => ({
      ...prev,
      content: (prev.content || '') + snippet,
    }));
  };

  // Submit edit of pending or rejected report
  const handleEditReportSubmit = async (e) => {
    e.preventDefault();
    if (!editingReport) return;
    setEditReportSubmitting(true);
    try {
      const payload = {
        title: editReportForm.title.trim(),
        subtitle: editReportForm.subtitle.trim(),
        category: editReportForm.category,
        location: editReportForm.location.trim() || user?.assignedLocation || 'Seemanchal',
        content: editReportForm.content.trim(),
        thumbnail: editReportForm.thumbnail.trim(),
        videoUrl: editReportForm.videoUrl.trim(),
        tags: editReportForm.tags
          ? editReportForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };
      const res = await api.put(`/news/${editingReport._id}`, payload);
      if (res.data.success) {
        dispatch(updateSubmission(res.data.news));
        alert('Report updated and resubmitted for editorial review!');
        setEditingReport(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report.');
    } finally {
      setEditReportSubmitting(false);
    }
  };

  // Delete pending or rejected report
  const handleDeleteReport = async (storyId) => {
    if (!confirm('Are you sure you want to delete this draft / report?')) return;
    try {
      const res = await api.delete(`/news/${storyId}`);
      if (res.data.success) {
        dispatch(removeSubmission(storyId));
        alert('Report deleted successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
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
      setPasswordMsg({ text: 'New password and confirmation do not match.', type: 'error' });
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
        text: err.response?.data?.message || 'Error updating password. Verify current password.',
        type: 'error',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put('/auth/profile', profileForm);
      if (res.data.success) {
        alert('Profile details updated successfully!');
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Upload & update reporter profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm((prev) => ({ ...prev, photo: reader.result }));
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
        setProfileForm((prev) => ({ ...prev, photo: uploadedUrl }));
        const profileRes = await api.put('/auth/profile', { photo: uploadedUrl });
        if (profileRes.data.success && refreshUser) {
          refreshUser();
        }
      }
    } catch (err) {
      console.error('Reporter photo upload error:', err);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Submissions stats
  const totalSubmissions = mySubmissions.length;
  const publishedCount = mySubmissions.filter((s) => s.status === 'published').length;
  const pendingCount = mySubmissions.filter((s) => s.status === 'pending').length;
  const totalViews = mySubmissions.reduce((acc, curr) => acc + (curr.views || 0), 0);

  // Filtered reports for My Reports tab
  const filteredReports = mySubmissions.filter((s) => {
    if (reportsFilter !== 'all' && s.status !== reportsFilter) return false;
    if (reportsSearch) {
      const q = reportsSearch.toLowerCase();
      const matchTitle = s.title?.toLowerCase().includes(q);
      const matchCat = s.categoryName?.toLowerCase().includes(q);
      const matchLoc = s.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchLoc) return false;
    }
    return true;
  });

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

      {/* 2. Reporter Sidebar */}
      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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

          {/* Reporter Profile Badge */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-700 border-2 border-amber-500 shrink-0">
                <img
                  src={getMediaUrl(user.photo)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs font-bold text-white truncate">{user.name}</h3>
                <span className="text-[11px] text-amber-400 font-medium block truncate">
                  {user.assignedDesignation || 'Accredited Reporter'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {user.idCardNumber || 'Press ID Pending'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-700/60 text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                {user.assignedLocation || 'Bihar'}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.status === 'approved'
                    ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/60'
                    : 'bg-amber-900/60 text-amber-400 border border-amber-700/60'
                  }`}
              >
                {user.status === 'approved' ? 'Accredited' : 'Pending'}
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('submit');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'submit'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit News Story</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('my-reports');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'my-reports'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4" />
                <span>My Reports & Stories</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'my-reports'
                    ? 'bg-slate-950 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                  }`}
              >
                {totalSubmissions}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('press-card');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'press-card'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital Press ID Card</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('appointment-letter');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'appointment-letter'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Appointment Letter</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('account-security');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'account-security'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
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
            <span>View Public News Site</span>
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

      {/* 3. Main Content View Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-8">
        {/* Top Header Inside Main Content */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block mb-1">
              Field Journalism Console
            </span>
            <h2 className="text-2xl font-black text-white">
              {activeTab === 'overview' && 'Bureau Overview & Activity'}
              {activeTab === 'submit' && 'Submit Field Report / News'}
              {activeTab === 'my-reports' && 'My Submitted Reports'}
              {activeTab === 'press-card' && 'Digital Press Accreditation Card'}
              {activeTab === 'appointment-letter' && 'Official Press Appointment Letter'}
              {activeTab === 'account-security' && 'Account Profile & Security'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('submit')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> File New Report
            </button>
            <button
              onClick={loadReporterData}
              title="Refresh"
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  Total Stories Filed
                </span>
                <strong className="text-3xl font-black text-white">{totalSubmissions}</strong>
                <span className="text-[10px] text-slate-400 block mt-2">All submitted drafts</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  Published Live
                </span>
                <strong className="text-3xl font-black text-emerald-400">{publishedCount}</strong>
                <span className="text-[10px] text-slate-400 block mt-2">Live on website</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  In Editorial Review
                </span>
                <strong className="text-3xl font-black text-amber-400">{pendingCount}</strong>
                <span className="text-[10px] text-slate-400 block mt-2">Awaiting desk approval</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-sky-400 block mb-1">Total Readers</span>
                <strong className="text-3xl font-black text-sky-400">{totalViews}</strong>
                <span className="text-[10px] text-slate-400 block mt-2">Total article reads</span>
              </div>
            </div>

            {/* Quick Submit Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-slate-950 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-white">Have a breaking ground story?</h3>
                <p className="text-xs text-amber-100 mt-1 max-w-xl">
                  Submit ground reports with photographs, video embeds, and local testimonials. Your
                  story will be vetted by the central desk and published live.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl shadow-lg transition-transform"
              >
                Start Writing Now →
              </button>
            </div>

            {/* Reporter Bio Dossier with Markdown */}
            {user.bio && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-500" /> Press Correspondent Bio & Beats
                </h3>
                <div className="text-slate-200 text-xs sm:text-sm">
                  <MarkdownView content={user.bio} isDark={true} />
                </div>
              </div>
            )}

            {/* Recent Submissions Snippet */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white">Recent Field Submissions</h3>
                <button
                  onClick={() => setActiveTab('my-reports')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  View All ({totalSubmissions}) →
                </button>
              </div>

              {mySubmissions.length > 0 ? (
                <div className="space-y-3">
                  {mySubmissions.slice(0, 4).map((story) => (
                    <div
                      key={story._id}
                      className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-slate-700 overflow-hidden shrink-0">
                          <img
                            src={story.thumbnail || '/uploads/default-news.jpg'}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                            {story.category?.name || 'News'}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {story.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(story.createdAt).toLocaleDateString('en-US')} • {story.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${story.status === 'published'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : story.status === 'pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                        >
                          {story.status === 'published'
                            ? 'Published Live'
                            : story.status === 'pending'
                              ? 'In Review'
                              : 'Declined'}
                        </span>
                        {story.status === 'published' && (
                          <Link
                            href={`/news/${story.slug}`}
                            target="_blank"
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  You haven&apos;t filed any stories yet. Click &ldquo;File New Report&rdquo; to begin.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUBMIT NEWS / FIELD REPORT */}
        {activeTab === 'submit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-black text-white">File News Report for Editorial Review</h3>
              <p className="text-xs text-slate-400 mt-1">
                Field reports are vetted by the central editorial desk and published on the homepage and respective categories.
              </p>
            </div>

            {submitSuccess && (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Report submitted successfully! Redirecting to your submissions...
              </div>
            )}

            {formError && (
              <div className="bg-red-950/80 border border-red-700 text-red-300 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitNews} className="space-y-5 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  Report Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="e.g. Major bridge construction milestone completed across Kishanganj highway..."
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  Subtitle / Summary Lead
                </label>
                <input
                  type="text"
                  value={newsForm.subtitle}
                  onChange={(e) => setNewsForm({ ...newsForm, subtitle: e.target.value })}
                  placeholder="A concise 1-2 sentence lead summarizing the core development..."
                  className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-200 mb-1.5">News Category *</label>
                  <select
                    required
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.nameHindi ? `(${c.nameHindi})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1.5">
                    Beat Dateline / Reporting Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newsForm.location}
                    onChange={(e) => setNewsForm({ ...newsForm, location: e.target.value })}
                    placeholder="e.g. Bahadurganj, Kishanganj, Bihar"
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Image & Video Links with Direct Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      Featured Photograph
                    </span>
                    <label className="cursor-pointer text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      <Upload className="w-3 h-3" />
                      {uploadingImage ? 'Uploading...' : 'Upload File'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleNewsImageUpload(e, false)}
                      />
                    </label>
                  </label>
                  <input
                    type="text"
                    value={newsForm.thumbnail}
                    onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })}
                    placeholder="Upload file above or paste image URL..."
                    className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                  {newsForm.thumbnail && (
                    <div className="mt-2 relative w-24 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                      <img
                        src={getMediaUrl(newsForm.thumbnail)}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-red-500" />
                    Video Clip / Broadcast Link (YouTube / MP4)
                  </label>
                  <input
                    type="text"
                    value={newsForm.videoUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or MP4 URL"
                    className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Body Content with Markdown Toolbar & Live Preview Toggle */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="font-bold text-slate-200 text-xs">
                    Detailed Report Content *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {/* Quick Markdown tags */}
                    <button
                      type="button"
                      onClick={() => insertMarkdownTag('heading', false)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      title="Insert Heading"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownTag('bold', false)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      title="Insert Bold Text"
                    >
                      **B**
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownTag('italic', false)}
                      className="px-2 py-0.5 text-[10px] font-italic bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      title="Insert Italic Text"
                    >
                      *I*
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownTag('quote', false)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      title="Insert Quote"
                    >
                      &gt; Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownTag('bullet', false)}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      title="Insert List"
                    >
                      - List
                    </button>

                    <div className="border-l border-slate-700 h-4 mx-1"></div>

                    {/* Preview Toggle */}
                    <button
                      type="button"
                      onClick={() => setPreviewMarkdown(!previewMarkdown)}
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded flex items-center gap-1 transition-colors ${
                        previewMarkdown
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      {previewMarkdown ? 'Editing Mode' : 'Live Preview'}
                    </button>
                  </div>
                </div>

                {previewMarkdown ? (
                  <div className="w-full min-h-[200px] p-4 bg-slate-950 border border-amber-500/40 rounded-xl text-white">
                    {newsForm.content ? (
                      <MarkdownView content={newsForm.content} isDark={true} />
                    ) : (
                      <span className="text-slate-500 italic text-xs">
                        Nothing to preview. Type report content in edit mode.
                      </span>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={8}
                    required
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    placeholder="Write the full report here (Markdown supported: # Headings, **bold**, - bullet points, > quotes). Include on-the-ground facts, statements by officials, public reactions, and background context..."
                    className="w-full px-3.5 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                  />
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  Tags / Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={newsForm.tags}
                  onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value })}
                  placeholder="Kishanganj, Infrastructure, Flood, Roadways, Bihar"
                  className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting to Desk...' : 'Dispatch Report for Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MY REPORTS & SUBMISSIONS */}
        {activeTab === 'my-reports' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
                  {['all', 'published', 'pending', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setReportsFilter(st)}
                      className={`px-3 py-1 rounded text-xs font-bold capitalize transition-colors ${reportsFilter === st
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      {st === 'all'
                        ? 'All'
                        : st === 'published'
                          ? 'Published'
                          : st === 'pending'
                            ? 'Under Review'
                            : 'Declined'}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={reportsSearch}
                    onChange={(e) => setReportsSearch(e.target.value)}
                    placeholder="Search by title, category, place..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 w-56 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Total Found: <strong>{filteredReports.length}</strong>
              </div>
            </div>

            {/* Reports list */}
            {filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map((story) => (
                  <div
                    key={story._id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:border-slate-700 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700 relative">
                        <img
                          src={story.thumbnail || '/uploads/default-news.jpg'}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        {story.videoUrl && (
                          <div className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full shadow">
                            <Video className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 uppercase border border-amber-800/60">
                            {story.category?.name || 'News'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" />
                            {story.location}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white line-clamp-1">{story.title}</h4>
                        {story.subtitle && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {story.subtitle}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                          <span>Filed: {new Date(story.createdAt).toLocaleDateString('en-US')}</span>
                          <span>•</span>
                          <span>Views: {story.views || 0}</span>
                        </div>

                        {/* If declined, show reason */}
                        {story.status === 'rejected' && story.rejectionReason && (
                          <div className="mt-2.5 p-2.5 rounded bg-red-950/80 border border-red-800 text-[11px] text-red-300">
                            <strong>Editor Feedback:</strong> {story.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => setSelectedReportModal(story)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-bold flex items-center gap-1 border border-slate-700 shadow-sm"
                        title="View Submission Details and Content"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" /> View Report
                      </button>

                      {/* If pending or rejected, allow Edit & Resubmit */}
                      {(story.status === 'pending' || story.status === 'rejected') && (
                        <button
                          onClick={() => {
                            setEditingReport(story);
                            setEditReportForm({
                              title: story.title || '',
                              subtitle: story.subtitle || '',
                              category: story.category?._id || story.category || '',
                              location: story.location || '',
                              content: story.content || '',
                              thumbnail: story.thumbnail || '',
                              videoUrl: story.videoUrl || '',
                              tags: Array.isArray(story.tags) ? story.tags.join(', ') : '',
                            });
                          }}
                          className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded text-xs font-bold flex items-center gap-1 border border-amber-800 shadow-sm"
                          title="Edit and Update Report"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}

                      {/* If pending or rejected, allow Delete */}
                      {(story.status === 'pending' || story.status === 'rejected') && (
                        <button
                          onClick={() => handleDeleteReport(story._id)}
                          className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 rounded text-xs font-bold flex items-center gap-1 border border-red-800 shadow-sm"
                          title="Delete draft/report"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}

                      <span
                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${story.status === 'published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : story.status === 'pending'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                      >
                        {story.status === 'published'
                          ? 'Published Live'
                          : story.status === 'pending'
                            ? 'In Review'
                            : 'Declined'}
                      </span>

                      {story.status === 'published' && (
                        <Link
                          href={`/news/${story.slug}`}
                          target="_blank"
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold flex items-center gap-1 border border-slate-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" /> View Live
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No reports matching the selected filter.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIGITAL PRESS ID CARD */}
        {activeTab === 'press-card' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
              <h3 className="text-lg font-black text-white">Press Accreditation Identity Card</h3>
              <p className="text-xs text-slate-400 mt-1">
                Official field press credential issued by Seemanchal Express Editorial Board with secure QR verification.
              </p>
            </div>

            {fetchingDocs ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-slate-400">Generating press credential...</p>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <DigitalIdCard cardData={idCardData || user} />
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENT LETTER */}
        {activeTab === 'appointment-letter' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
              <h3 className="text-lg font-black text-white">Official Press Appointment Letter</h3>
              <p className="text-xs text-slate-400 mt-1">
                Authorized letter of engagement confirming correspondent authorization across assigned beats.
              </p>
            </div>

            {fetchingDocs ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-slate-400">Loading appointment letter...</p>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <AppointmentLetter appointmentData={appointmentData || user} />
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ACCOUNT PROFILE & SECURITY */}
        {activeTab === 'account-security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Left: Profile Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">
                Reporter Profile Details
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                {/* Press Profile Photo Card with Upload */}
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/70">
                  <label className="block font-bold text-slate-300 mb-2">Press Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 shrink-0 bg-slate-900 shadow-sm">
                      <img
                        src={getMediaUrl(profileForm.photo || user.photo)}
                        alt={profileForm.name || user.name}
                        className="w-full h-full object-cover"
                      />
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm">
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
                        Format: JPG, PNG, WebP. Used for official Press ID card.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Reporter Bio <span className="text-[10px] text-amber-400 font-normal">(Markdown Supported)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Brief background on your reporting beats and field investigative work (Markdown supported with **bold**, - bullet points, etc.)..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs"
                >
                  {profileLoading ? 'Saving...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Right: Security & Password */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">
                Change Password & Security
              </h3>

              {passwordMsg.text && (
                <div
                  className={`p-3 rounded-lg text-xs font-bold mb-4 ${passwordMsg.type === 'success'
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

        {/* MODAL: Edit Report & Resubmit */}
        {editingReport && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 uppercase">
                    Edit & Resubmit
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    Edit Field Report: {editingReport.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update report details, body markdown, or photo. Resubmission will be placed into the editorial queue.
                  </p>
                </div>
                <button
                  onClick={() => setEditingReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editingReport.status === 'rejected' && editingReport.rejectionReason && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200">
                  <strong className="text-red-300 block mb-0.5">Editor Feedback to Address:</strong>
                  {editingReport.rejectionReason}
                </div>
              )}

              <form onSubmit={handleEditReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={editReportForm.title}
                    onChange={(e) => setEditReportForm({ ...editReportForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Subtitle / Summary Lead</label>
                  <input
                    type="text"
                    value={editReportForm.subtitle}
                    onChange={(e) => setEditReportForm({ ...editReportForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category *</label>
                    <select
                      required
                      value={editReportForm.category}
                      onChange={(e) => setEditReportForm({ ...editReportForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} {c.nameHindi ? `(${c.nameHindi})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Dateline / Location *</label>
                    <input
                      type="text"
                      required
                      value={editReportForm.location}
                      onChange={(e) => setEditReportForm({ ...editReportForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Featured Photograph</span>
                      <label className="cursor-pointer text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        <Upload className="w-3 h-3" />
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleNewsImageUpload(e, true)}
                        />
                      </label>
                    </label>
                    <input
                      type="text"
                      value={editReportForm.thumbnail}
                      onChange={(e) => setEditReportForm({ ...editReportForm, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                    />
                    {editReportForm.thumbnail && (
                      <div className="mt-2 relative w-20 h-14 rounded overflow-hidden border border-slate-700 bg-slate-800">
                        <img
                          src={getMediaUrl(editReportForm.thumbnail)}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Video Clip URL (YouTube / MP4)</label>
                    <input
                      type="text"
                      value={editReportForm.videoUrl}
                      onChange={(e) => setEditReportForm({ ...editReportForm, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <label className="font-bold text-slate-300">Detailed Report Body *</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertMarkdownTag('heading', true)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownTag('bold', true)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      >
                        **B**
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownTag('quote', true)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      >
                        &gt; Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownTag('bullet', true)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      >
                        - List
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditPreviewMarkdown(!editPreviewMarkdown)}
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${
                          editPreviewMarkdown
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        {editPreviewMarkdown ? 'Editing' : 'Preview'}
                      </button>
                    </div>
                  </div>

                  {editPreviewMarkdown ? (
                    <div className="w-full min-h-[160px] p-4 bg-slate-950 border border-amber-500/40 rounded-xl text-white">
                      {editReportForm.content ? (
                        <MarkdownView content={editReportForm.content} isDark={true} />
                      ) : (
                        <span className="text-slate-500 italic text-xs">No body content</span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      required
                      value={editReportForm.content}
                      onChange={(e) => setEditReportForm({ ...editReportForm, content: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sans leading-relaxed"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editReportForm.tags}
                    onChange={(e) => setEditReportForm({ ...editReportForm, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingReport(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editReportSubmitting}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {editReportSubmitting ? 'Updating...' : 'Save & Resubmit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Reporter View Own Submission Details with Markdown */}
        {selectedReportModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider bg-amber-500 text-slate-950">
                      {selectedReportModal.category?.name || 'News Story'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${selectedReportModal.status === 'published'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : selectedReportModal.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                    >
                      {selectedReportModal.status === 'published' ? 'Published Live' : selectedReportModal.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {selectedReportModal.title}
                  </h3>
                  {selectedReportModal.subtitle && (
                    <p className="text-xs text-slate-400 mt-1 italic border-l-2 border-amber-500 pl-2">
                      {selectedReportModal.subtitle}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedReportModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner / Feedback */}
              {selectedReportModal.status === 'rejected' && selectedReportModal.rejectionReason && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200">
                  <strong className="text-red-300 block mb-1">Editorial Desk Feedback:</strong>
                  {selectedReportModal.rejectionReason}
                </div>
              )}

              {/* Media Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {selectedReportModal.thumbnail && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                    <img
                      src={getMediaUrl(selectedReportModal.thumbnail)}
                      alt={selectedReportModal.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                {selectedReportModal.videoUrl ? (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
                    <video
                      src={selectedReportModal.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                    <Video className="w-8 h-8 text-slate-600 mb-1" />
                    <span>No Video Attached</span>
                  </div>
                )}
              </div>

              {/* Detailed Report Content (Markdown) */}
              <div className="mb-6 p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-700">
                  Detailed Report Content (Markdown Formatted)
                </h4>
                <div className="text-slate-200 text-xs sm:text-sm">
                  <MarkdownView content={selectedReportModal.content} isDark={true} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">
                  Dateline: {selectedReportModal.location} • Views: {selectedReportModal.views || 0}
                </span>
                <button
                  onClick={() => setSelectedReportModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

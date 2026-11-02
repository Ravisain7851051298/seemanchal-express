'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  History,
  Users,
  Search,
  Filter,
  X,
  Scale,
  ExternalLink,
  AlertCircle,
  Archive,
} from 'lucide-react';
import api from '../../lib/api';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'editorial', label: 'Editorial & Reporting' },
  { value: 'compliance', label: 'Legal & Compliance' },
  { value: 'agreements', label: 'Agreements & Terms' },
  { value: 'conduct', label: 'Codes of Conduct' },
  { value: 'commercial', label: 'Commercial & Ads' },
  { value: 'general', label: 'General Policies' },
];

export default function LegalDocumentsSection() {
  const [documents, setDocuments] = useState([]);
  const [counts, setCounts] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewingVersionsDoc, setViewingVersionsDoc] = useState(null);
  const [versionsList, setVersionsList] = useState([]);
  const [viewingAcceptancesDoc, setViewingAcceptancesDoc] = useState(null);
  const [acceptancesList, setAcceptancesList] = useState([]);

  // Form State
  const [docForm, setDocForm] = useState({
    title: '',
    slug: '',
    category: 'compliance',
    summary: '',
    content: '',
    status: 'published',
    effectiveDate: new Date().toISOString().split('T')[0],
    isMandatoryFor: [],
    changeSummary: '',
    isMaterialUpdate: false,
  });
  const [previewContent, setPreviewContent] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter, categoryFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/legal/admin/all?${params.toString()}`);
      if (res.data.success) {
        setDocuments(res.data.documents || []);
        if (res.data.counts) setCounts(res.data.counts);
      }
    } catch (err) {
      console.error('Failed to fetch legal documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setDocForm({
      title: '',
      slug: '',
      category: 'compliance',
      summary: '',
      content: '',
      status: 'published',
      effectiveDate: new Date().toISOString().split('T')[0],
      isMandatoryFor: [],
      changeSummary: '',
      isMaterialUpdate: false,
    });
    setPreviewContent(false);
    setFormError('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setDocForm({
      title: doc.title,
      slug: doc.slug,
      category: doc.category,
      summary: doc.summary || '',
      content: doc.content,
      status: doc.status,
      effectiveDate: doc.effectiveDate
        ? new Date(doc.effectiveDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      isMandatoryFor: doc.isMandatoryFor || [],
      changeSummary: '',
      isMaterialUpdate: false,
    });
    setPreviewContent(false);
    setFormError('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!docForm.title || !docForm.content) {
      setFormError('Title and Content are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await api.post('/legal/admin', docForm);
      if (res.data.success) {
        setShowCreateModal(false);
        fetchDocuments();
      } else {
        setFormError(res.data.message || 'Failed to create document');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving document');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!docForm.title || !docForm.content) {
      setFormError('Title and Content are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await api.put(`/legal/admin/${editingDoc._id}`, docForm);
      if (res.data.success) {
        setEditingDoc(null);
        fetchDocuments();
      } else {
        setFormError(res.data.message || 'Failed to update document');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error updating document');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (docId, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await api.patch(`/legal/admin/${docId}/status`, { status: nextStatus });
      if (res.data.success) {
        fetchDocuments();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (docId, title) => {
    if (!confirm(`Are you sure you want to delete policy: "${title}"?`)) return;
    try {
      const res = await api.delete(`/legal/admin/${docId}`);
      if (res.data.success) {
        fetchDocuments();
      }
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const handleViewVersions = async (doc) => {
    setViewingVersionsDoc(doc);
    try {
      const res = await api.get(`/legal/admin/${doc._id}/versions`);
      if (res.data.success) {
        setVersionsList(res.data.versions || []);
      }
    } catch (err) {
      alert('Failed to fetch versions');
    }
  };

  const handleViewAcceptances = async (doc) => {
    setViewingAcceptancesDoc(doc);
    try {
      const res = await api.get(`/legal/admin/acceptances?documentSlug=${doc.slug}`);
      if (res.data.success) {
        setAcceptancesList(res.data.acceptances || []);
      }
    } catch (err) {
      alert('Failed to fetch acceptances');
    }
  };

  const toggleMandatory = (role) => {
    setDocForm((prev) => {
      const current = prev.isMandatoryFor || [];
      if (current.includes(role)) {
        return { ...prev, isMandatoryFor: current.filter((r) => r !== role) };
      } else {
        return { ...prev, isMandatoryFor: [...current, role] };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            Legal & Policy Management System
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Centralized Legal Documents & Guidelines
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Author, edit, version-control, publish, and track mandatory agreements for journalists, members, and visitors.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-red-950/50 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Create New Legal Document
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-800 border-red-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Documents
          </span>
          <div className="text-2xl font-black text-white mt-1">{counts.total}</div>
        </div>

        <div
          onClick={() => setStatusFilter('published')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'published'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Published (Public)
          </span>
          <div className="text-2xl font-black text-emerald-300 mt-1">{counts.published}</div>
        </div>

        <div
          onClick={() => setStatusFilter('draft')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'draft'
              ? 'bg-amber-950/40 border-amber-500 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Drafts (Hidden)
          </span>
          <div className="text-2xl font-black text-amber-300 mt-1">{counts.draft}</div>
        </div>

        <div
          onClick={() => setStatusFilter('archived')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'archived'
              ? 'bg-slate-800 border-slate-600 shadow-md'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Archived
          </span>
          <div className="text-2xl font-black text-slate-400 mt-1">{counts.archived}</div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-red-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, slug, summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDocuments()}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <button
          onClick={fetchDocuments}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700"
        >
          Apply Filter
        </button>
      </div>

      {/* Document Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
            Loading legal documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No legal documents match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Document Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Version</th>
                  <th className="py-3 px-4 text-center">Mandatory For</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{doc.title}</span>
                        {doc.status === 'published' && (
                          <a
                            href={`/legal/${doc.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Open public page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        /legal/{doc.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60">
                        {doc.category}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-300">
                        v{doc.version || 1}.0
                      </span>
                    </td>

                    {/* Mandatory For */}
                    <td className="py-3.5 px-4 text-center">
                      {doc.isMandatoryFor && doc.isMandatoryFor.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {doc.isMandatoryFor.map((m) => (
                            <span
                              key={m}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/80 text-amber-400 border border-amber-800/60"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {new Date(doc.lastUpdated || doc.updatedAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(doc._id, doc.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          doc.status === 'published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60'
                            : doc.status === 'draft'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900/60'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                        title="Click to toggle published / draft"
                      >
                        {doc.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Document"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleViewVersions(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition-colors"
                          title="View Version History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleViewAcceptances(doc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 transition-colors"
                          title="View User Acceptances"
                        >
                          <Users className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id, doc.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showCreateModal || editingDoc) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingDoc ? `Edit Legal Document: ${editingDoc.title}` : 'Create New Legal Document'}
                </h3>
                <span className="text-xs text-slate-400">
                  {editingDoc
                    ? `Current Version: v${editingDoc.version}.0`
                    : 'Set up initial policy and publish directly or save as draft'}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingDoc(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={editingDoc ? handleEditSubmit : handleCreateSubmit}
              className="p-6 overflow-y-auto space-y-5 flex-1 text-xs"
            >
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Document Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Privacy Policy"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Slug (URL Identifier) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. privacy-policy"
                    value={docForm.slug}
                    onChange={(e) => setDocForm({ ...docForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Category, Status & Effective Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Publishing Status</label>
                  <select
                    value={docForm.status}
                    onChange={(e) => setDocForm({ ...docForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="published">Published (Live Online)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Effective Date</label>
                  <input
                    type="date"
                    value={docForm.effectiveDate}
                    onChange={(e) => setDocForm({ ...docForm, effectiveDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Executive Summary / Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief one-line summary for cards, SEO description, and headers..."
                  value={docForm.summary}
                  onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Mandatory Agreement Checkboxes */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="font-bold text-slate-300 block">
                  Enforce Mandatory Agreement Acceptance On:
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={docForm.isMandatoryFor.includes('reporter')}
                      onChange={() => toggleMandatory('reporter')}
                      className="rounded border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>Press Reporters (Correspondents)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={docForm.isMandatoryFor.includes('member')}
                      onChange={() => toggleMandatory('member')}
                      className="rounded border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>Organization Members (Committee)</span>
                  </label>
                </div>
              </div>

              {/* Material Update Controls for Edit */}
              {editingDoc && (
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                  <label className="flex items-center gap-2 font-bold text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docForm.isMaterialUpdate}
                      onChange={(e) =>
                        setDocForm({ ...docForm, isMaterialUpdate: e.target.checked })
                      }
                      className="rounded border-amber-700 text-amber-500 focus:ring-0"
                    />
                    <span>
                      Material Revision: Increment Document Version (v{editingDoc.version + 1}.0) & Require Re-Acceptance
                    </span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter change summary (e.g. Updated Section 4 regarding grievance redressal)..."
                    value={docForm.changeSummary}
                    onChange={(e) => setDocForm({ ...docForm, changeSummary: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              )}

              {/* Markdown Content Area & Preview Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">
                    Full Document Content (Markdown Supported) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewContent(!previewContent)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold"
                  >
                    {previewContent ? 'Switch to Editor' : 'Live Markdown Preview'}
                  </button>
                </div>

                {previewContent ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[250px] max-h-96 overflow-y-auto prose prose-invert max-w-none text-xs">
                    <ReactMarkdown>{docForm.content}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    rows={12}
                    required
                    placeholder="# Document Title\n\n## 1. Introduction\nAdd terms and guidelines..."
                    value={docForm.content}
                    onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white text-xs leading-relaxed focus:outline-none focus:border-red-500"
                  />
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingDoc(null);
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50"
                >
                  {formSubmitting
                    ? 'Saving...'
                    : editingDoc
                    ? 'Save Changes'
                    : 'Publish / Save Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {viewingVersionsDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                Version History: {viewingVersionsDoc.title}
              </h3>
              <button
                onClick={() => setViewingVersionsDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {versionsList.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No historical versions found.
                </p>
              ) : (
                versionsList.map((ver) => (
                  <div
                    key={ver._id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-400">
                        Version {ver.versionNumber}.0
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(ver.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium">{ver.changeSummary}</p>
                    {ver.changedBy && (
                      <span className="text-[10px] text-slate-500 block">
                        Changed by: {ver.changedBy.name} ({ver.changedBy.email})
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* USER ACCEPTANCE LOGS MODAL */}
      {viewingAcceptancesDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                User Acceptance Logs: {viewingAcceptancesDoc.title}
              </h3>
              <button
                onClick={() => setViewingAcceptancesDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {acceptancesList.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No acceptance records logged yet for this document.
                </p>
              ) : (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">User</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Version</th>
                      <th className="p-2.5">IP Address</th>
                      <th className="p-2.5">Accepted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {acceptancesList.map((acc) => (
                      <tr key={acc._id} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-medium text-white">
                          {acc.userId?.name || 'User'}
                          <span className="text-[10px] text-slate-500 block">
                            {acc.userId?.idCardNumber || acc.userId?.email}
                          </span>
                        </td>
                        <td className="p-2.5 uppercase font-bold text-amber-400">
                          {acc.roleAtAcceptance}
                        </td>
                        <td className="p-2.5 font-mono">v{acc.versionNumber}.0</td>
                        <td className="p-2.5 font-mono text-slate-400">
                          {acc.ipAddress || '—'}
                        </td>
                        <td className="p-2.5 text-slate-400">
                          {new Date(acc.acceptedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


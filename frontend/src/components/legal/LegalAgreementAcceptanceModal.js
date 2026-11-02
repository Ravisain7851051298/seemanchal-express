'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005').replace(/\/api\/?$/, '');

export default function LegalAgreementAcceptanceModal({ token, userRole, onAllAccepted }) {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [fullDoc, setFullDoc] = useState(null);

  useEffect(() => {
    if (token) {
      checkPendingAgreements();
    }
  }, [token]);

  const checkPendingAgreements = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/legal/acceptance/my-pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.pendingDocuments && data.pendingDocuments.length > 0) {
        setPendingDocs(data.pendingDocuments);
        loadDocDetails(data.pendingDocuments[0].slug);
      } else {
        setPendingDocs([]);
        if (onAllAccepted) onAllAccepted();
      }
    } catch (err) {
      console.error('Failed to check mandatory agreements:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDocDetails = async (slug) => {
    try {
      const res = await fetch(`${API_BASE}/api/legal/view/${slug}`);
      const data = await res.json();
      if (data.success && data.document) {
        setFullDoc(data.document);
      }
    } catch (err) {
      console.error('Failed to load document content:', err);
    }
  };

  const handleAccept = async (docId) => {
    try {
      setAccepting(true);
      setError('');
      const res = await fetch(`${API_BASE}/api/legal/acceptance/${docId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < pendingDocs.length) {
          setCurrentIndex(nextIndex);
          loadDocDetails(pendingDocs[nextIndex].slug);
        } else {
          setPendingDocs([]);
          if (onAllAccepted) onAllAccepted();
        }
      } else {
        setError(data.message || 'Failed to record acceptance.');
      }
    } catch (err) {
      setError('Connection error while recording acceptance.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading || pendingDocs.length === 0) {
    return null;
  }

  const currentDoc = pendingDocs[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border-2 border-red-600/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" /> Mandatory Legal Compliance
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Action Required: Review & Accept Agreement
            </h3>
            <p className="text-xs text-slate-400">
              Document {currentIndex + 1} of {pendingDocs.length} required for your {userRole} role.
            </p>
          </div>
        </div>

        {/* Modal Body - Scrollable Document Review */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-300 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">{currentDoc.title}</h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300">
                Version {currentDoc.version || 1}.0
              </span>
            </div>
            {currentDoc.summary && (
              <p className="text-xs text-slate-400 leading-relaxed">{currentDoc.summary}</p>
            )}
          </div>

          {/* Full content if loaded */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 max-h-72 overflow-y-auto space-y-3 prose prose-invert max-w-none text-xs leading-relaxed">
            {fullDoc ? (
              <ReactMarkdown>{fullDoc.content}</ReactMarkdown>
            ) : (
              <div className="py-8 text-center text-slate-500 animate-pulse">
                Loading document content...
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/50 text-[11px] text-slate-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              By clicking <strong className="text-white">"I Accept this Agreement"</strong>, you acknowledge that you have read, understood, and agreed to adhere strictly to all provisions set forth herein. Your digital acceptance will be recorded in compliance with IT Act Section 10A.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-500">
            Acceptance is mandatory to access panel tools.
          </span>
          <button
            type="button"
            disabled={accepting}
            onClick={() => handleAccept(currentDoc._id)}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-red-950/60 flex items-center gap-2 disabled:opacity-50"
          >
            {accepting ? (
              'Recording Acceptance...'
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> I Accept this Agreement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


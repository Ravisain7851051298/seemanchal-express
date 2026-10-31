'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Printer } from 'lucide-react';
import getMediaUrl from '../../lib/imageHelper';

export default function DigitalIdCard({ cardData, onPrint }) {
  if (!cardData) return null;

  const isReporter = cardData.role === 'reporter';
  const headerBg = isReporter
    ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900'
    : 'bg-gradient-to-r from-red-700 via-red-800 to-red-950';

  const badgeColor = isReporter ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900';

  const verifyUrl =
    cardData.verificationUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/verify/${cardData.idCardNumber || 'verified'}`
      : `https://seemanchalexpress.in/verify/${cardData.idCardNumber || 'verified'}`);

  return (
    <div className="flex flex-col items-center">
      {/* Printable Card Area */}
      <div className="print-area w-full max-w-sm bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden text-slate-800 font-sans my-4">
        {/* Top Header Strip */}
        <div className={`${headerBg} text-white px-4 py-3 text-center relative`}>
          <div className="flex items-center justify-center gap-2">
            <img
              src="/logo.jpeg"
              alt="Seemanchal Express"
              className="w-8 h-8 rounded-md bg-white object-contain shadow p-0.5"
            />
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight uppercase">
                SEEMANCHAL EXPRESS
              </h2>
              <p className="text-[10px] tracking-wider font-semibold text-amber-200">
                Voice of the People | Fearless Journalism
              </p>
            </div>
          </div>
          <div className="mt-1 text-[9px] text-white/80">
            F 65, Shaheen Bagh, Okhla, New Delhi-110025
          </div>
        </div>

        {/* Card Type Bar */}
        <div className="bg-slate-900 text-white text-[11px] font-bold py-1 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isReporter ? 'PRESS IDENTITY CARD' : 'OFFICIAL EXECUTIVE IDENTITY CARD'}</span>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col items-center text-center">
          {/* Member Photo */}
          <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-red-600 shadow-md mb-3 bg-slate-100">
            <img
              src={getMediaUrl(cardData.photo)}
              alt={cardData.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Member Name & Position */}
          <h3 className="text-lg font-black text-slate-900 leading-snug">
            {cardData.name}
          </h3>
          <span className={`mt-1 text-xs font-black px-3 py-0.5 rounded-full ${badgeColor} border border-slate-300 uppercase tracking-wide`}>
            {cardData.assignedDesignation || 'Executive Member'}
          </span>

          {/* Details Table */}
          <div className="w-full mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Card Identifier:</span>
              <span className="font-black text-red-700 font-mono text-xs">
                {cardData.idCardNumber || 'SE-0000'}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Committee Tier:</span>
              <span className="font-bold text-slate-800">
                {cardData.committeeLevel} Committee
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Assigned Area:</span>
              <span className="font-bold text-slate-800 truncate max-w-[170px]">
                {cardData.assignedLocation || 'Seemanchal Region'}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-semibold text-slate-800">{cardData.phone}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Blood Group:</span>
              <span className="font-bold text-red-600">{cardData.bloodGroup || 'N/A'}</span>
            </div>
          </div>

          {/* QR Code & Authority Signatures */}
          <div className="w-full mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-3 text-left">
            <div className="flex flex-col items-center">
              <div className="p-1 bg-white border border-slate-300 rounded shadow-sm">
                <QRCodeSVG value={verifyUrl} size={65} level="M" />
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5">Scan to Verify</span>
            </div>

            <div className="text-right flex flex-col justify-between h-full">
              <div className="text-[10px] text-slate-400 font-medium">
                Validity: <br />
                <strong className="text-slate-800 font-bold">
                  {cardData.validUntil
                    ? new Date(cardData.validUntil).toLocaleDateString('en-US')
                    : 'Active'}
                </strong>
              </div>

              <div className="mt-2 text-center border-t border-slate-400 pt-1">
                <div className="text-[10px] font-black text-red-700">Authorized Signatory</div>
                <div className="text-[8px] text-slate-500 leading-none">Editor-in-Chief / Secretariat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="bg-slate-900 text-white text-[9px] py-1.5 px-3 text-center">
          Property of Seemanchal Express. If found, return to HQ or call +91 9871023184.
        </div>
      </div>

      {/* Print / Download Button */}
      <button
        type="button"
        onClick={() => {
          if (onPrint) onPrint();
          else window.print();
        }}
        className="no-print mt-3 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 transition-all"
      >
        <Printer className="w-4 h-4 text-emerald-400" />
        Print / Save ID Card as PDF
      </button>
    </div>
  );
}

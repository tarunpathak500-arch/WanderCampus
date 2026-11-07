import React from 'react';
import { Claim, FoundItem } from '../types';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Download,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface MyClaimsViewProps {
  claims: (Claim & { item?: FoundItem | null })[];
  onExploreFeed: () => void;
}

export const MyClaimsView: React.FC<MyClaimsViewProps> = ({ claims, onExploreFeed }) => {
  const handleDownloadPass = (claim: Claim) => {
    const pass = `==============================================
WANDER CAMPUS - PHYSICAL PICKUP PASS
Official University Lost & Found Claim Clearance
==============================================
Tracking ID:         ${claim.item_tracking_code}
Item:                ${claim.item_title}
Claimant:            ${claim.claimant_name}
Registration No:     ${claim.claimant_reg_no}
Custody Pickup Desk: ${claim.pickup_desk}
Scheduled Window:    ${claim.pickup_scheduled_date} at ${claim.pickup_scheduled_time}
Verification Status: ${claim.verification_status.toUpperCase()}
==============================================
INSTRUCTIONS FOR PHYSICAL COLLECTION:
1. Present this digital pass along with your University RFID card.
2. The duty officer at ${claim.pickup_desk} will verify your identity.
3. Sign the physical handover ledger to release the item.
==============================================`;

    const blob = new Blob([pass], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PickupPass_${claim.item_tracking_code}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            My Submitted Ownership Claims
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track verification progress and schedule physical pickups across campus custody desks.
          </p>
        </div>

        <button
          onClick={onExploreFeed}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Explore Campus Feed →
        </button>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">No claims submitted yet</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            If you have lost an item on campus, search the Found Items Feed and click "This Item is Mine" to submit proof.
          </p>
          <button
            onClick={onExploreFeed}
            className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
          >
            Browse Found Items Feed
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {claims.map((claim) => {
            const isApproved = claim.verification_status === 'approved';
            const isReturned = claim.item?.status === 'returned';
            const isRejected = claim.verification_status === 'rejected';

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                        {claim.item_tracking_code}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600 font-medium">{claim.item_category}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {claim.item_title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isRejected
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {claim.verification_status === 'pending'
                        ? 'Under Security Review'
                        : `Claim ${claim.verification_status}`}
                    </span>
                  </div>
                </div>

                {/* 4-Stage Handover Timeline */}
                <div className="py-6 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Handover Verification Timeline
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Claim Logged</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(claim.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isApproved || isReturned
                            ? 'bg-emerald-600 text-white'
                            : isRejected
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white animate-pulse'
                        }`}
                      >
                        {isApproved || isReturned ? '✓' : isRejected ? '✕' : '2'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Desk Audit</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isApproved
                            ? 'Secret marks matched'
                            : isRejected
                            ? 'Claim unverified'
                            : 'Verifying secrets...'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isApproved || isReturned ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isApproved || isReturned ? '✓' : '3'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Ready for Pickup</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {claim.pickup_desk}
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isReturned ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isReturned ? '✓' : '4'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Handover Complete</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isReturned ? 'Possession restored' : 'Pending physical release'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details grid & actions */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <strong className="text-slate-800">Physical Pickup Location:</strong> {claim.pickup_desk}
                    </p>
                    <p>
                      <strong className="text-slate-800">Appointment:</strong>{' '}
                      <span className="font-mono">{claim.pickup_scheduled_date} at {claim.pickup_scheduled_time}</span>
                    </p>
                    {claim.admin_notes && (
                      <p className="text-emerald-800 bg-emerald-50/70 border border-emerald-200 p-2 rounded-md font-medium">
                        Officer Note: {claim.admin_notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownloadPass(claim)}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Pickup Pass
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

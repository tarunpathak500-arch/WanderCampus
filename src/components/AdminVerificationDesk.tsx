import React, { useState } from 'react';
import { Claim, FoundItem } from '../types';
import { updateClaimStatus, markItemAsReturned } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  User,
  Calendar,
  AlertTriangle,
  Send,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AdminVerificationDeskProps {
  claims: (Claim & { item?: FoundItem | null })[];
  onRefresh: () => void;
}

export const AdminVerificationDesk: React.FC<AdminVerificationDeskProps> = ({
  claims,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [selectedClaim, setSelectedClaim] = useState<(Claim & { item?: FoundItem | null }) | null>(
    claims[0] || null
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [handoverRecipientName, setHandoverRecipientName] = useState('');

  const filteredClaims = claims.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.verification_status === statusFilter;
  });

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedClaim) return;
    try {
      setActionLoading(true);
      await updateClaimStatus(selectedClaim.id, status, adminNotes);
      onRefresh();
      // Update local state
      setSelectedClaim({
        ...selectedClaim,
        verification_status: status,
        admin_notes: adminNotes,
      });
      setAdminNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to update claim');
    } finally {
      setActionLoading(false);
    }
  };

  const handleHandoverComplete = async () => {
    if (!selectedClaim || !selectedClaim.item) return;
    const recipient = handoverRecipientName || selectedClaim.claimant_name;
    try {
      setActionLoading(true);
      await markItemAsReturned(
        selectedClaim.item.id,
        recipient,
        user?.full_name || 'Security Officer',
        selectedClaim.id
      );
      onRefresh();
      alert(`Handover signed off! Item marked as Claimed & Returned.`);
      setHandoverRecipientName('');
    } catch (err: any) {
      alert(err.message || 'Failed to mark returned');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">
              Campus Security & Verification Desk
            </h2>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
              Elevated Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Audit ownership claims, compare secret distinguishing marks against physical items, and authorize secure handovers.
          </p>
        </div>

        {/* Claim status tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-emerald-700 text-white font-semibold' : 'hover:text-white'
            }`}
          >
            All Claims ({claims.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'pending' ? 'bg-amber-500 text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'approved' ? 'bg-emerald-600 text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              statusFilter === 'rejected' ? 'bg-rose-600 text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredClaims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No claims in this category</h3>
          <p className="text-xs text-slate-500 mt-1">
            All submitted claims for this filter have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Claims Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Active Claim Submissions Queue ({filteredClaims.length})
            </h3>

            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredClaims.map((claim) => {
                const isSelected = selectedClaim?.id === claim.id;
                return (
                  <div
                    key={claim.id}
                    onClick={() => {
                      setSelectedClaim(claim);
                      setAdminNotes(claim.admin_notes || '');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {claim.item_tracking_code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          claim.verification_status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : claim.verification_status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {claim.verification_status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {claim.item_title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>Claimant: {claim.claimant_name} ({claim.claimant_reg_no})</span>
                      <span className="font-mono">{new Date(claim.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Claim Audit Console (7 cols) */}
          {selectedClaim && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Ownership Verification Audit
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedClaim.item_title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    {selectedClaim.item_tracking_code}
                  </span>
                </div>

                {/* Claimant Dossier */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Claimant</span>
                    <span className="font-semibold text-slate-900">{selectedClaim.claimant_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registration ID</span>
                    <span className="font-mono font-semibold text-slate-900">{selectedClaim.claimant_reg_no}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone</span>
                    <span className="font-semibold text-slate-900">{selectedClaim.claimant_phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pickup Schedule</span>
                    <span className="font-mono font-semibold text-emerald-800">
                      {selectedClaim.pickup_scheduled_date} {selectedClaim.pickup_scheduled_time}
                    </span>
                  </div>
                </div>

                {/* CRUCIAL COMPARISON: SECRET MARKS vs CLAIMANT SUBMISSION */}
                <div className="space-y-3 mb-5">
                  {/* Physical Item Secret Details (Recorded by Finder/Desk) */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Physical Item Secret Ledger (Finder's Ground Truth)</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      {selectedClaim.item?.secret_distinguishing_marks ||
                        'No physical secret marks recorded by finder.'}
                    </p>
                  </div>

                  {/* Claimant's Submitted Description */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Claimant's Submitted Proof of Ownership</span>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      "{selectedClaim.ownership_proof_description}"
                    </p>
                  </div>
                </div>

                {/* Uploaded Document / Invoice proof */}
                {selectedClaim.proof_document_name && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-700 truncate max-w-xs">
                        {selectedClaim.proof_document_name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Document Attached
                    </span>
                  </div>
                )}

                {/* Administrative Audit Notes Input */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Security Officer Verification Notes / Audit Decision
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Identity verified via university portal photo. Wallet cash amount confirmed exact match."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    disabled={actionLoading || selectedClaim.verification_status === 'approved'}
                    onClick={() => handleUpdateStatus('approved')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Claim
                  </button>

                  <button
                    disabled={actionLoading || selectedClaim.verification_status === 'rejected'}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="flex-1 sm:flex-none px-4 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Claim
                  </button>
                </div>

                {/* Handover Sign-off */}
                {selectedClaim.verification_status === 'approved' && selectedClaim.item?.status !== 'returned' && (
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <button
                      disabled={actionLoading}
                      onClick={handleHandoverComplete}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Sign-Off Handover (Mark Returned)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

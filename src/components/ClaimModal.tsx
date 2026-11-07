import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitOwnershipClaim } from '../services/api';
import { FoundItem, Claim } from '../types';
import {
  X,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

interface ClaimModalProps {
  item: FoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: (claim: Claim, updatedItem: FoundItem) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onClaimSubmitted,
}) => {
  const { user } = useAuth();

  const [proofDescription, setProofDescription] = useState('');
  const [proofFilePreview, setProofFilePreview] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('14:30');
  const [claimantName, setClaimantName] = useState(user?.full_name || '');
  const [claimantRegNo, setClaimantRegNo] = useState(user?.registration_number || '');
  const [claimantPhone, setClaimantPhone] = useState(user?.phone_number || '+91 98765 43210');
  const [claimantEmail, setClaimantEmail] = useState(user?.email || 'student@univ.edu');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successClaim, setSuccessClaim] = useState<Claim | null>(null);

  if (!isOpen || !item) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Proof document must be under 8MB');
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProofFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleQuickProofFill = () => {
    if (item.category === 'Electronics & Gadgets') {
      setProofDescription(
        'The device has a custom sticker on the back casing, and the Bluetooth broadcast name matches my student registration ID. Serial number begins with SN-88.'
      );
    } else if (item.category === 'Wallet/Purse') {
      setProofDescription(
        'Inside the bill fold are two 500 rupee notes and my university gym card with my name. There is a small photo in the flap compartment.'
      );
    } else {
      setProofDescription(
        'There is a tiny identification mark on the corner, and I possess the purchase invoice / duplicate key for verification.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proofDescription.trim() || proofDescription.trim().length < 10) {
      setError('Please provide a specific description of secret marks to substantiate ownership.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        ownership_proof_description: proofDescription.trim(),
        proof_document_url: proofFilePreview,
        proof_document_name: proofFileName,
        pickup_scheduled_date: pickupDate,
        pickup_scheduled_time: pickupTime,
        claimant_name: claimantName || user?.full_name || 'Claimant',
        claimant_reg_no: claimantRegNo || user?.registration_number || 'REG-PENDING',
        claimant_phone: claimantPhone || user?.phone_number || 'N/A',
        claimant_email: claimantEmail || user?.email || 'N/A',
      };

      const result = await submitOwnershipClaim(item.id, payload);
      setSuccessClaim(result.claim);
      onClaimSubmitted(result.claim, result.item);
    } catch (err: any) {
      setError(err.message || 'Failed to submit ownership claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Ownership Verification & Claim Form
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Item Tracking ID: {item.tracking_code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successClaim ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Claim Registered for Desk Review
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Your claim details have been routed to the campus security desk holding physical custody.
              Item status updated to <strong className="text-amber-700">Claim Under Review</strong>.
            </p>

            {/* Pickup Token Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-6 text-left text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-800">Physical Pickup Station:</span>
                <span className="font-bold text-emerald-800">{item.custody_desk_location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Appointment Schedule:</span>
                <span className="font-mono font-medium">{successClaim.pickup_scheduled_date} at {successClaim.pickup_scheduled_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Claimant Registration:</span>
                <span className="font-mono font-semibold">{successClaim.claimant_reg_no}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Please bring your University ID card for biometric/photo comparison during physical pickup.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              Back to Campus Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Item summary banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {item.category.slice(0, 3)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{item.found_location_block}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">Custody: {item.custody_desk_location}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Proof of Ownership Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Proof of Ownership (Crucial Validation Step) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleQuickProofFill}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Auto-fill sample proof
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                Describe unique hidden markers not visible in the public preview (e.g., exact contents,
                lock-screen wallpaper, stickers, scratches, internal serial numbers).
              </p>
              <textarea
                required
                rows={3}
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                placeholder="e.g. My wallet has ₹1,100 cash (two 500s and one 100), a library card with my name, and a scratch on the bottom right corner..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            {/* Optional proof document upload */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Upload Verification Document (Optional)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 px-3 py-2 border border-dashed border-slate-300 hover:border-emerald-500 rounded-lg cursor-pointer text-xs text-slate-600 flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">
                    {proofFileName || 'Upload receipt, purchase bill, duplicate key, or ID copy'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {proofFileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setProofFileName('');
                      setProofFilePreview('');
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Physical Collection Appointment */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Physical Pickup Schedule at {item.custody_desk_location}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Time Window</label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                    >
                      <option value="10:00">10:00 AM (Morning Slot)</option>
                      <option value="12:30">12:30 PM (Midday Slot)</option>
                      <option value="14:30">02:30 PM (Afternoon Slot)</option>
                      <option value="16:45">04:45 PM (Evening Slot)</option>
                      <option value="18:30">06:30 PM (Post-Classes Slot)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Claimant Identification */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-800 mb-2">Claimant Contact Verification</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={claimantRegNo}
                    onChange={(e) => setClaimantRegNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={claimantPhone}
                    onChange={(e) => setClaimantPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">University Email</label>
                  <input
                    type="email"
                    required
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Submitting Claim...' : 'Submit Claim & Request Verification'}
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

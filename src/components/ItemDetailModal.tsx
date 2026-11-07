import React from 'react';
import { FoundItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Shield,
  Calendar,
  Lock,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ItemDetailModalProps {
  item: FoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (item: FoundItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onClaim,
}) => {
  const { user } = useAuth();
  if (!isOpen || !item) return null;

  const isAdmin = user?.role === 'admin';
  const isFinder = user?.id === item.finder_user_id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {item.tracking_code}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                  item.status === 'unclaimed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : item.status === 'claim_pending'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Photo Display with fallback */}
          {item.image_url ? (
            <div className="relative rounded-xl overflow-hidden bg-slate-900 max-h-64 flex items-center justify-center border border-slate-200 shadow-inner">
              <img
                src={item.image_url}
                alt={item.title}
                className="max-h-64 w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/70 backdrop-blur-xs rounded text-[10px] text-white font-mono flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Verified Discovery Photo</span>
              </div>
            </div>
          ) : (
            <div className="h-36 rounded-xl bg-gradient-to-br from-emerald-50/50 to-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-500">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                {item.category}
              </span>
              <p className="text-xs text-slate-400">No public photo provided by finder</p>
            </div>
          )}

          {/* Location & Custody Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Found Sector
              </span>
              <p className="font-semibold text-slate-900">{item.found_location_block}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.found_location_details}</p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-emerald-800 block text-[10px] uppercase font-bold tracking-wider mb-1">
                Physical Custody Station
              </span>
              <p className="font-semibold text-emerald-950">{item.custody_desk_location}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Where item is secured for pickup</p>
            </div>
          </div>

          {/* Description */}
          {item.additional_notes && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Finder's Public Notes
              </span>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                {item.additional_notes}
              </p>
            </div>
          )}

          {/* Secret Marks (Hidden from general public, revealed only to admin/finder) */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Hidden Verification Challenge</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isAdmin || isFinder ? 'Visible to Authorized Personnel' : 'Protected'}
              </span>
            </div>

            {isAdmin || isFinder ? (
              <div className="mt-2 p-2 bg-amber-50/60 border border-amber-200 rounded text-xs text-amber-900 font-medium">
                {item.secret_distinguishing_marks || 'No secret marks recorded.'}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 leading-relaxed">
                A secret challenge (unique marks, contents, or serial hints) is on record.
                When you click "Claim Item", describe these marks to verify your identity.
              </p>
            )}
          </div>

          {/* Timestamp & Finder meta */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Reported {new Date(item.created_at).toLocaleString()}</span>
            <span>Finder ID: {item.finder_reg_no}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>

          {item.status === 'unclaimed' && (
            <button
              onClick={() => {
                onClose();
                onClaim(item);
              }}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              This Item is Mine (Start Claim)
            </button>
          )}

          {item.status === 'claim_pending' && (
            <div className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Claim Under Security Review</span>
            </div>
          )}

          {item.status === 'returned' && (
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Returned to Rightful Owner</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

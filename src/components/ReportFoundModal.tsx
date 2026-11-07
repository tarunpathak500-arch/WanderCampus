import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createFoundItem } from '../services/api';
import { FoundItem, ItemCategory, CampusBlock, CustodyDesk } from '../types';
import { CAMPUS_BLOCKS, CUSTODY_DESKS, ITEM_CATEGORIES } from '../campusData';
import {
  UploadCloud,
  Camera,
  X,
  CheckCircle2,
  Download,
  Printer,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ReportFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: (item: FoundItem) => void;
}

export const ReportFoundModal: React.FC<ReportFoundModalProps> = ({
  isOpen,
  onClose,
  onItemCreated,
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-step states (1: Item info & Photo, 2: 600-Acre Location & Desk, 3: Verification Secrets & Founder Contact)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdItem, setCreatedItem] = useState<FoundItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics & Gadgets');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [block, setBlock] = useState<CampusBlock>('Block 34 (School of Computer Science & IT)');
  const [locationDetails, setLocationDetails] = useState('');
  const [custodyDesk, setCustodyDesk] = useState<CustodyDesk>('Block 34 Helpdesk (CSE/IT)');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [secretMarks, setSecretMarks] = useState('');
  const [finderName, setFinderName] = useState(user?.full_name || '');
  const [finderRegNo, setFinderRegNo] = useState(user?.registration_number || '');
  const [finderPhone, setFinderPhone] = useState(user?.phone_number || '+91 98765 43210');

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Photo exceeds 8MB. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Preset Sample Fill for Fast Testing
  const handleQuickPrefill = (presetType: 'calculator' | 'wallet' | 'keys') => {
    if (presetType === 'calculator') {
      setTitle('Casio fx-991CW ClassWiz Scientific Calculator');
      setCategory('Electronics & Gadgets');
      setBlock('Central Library (Blocks 13 & 14 Reading Commons)');
      setLocationDetails('3rd Floor Science Wing, table 28 near study carrels');
      setCustodyDesk('Central Library Reception (Block 13/14)');
      setAdditionalNotes('White body with black cover. Excellent condition with slide cover on.');
      setSecretMarks('Engraved with small scratch near battery lid and initials "A.K." written in blue marker.');
      setPhotoPreview('/src/assets/images/item_found_calculator_1794051824195.jpg');
    } else if (presetType === 'wallet') {
      setTitle('Black Men\'s Leather Cardholder Wallet');
      setCategory('Wallet/Purse');
      setBlock('Uni-Mall & Multiplex Food Court');
      setLocationDetails('On the high bar counter at the Domino outlet');
      setCustodyDesk('Uni-Mall Security Control Desk');
      setAdditionalNotes('Leather cardholder containing campus gym card.');
      setSecretMarks('Contains one folded ₹200 note and two student transit passes.');
      setPhotoPreview('/src/assets/images/item_found_leather_wallet_1794051824462.jpg');
    } else {
      setTitle('Hostel Room Key with Metallic Marvel Keychain');
      setCategory('Keys');
      setBlock('Boys Hostel 3 (BH-3)');
      setLocationDetails('Found on the stairs between 2nd and 3rd floor');
      setCustodyDesk('Hostel Warden Office (Boys BH-1 to BH-8)');
      setAdditionalNotes('Two brass keys on an iron ring with an Iron Man miniature.');
      setSecretMarks('Key stamped with room number 314-B on the rear groove.');
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an item title.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: title.trim(),
        category,
        image_url: photoPreview,
        found_location_block: block,
        found_location_details: locationDetails.trim(),
        custody_desk_location: custodyDesk,
        additional_notes: additionalNotes.trim(),
        secret_distinguishing_marks: secretMarks.trim(),
        finder_name: finderName || user?.full_name || 'Founder',
        finder_reg_no: finderRegNo || user?.registration_number || 'REG-PENDING',
        finder_phone: finderPhone || '+91 98765 00000',
      };

      const result = await createFoundItem(payload);
      setCreatedItem(result.item);
      onItemCreated(result.item);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceiptText = () => {
    if (!createdItem) return;
    const receiptContent = `=========================================
CAMPUSRETRIEVER - FOUND ITEM RECEIPT
University 600-Acre Campus Custody Registry
=========================================
Tracking Code:       ${createdItem.tracking_code}
Item Title:          ${createdItem.title}
Category:            ${createdItem.category}
Found Location:      ${createdItem.found_location_block}
Discovery Landmark:  ${createdItem.found_location_details}
Custody Desk:        ${createdItem.custody_desk_location}
Registered At:       ${new Date(createdItem.created_at).toLocaleString()}
Finder Name:         ${createdItem.finder_name}
Finder Reg No:       ${createdItem.finder_reg_no}
Status:              OFFICIALLY REGISTERED & LOGGED IN SYSTEM
=========================================
Please retain this receipt token for tracking.
The item is now available for owner verification.
=========================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${createdItem.tracking_code}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Electronics & Gadgets');
    setPhotoPreview('');
    setLocationDetails('');
    setAdditionalNotes('');
    setSecretMarks('');
    setStep(1);
    setCreatedItem(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Founder Submission Desk
            </h2>
            <p className="text-xs text-slate-500">
              Log a misplaced item discovered across the 600-acre university grounds.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View with Downloadable Receipt */}
        {createdItem ? (
          <div className="p-6 sm:p-8">
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Item Logged Successfully
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Your report has been securely registered in the campus lost & found network.
              </p>
            </div>

            {/* Official Submission Receipt Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-slate-800 shadow-xs print:border print:p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    Official Custody Receipt
                  </span>
                  <p className="text-base font-extrabold font-mono text-emerald-800">
                    {createdItem.tracking_code}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono">Date Logged</span>
                  <p className="text-xs font-semibold text-slate-700">
                    {new Date(createdItem.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Item Title</span>
                  <span className="font-semibold text-slate-900">{createdItem.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="font-semibold text-slate-900">{createdItem.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Campus Sector</span>
                  <span className="font-semibold text-slate-900">{createdItem.found_location_block}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Submission / Custody Desk</span>
                  <span className="font-semibold text-emerald-700">{createdItem.custody_desk_location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Finder: {createdItem.finder_name} ({createdItem.finder_reg_no})</span>
                <span className="text-emerald-600 font-sans font-semibold">Active in Feed</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownloadReceiptText}
                className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                Download Receipt (.txt)
              </button>
              <button
                onClick={handlePrintReceipt}
                className="w-full sm:flex-1 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print Submission Slip
              </button>
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="w-full sm:w-auto py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step Progress indicator */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 1 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  1
                </span>
                <span className={`text-xs font-semibold ${step === 1 ? 'text-emerald-800' : 'text-slate-500'}`}>
                  Item & Photo
                </span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  2
                </span>
                <span className={`text-xs font-semibold ${step === 2 ? 'text-emerald-800' : 'text-slate-500'}`}>
                  Campus Location
                </span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 3 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  3
                </span>
                <span className={`text-xs font-semibold ${step === 3 ? 'text-emerald-800' : 'text-slate-500'}`}>
                  Verification Secret
                </span>
              </div>
            </div>

            {/* Quick Template Pre-fills */}
            <div className="mb-4 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Quick item template:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPrefill('calculator')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Calculator
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrefill('wallet')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Wallet
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrefill('keys')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Dorm Keys
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* STEP 1: ITEM DETAILS & PHOTO */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Name / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. TI-Nspire CAS Calculator, Dell 65W Laptop Charger, Blue Lanyard"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Photo Upload area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photograph of Found Item (Mobile Camera or Local File)
                  </label>
                  {photoPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-48 flex items-center justify-center">
                      <img
                        src={photoPreview}
                        alt="Item preview"
                        className="max-h-48 w-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700">
                        Click to browse or drag & drop item photo
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        JPEG, PNG, WebP up to 8MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Public Description (Non-sensitive details)
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="General appearance, color, brand, condition (e.g. Black textured cover, powers on normally)."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: 600-ACRE CAMPUS LOCATION & DESK */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Sector / Academic Block <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={block}
                    onChange={(e) => {
                      const newBlock = e.target.value as CampusBlock;
                      setBlock(newBlock);
                      // Auto suggest custody desk based on block
                      const blockInfo = CAMPUS_BLOCKS.find((b) => b.id === newBlock);
                      if (blockInfo) {
                        setCustodyDesk(blockInfo.custodyDesk);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    <optgroup label="🏫 Academic Blocks">
                      {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Academic Blocks').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🛍️ Central Amenities & Hubs">
                      {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Central Amenities').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🏢 Boys Hostels (BH-1 to BH-8)">
                      {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Boys Hostels').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🏢 Girls Hostels (GH-1 to GH-6)">
                      {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Girls Hostels').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🚪 Campus Gates & Sports">
                      {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Gates & Stadium').map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Discovery Landmark / Room <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder="e.g. 3rd Floor Lab 302, Bench near west bay window, Table 14"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Be specific so the rightful owner recognizes the exact discovery location.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Custody / Drop-off Desk <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={custodyDesk}
                    onChange={(e) => setCustodyDesk(e.target.value as CustodyDesk)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    {CUSTODY_DESKS.map((desk) => (
                      <option key={desk} value={desk}>
                        {desk}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Where is the item currently physically stored? (If kept with finder, security will coordinate handover).
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: VERIFICATION SECRETS & FOUNDER DETAILS */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Crucial Ownership Verification Challenge (Hidden)</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 leading-relaxed">
                    Enter details that <strong className="font-semibold">ONLY the genuine owner would know</strong>.
                    This will be kept hidden from the public feed and used by security staff to verify claims.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secret Distinguishing Marks / Hidden Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={secretMarks}
                    onChange={(e) => setSecretMarks(e.target.value)}
                    placeholder="e.g. Exact cash denominations in wallet, lock screen wallpaper description, custom stickers, serial number digits, name written inside jacket, key tag numbers."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 mb-3">Founder Contact Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={finderName}
                        onChange={(e) => setFinderName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Registration No</label>
                      <input
                        type="text"
                        value={finderRegNo}
                        onChange={(e) => setFinderRegNo(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Mobile / WhatsApp</label>
                      <input
                        type="text"
                        value={finderPhone}
                        onChange={(e) => setFinderPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as 1 | 2)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !title.trim()) {
                      setError('Please enter item name before continuing.');
                      return;
                    }
                    setError(null);
                    setStep((step + 1) as 2 | 3);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  Next Step
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Registering Item...' : 'Confirm & Generate Receipt'}
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

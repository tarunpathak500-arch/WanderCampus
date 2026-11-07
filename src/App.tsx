/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeedSection } from './components/FeedSection';
import { CampusMapViewer } from './components/CampusMapViewer';
import { ReportFoundModal } from './components/ReportFoundModal';
import { ClaimModal } from './components/ClaimModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { AdminVerificationDesk } from './components/AdminVerificationDesk';
import { MyClaimsView } from './components/MyClaimsView';
import { AnalyticsSection } from './components/AnalyticsSection';
import { getFoundItems, getClaims, getCampusAnalytics } from './services/api';
import { FoundItem, Claim, CampusStats } from './types';
import { Shield, Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { AppLogo } from './components/AppLogo';

function CampusRetrieverInner() {
  const { user } = useAuth();
  const [isGuest, setIsGuest] = useState(false);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'feed' | 'report' | 'map' | 'claims' | 'admin' | 'analytics'>('feed');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Data states
  const [items, setItems] = useState<FoundItem[]>([]);
  const [claims, setClaims] = useState<(Claim & { item?: FoundItem | null })[]>([]);
  const [stats, setStats] = useState<CampusStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<FoundItem | null>(null);
  const [claimModalItem, setClaimModalItem] = useState<FoundItem | null>(null);

  // Fetch Items & Stats
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsRes, analyticsRes] = await Promise.all([
        getFoundItems({
          search: searchQuery,
          block: selectedBlock,
          category: selectedCategory,
          status: selectedStatus,
        }),
        getCampusAnalytics(),
      ]);

      setItems(itemsRes.items);
      setStats(analyticsRes);

      // Load claims based on role
      if (user) {
        const claimsRes = await getClaims(user.role !== 'admin');
        setClaims(claimsRes.claims);
      }
    } catch (err) {
      console.error('Error fetching campus data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedBlock, selectedCategory, selectedStatus, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When tab is set to report, open the report modal
  const handleSelectTab = (tab: 'feed' | 'report' | 'map' | 'claims' | 'admin' | 'analytics') => {
    if (tab === 'report') {
      setIsReportModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemCreated = (newItem: FoundItem) => {
    setItems((prev) => [newItem, ...prev]);
    loadData();
  };

  const handleClaimSubmitted = (claim: Claim, updatedItem: FoundItem) => {
    setItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    setClaims((prev) => [{ ...claim, item: updatedItem }, ...prev]);
    loadData();
  };

  // FIRST PAGE IS ALWAYS THE LOGIN PAGE
  if (!user && !isGuest) {
    return <LoginPage onContinueAsGuest={() => setIsGuest(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top 3-Zone Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => {
          setIsGuest(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'feed' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
              onReportClick={() => setIsReportModalOpen(true)}
            />

            {/* Quick Map Teaser if not on map page */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="bg-gradient-to-r from-[#0d2b20] via-emerald-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-emerald-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Lost an item in a specific campus sector?</h3>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Explore our interactive spatial layout of all academic blocks, hostel zones, and custody desks.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectTab('map')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
                >
                  Open 600-Acre Map View
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <FeedSection
              items={items}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              onViewItem={(item) => setDetailModalItem(item)}
              onClaimItem={(item) => setClaimModalItem(item)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          </>
        )}

        {currentTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                600-Acre Campus Geography & Custody Hub
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Visual directory of academic sectors, hostel quads, and designated drop-off security desks.
              </p>
            </div>

            <CampusMapViewer
              items={items}
              selectedBlock={selectedBlock}
              onSelectBlock={(b) => setSelectedBlock(b)}
              onViewItem={(item) => setDetailModalItem(item)}
            />

            <div className="mt-8">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Items Logged Across Campus ({items.length})
              </h3>
              <FeedSection
                items={items}
                loading={loading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedBlock={selectedBlock}
                onSelectBlock={setSelectedBlock}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
                onViewItem={(item) => setDetailModalItem(item)}
                onClaimItem={(item) => setClaimModalItem(item)}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            </div>
          </div>
        )}

        {currentTab === 'claims' && (
          <MyClaimsView
            claims={claims}
            onExploreFeed={() => setCurrentTab('feed')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminVerificationDesk
            claims={claims}
            onRefresh={loadData}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsSection
            stats={stats}
            onRefresh={loadData}
          />
        )}
      </main>

      {/* Campus Support & Custody Desks Footer with LPU Branding */}
      {/* Campus Support & Custody Desks Footer with Wander Campus Branding */}
      <footer className="bg-[#0a231a] text-slate-400 text-xs border-t border-emerald-900/50 mt-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-emerald-900/40">
            <div>
              <div className="mb-3">
                <AppLogo size="sm" variant="dark" subtitle="600-Acre Campus Recovery Portal" />
              </div>
              <p className="text-emerald-100/70 text-xs leading-relaxed mt-3">
                Centralized property recovery network serving 35,000+ students and staff across the 600-acre university township.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded font-mono">
                  Official Portal
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
                  24/7 Custody
                </span>
              </div>
            </div>

            <div>
              <p className="text-white font-semibold mb-3">Official Custody Drop Desks</p>
              <ul className="space-y-1.5 text-xs text-emerald-100/70">
                <li>Central Security Control (Main Gate 1, GT Road)</li>
                <li>Block 34 Helpdesk (School of CSE & IT)</li>
                <li>Uni-Mall Security Desk (Student Centre)</li>
                <li>Central Library Reception (Blocks 13 & 14)</li>
                <li>Hostel Warden Offices (BH-1 to 8 & GH-1 to 6)</li>
                <li>Shanti Devi Mittal Sports Arena Desk</li>
              </ul>
            </div>

            <div>
              <p className="text-white font-semibold mb-3">Campus Emergency Helplines</p>
              <ul className="space-y-2 text-xs text-emerald-100/70">
                <li className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Main Gate 1 Security: +91 1824 517000 (Ext 4001)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Chief Warden Helpline: +91 1824 517112</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>lostfound@lpu.co.in / security@lpu.co.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Jalandhar-Delhi GT Road, Phagwara, Punjab 144411</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-semibold mb-3">Operational Handover Timings</p>
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/50 space-y-2">
                <p className="font-semibold text-emerald-200">Daily Physical Collection</p>
                <p className="text-[11px] text-emerald-300/70 leading-relaxed">
                  Counters open Mon–Sat 08:30 AM to 07:30 PM. Present digital pickup pass and university biometric RFID card for handover sign-off.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-400/60 font-mono">
            <span>© 2026 Wander Campus · 600-Acre Campus Recovery Portal</span>
            <span>SSO Verification Protocol v1.0 · Campus ICT Cell</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportFoundModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onItemCreated={handleItemCreated}
      />

      <ClaimModal
        item={claimModalItem}
        isOpen={Boolean(claimModalItem)}
        onClose={() => setClaimModalItem(null)}
        onClaimSubmitted={handleClaimSubmitted}
      />

      <ItemDetailModal
        item={detailModalItem}
        isOpen={Boolean(detailModalItem)}
        onClose={() => setDetailModalItem(null)}
        onClaim={(item) => setClaimModalItem(item)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CampusRetrieverInner />
    </AuthProvider>
  );
}

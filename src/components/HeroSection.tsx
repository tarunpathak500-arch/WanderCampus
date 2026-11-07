import React from 'react';
import { Search, Shield, ArrowRight } from 'lucide-react';
import { CAMPUS_BLOCKS } from '../campusData';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBlock: string;
  onSelectBlock: (block: string) => void;
  onReportClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedBlock,
  onSelectBlock,
  onReportClick,
}) => {
  return (
    <section className="relative bg-[#0d2b20] text-white overflow-hidden border-b border-emerald-900/40">
      {/* Background campus photo with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_campus_aerial_1794051803068.jpg"
          alt="600-acre university campus aerial view"
          className="w-full h-full object-cover object-center opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a231a] via-[#0d2b20]/90 to-[#0a231a]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 mb-3 bg-emerald-950/70 border border-emerald-700/60 px-3.5 py-1.5 rounded-full backdrop-blur-xs shadow-xs">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Wander Campus · 600-Acre Campus Recovery Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight text-balance">
            Every Lost Item Deserves a Safe Route Home.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/80 mb-8 max-w-2xl leading-relaxed">
            Eliminate chaotic messaging groups and lost notices. Connect directly to campus security desks,
            verify ownership with hidden cryptographic marks, and collect your possessions securely.
          </p>

          {/* Search bar & quick filter input */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by item name, tracking ID (CR-2026-...), or landmark..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white text-slate-900 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedBlock}
                onChange={(e) => onSelectBlock(e.target.value)}
                className="px-3 py-2.5 text-sm bg-white text-slate-800 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium cursor-pointer max-w-[240px]"
                aria-label="Filter by campus block"
              >
                <option value="all">All Campus Sectors (600 Acres)</option>
                <optgroup label="Academic Blocks">
                  {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Academic Blocks').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.shortName}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Central Amenities & Hubs">
                  {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Central Amenities').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.shortName}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Boys Hostels (BH-1 to BH-8)">
                  {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Boys Hostels').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.shortName}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Girls Hostels (GH-1 to GH-6)">
                  {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Girls Hostels').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.shortName}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Gates & Stadium">
                  {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Gates & Stadium').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.shortName}
                    </option>
                  ))}
                </optgroup>
              </select>

              <button
                onClick={onReportClick}
                className="px-4 py-2.5 text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm shadow-emerald-950/30 cursor-pointer"
              >
                <span>I Found an Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Metric Campus Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-emerald-900/60">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-300/70 font-semibold">Campus Scale</p>
            <p className="text-2xl font-black font-mono tabular-nums text-white mt-1">600 Acres</p>
            <p className="text-xs text-emerald-200/60 mt-0.5">Academic & Residential Quads</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-300/70 font-semibold">Custody Drop Desks</p>
            <p className="text-2xl font-black font-mono tabular-nums text-amber-400 mt-1">6 Physical Desks</p>
            <p className="text-xs text-emerald-200/60 mt-0.5">Manned by Security & Wardens</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-300/70 font-semibold">Return Success Rate</p>
            <p className="text-2xl font-black font-mono tabular-nums text-emerald-400 mt-1">84.6%</p>
            <p className="text-xs text-emerald-200/60 mt-0.5">Verified Ownership Handover</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-300/70 font-semibold">Turnaround Time</p>
            <p className="text-2xl font-black font-mono tabular-nums text-amber-300 mt-1">14.8 Hours</p>
            <p className="text-xs text-emerald-200/60 mt-0.5">Average Claim Resolution</p>
          </div>
        </div>
      </div>
    </section>
  );
};

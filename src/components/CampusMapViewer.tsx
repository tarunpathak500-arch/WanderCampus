import React, { useState } from 'react';
import { CAMPUS_BLOCKS, CampusBlockInfo } from '../campusData';
import { FoundItem, CampusBlock } from '../types';
import { MapPin, Navigation, Building2, Shield, Eye, Layers } from 'lucide-react';

interface CampusMapViewerProps {
  items: FoundItem[];
  selectedBlock: string;
  onSelectBlock: (block: string) => void;
  onViewItem?: (item: FoundItem) => void;
}

export const CampusMapViewer: React.FC<CampusMapViewerProps> = ({
  items,
  selectedBlock,
  onSelectBlock,
  onViewItem,
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<CampusBlockInfo | null>(null);
  const [activeGroup, setActiveGroup] = useState<
    'All' | 'Academic Blocks' | 'Central Amenities' | 'Boys Hostels' | 'Girls Hostels' | 'Gates & Stadium'
  >('All');

  // Calculate items count by block
  const countByBlock = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.found_location_block] = (acc[item.found_location_block] || 0) + 1;
    return acc;
  }, {});

  const displayedBlocks = activeGroup === 'All'
    ? CAMPUS_BLOCKS
    : CAMPUS_BLOCKS.filter((b) => b.categoryGroup === activeGroup);

  const currentActiveBlockInfo = CAMPUS_BLOCKS.find((b) => b.id === selectedBlock) || hoveredBlock || CAMPUS_BLOCKS[0];
  const itemsInActiveBlock = items.filter((i) => i.found_location_block === currentActiveBlockInfo.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Wander Campus Spatial Map
            </h2>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              600-Acre Campus Grid
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any academic block (B-34, B-38), Uni-Mall, hostel (BH/GH), or custody desk to filter items.
          </p>
        </div>

        {/* Group Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 self-start sm:self-auto overflow-x-auto">
          {(['All', 'Academic Blocks', 'Central Amenities', 'Boys Hostels', 'Girls Hostels', 'Gates & Stadium'] as const).map(
            (grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  activeGroup === grp ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                {grp}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Interactive SVG Campus Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 p-4 sm:p-6 bg-slate-950 relative flex items-center justify-center overflow-hidden">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* SVG Campus Geography Map */}
          <svg
            viewBox="0 0 1000 680"
            className="w-full h-auto max-h-[580px] drop-shadow-2xl select-none"
            aria-label="LPU 600-acre university map"
          >
            <defs>
              <linearGradient id="campusGrass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Campus Boundary: 600-Acre Perimeter */}
            <path
              d="M 120 70 Q 500 30 890 80 Q 950 340 910 600 Q 500 645 100 580 Q 60 290 120 70 Z"
              fill="url(#campusGrass)"
              stroke="#059669"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.75"
            />

            {/* Grand Trunk Road (GT Road Highway at South) */}
            <rect x="60" y="625" width="880" height="34" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="70" y1="642" x2="930" y2="642" stroke="#eab308" strokeWidth="2" strokeDasharray="14 12" />
            <text x="500" y="646" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold" letterSpacing="2">
              JALANDHAR - DELHI GRAND TRUNK ROAD (NH-44 / GT ROAD)
            </text>

            {/* University Ring Road & Internal Pathways */}
            <path
              d="M 180 130 Q 500 90 820 140 Q 860 370 820 530 Q 500 570 180 510 Q 140 320 180 130 Z"
              fill="none"
              stroke="url(#roadGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 180 130 Q 500 90 820 140 Q 860 370 820 530 Q 500 570 180 510 Q 140 320 180 130 Z"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeDasharray="10 10"
            />

            {/* Central Avenue boulevard crossing Gate 1 Northwards */}
            <path
              d="M 500 625 L 500 90"
              stroke="#334155"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Horizontal Boulevard linking east and west */}
            <path
              d="M 160 350 Q 500 370 840 350"
              stroke="#334155"
              strokeWidth="12"
            />

            {/* Unipolis Amphitheatre stage shape */}
            <circle cx="500" cy="540" r="26" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <text x="500" y="544" textAnchor="middle" fill="#c7d2fe" fontSize="8" fontWeight="bold">
              UNIPOLIS
            </text>

            {/* Water fountain / Lake mirror near Central Quad */}
            <ellipse cx="500" cy="400" rx="42" ry="22" fill="#0284c7" opacity="0.6" stroke="#38bdf8" strokeWidth="2" />
            <text x="500" y="404" textAnchor="middle" fill="#bae6fd" fontSize="8" fontWeight="600">
              CENTRAL FOUNTAIN
            </text>

            {/* Campus Compass / Scale */}
            <g transform="translate(880, 65)">
              <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <text x="0" y="-6" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">N</text>
              <polygon points="0,-16 4,-7 -4,-7" fill="#ef4444" />
              <polygon points="0,16 4,7 -4,7" fill="#94a3b8" />
              <text x="0" y="32" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">600 ACRES</text>
            </g>

            {/* Render Campus Blocks Markers */}
            {displayedBlocks.map((block) => {
              const svgX = (block.x / 100) * 1000;
              const svgY = (block.y / 100) * 680;
              const isSelected = selectedBlock === block.id;
              const isHovered = hoveredBlock?.id === block.id;
              const itemCount = countByBlock[block.id] || 0;

              let sectorColor = '#6366f1';
              if (block.sector === 'Academic') sectorColor = '#3b82f6';
              if (block.sector === 'Knowledge') sectorColor = '#8b5cf6';
              if (block.sector === 'Living') sectorColor = '#f59e0b';
              if (block.sector === 'Sports & Security') sectorColor = '#10b981';

              return (
                <g
                  key={block.id}
                  transform={`translate(${svgX}, ${svgY})`}
                  onClick={() => onSelectBlock(isSelected ? 'all' : block.id)}
                  onMouseEnter={() => setHoveredBlock(block)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{
                    transform: isSelected || isHovered ? `translate(${svgX}px, ${svgY}px) scale(1.15)` : `translate(${svgX}px, ${svgY}px) scale(1)`,
                    transformOrigin: 'center',
                  }}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="32"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Block Building Base Shape */}
                  <rect
                    x="-24"
                    y="-16"
                    width="48"
                    height="32"
                    rx="6"
                    fill={isSelected ? '#047857' : '#0f172a'}
                    stroke={isSelected ? '#6ee7b7' : sectorColor}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  />

                  {/* Block Code */}
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {block.code}
                  </text>

                  {/* Item counter */}
                  <rect
                    x="-14"
                    y="4"
                    width="28"
                    height="10"
                    rx="5"
                    fill={itemCount > 0 ? '#10b981' : '#334155'}
                  />
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                  >
                    {itemCount}
                  </text>

                  {/* Pin label below block */}
                  <text
                    x="0"
                    y="26"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="8.5"
                    fontWeight="600"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.85)' }}
                  >
                    {block.shortName.length > 18 ? block.code : block.shortName}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Map Legend */}
          <div className="absolute bottom-3 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 flex items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              <span>Academic (B-34, B-38, MSB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
              <span>Library & SDM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
              <span>Uni-Mall & Hostels</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Gate 1 & Security</span>
            </div>
          </div>
        </div>

        {/* Selected Sector & Custody Desk Detail Panel (4 Cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Campus Sector Details
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                {currentActiveBlockInfo.code}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                {currentActiveBlockInfo.categoryGroup}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {currentActiveBlockInfo.id}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentActiveBlockInfo.description}
              </p>
            </div>

            {/* Official Custody Desk for this block */}
            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Physical Custody Station</span>
              </div>
              <p className="text-xs font-medium text-slate-800">
                {currentActiveBlockInfo.custodyDesk}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Misplaced items from this location are securely deposited here for physical owner verification.
              </p>
            </div>

            {/* Hotspots in this block */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-700 mb-1.5">Common Discovery Hotspots</p>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentActiveBlockInfo.popularSpots.map((spot, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">·</span>
                    <span>{spot}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Items currently logged in this sector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                <span>Active Logged Items</span>
                <span className="font-mono text-emerald-700 font-bold">{itemsInActiveBlock.length} items</span>
              </div>

              {itemsInActiveBlock.length === 0 ? (
                <div className="p-3 text-center bg-white rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                  No active unclaimed items currently logged in this sector.
                </div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {itemsInActiveBlock.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {item.tracking_code} · {item.category}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize shrink-0 ${
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
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={() => onSelectBlock(selectedBlock === currentActiveBlockInfo.id ? 'all' : currentActiveBlockInfo.id)}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center ${
                selectedBlock === currentActiveBlockInfo.id
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
              }`}
            >
              {selectedBlock === currentActiveBlockInfo.id
                ? 'Clear Sector Filter'
                : `Filter Feed to ${currentActiveBlockInfo.shortName}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

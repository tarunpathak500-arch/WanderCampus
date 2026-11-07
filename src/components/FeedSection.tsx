import React, { useState } from 'react';
import { FoundItem, ItemCategory } from '../types';
import { CAMPUS_BLOCKS, ITEM_CATEGORIES } from '../campusData';
import {
  Search,
  Filter,
  MapPin,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  Tag,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface FeedSectionProps {
  items: FoundItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBlock: string;
  onSelectBlock: (b: string) => void;
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  selectedStatus: string;
  onSelectStatus: (s: string) => void;
  onViewItem: (item: FoundItem) => void;
  onClaimItem: (item: FoundItem) => void;
  onOpenReportModal: () => void;
}

export const FeedSection: React.FC<FeedSectionProps> = ({
  items,
  loading,
  searchQuery,
  onSearchChange,
  selectedBlock,
  onSelectBlock,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  onViewItem,
  onClaimItem,
  onOpenReportModal,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search and Category Quick Filters */}
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search catalog by title, tracking ID, room..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium cursor-pointer"
              aria-label="Filter by item category"
            >
              <option value="all">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedBlock}
              onChange={(e) => onSelectBlock(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium cursor-pointer max-w-[220px]"
              aria-label="Filter by campus block"
            >
              <option value="all">All LPU Campus Sectors (600 Acres)</option>
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
          </div>

          {/* Status Tabs and View Mode */}
          <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            {/* Status Segmented Controls */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 overflow-x-auto">
              <button
                onClick={() => onSelectStatus('all')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedStatus === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => onSelectStatus('unclaimed')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedStatus === 'unclaimed' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                In Custody
              </button>
              <button
                onClick={() => onSelectStatus('claim_pending')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedStatus === 'claim_pending' ? 'bg-white text-amber-700 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Under Review
              </button>
              <button
                onClick={() => onSelectStatus('returned')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  selectedStatus === 'returned' ? 'bg-white text-slate-700 font-semibold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Returned
              </button>
            </div>

            {/* Grid / List switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-slate-500">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-700'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-700'}`}
                title="List view"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Results Count & Reset Filter Strip */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
        <div>
          <span>Showing </span>
          <strong className="text-slate-800 font-mono tabular-nums">{items.length}</strong>
          <span> items discovered across campus</span>
          {selectedBlock !== 'all' && (
            <span className="ml-1.5 text-emerald-700 font-semibold">in {selectedBlock}</span>
          )}
        </div>

        {(searchQuery || selectedBlock !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              onSearchChange('');
              onSelectBlock('all');
              onSelectCategory('all');
              onSelectStatus('all');
            }}
            className="text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No items found</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            We couldn't find any lost items matching your current search or sector filter.
            Try resetting your filters or report an item you recently discovered.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                onSearchChange('');
                onSelectBlock('all');
                onSelectCategory('all');
                onSelectStatus('all');
              }}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Report a Found Item
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const isUnclaimed = item.status === 'unclaimed';
            const isPending = item.status === 'claim_pending';
            const isReturned = item.status === 'returned';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Item Image with Fallback and Tracking Badge */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50/50 text-slate-400 p-4 text-center">
                        <Tag className="w-8 h-8 text-emerald-400 mb-2" />
                        <span className="text-xs font-semibold text-slate-600">{item.category}</span>
                        <span className="text-[10px] text-slate-400">Desk Verified Record</span>
                      </div>
                    )}

                    {/* Tracking ID badge */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-white shadow-xs">
                      {item.tracking_code}
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs ${
                          isUnclaimed
                            ? 'bg-emerald-600/90 text-white'
                            : isPending
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-slate-700/90 text-slate-200'
                        }`}
                      >
                        {isUnclaimed ? 'Found · In Custody' : isPending ? 'Claim Under Review' : 'Claimed & Returned'}
                      </span>
                    </div>

                    {/* Sector location bar at bottom of image */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3 pt-6 text-white flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate font-medium">{item.found_location_block}</span>
                      </div>
                      <span className="font-mono text-slate-300 shrink-0 text-[10px]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                      <span className="font-bold text-emerald-700">{item.category}</span>
                      <span>·</span>
                      <span className="truncate">{item.found_location_details}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {item.additional_notes && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.additional_notes}
                      </p>
                    )}

                    {/* Custody Desk Anchor */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium" title={item.custody_desk_location}>
                          {item.custody_desk_location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onViewItem(item)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>

                  {isUnclaimed && (
                    <button
                      onClick={() => onClaimItem(item)}
                      className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      This is Mine
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isPending && (
                    <button
                      disabled
                      className="flex-1 py-2 px-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium cursor-default"
                    >
                      Under Review
                    </button>
                  )}

                  {isReturned && (
                    <button
                      disabled
                      className="flex-1 py-2 px-3 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg text-xs font-medium cursor-default"
                    >
                      Returned
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                    {item.category.slice(0, 3)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {item.tracking_code}
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">{item.category}</span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500">{item.found_location_block}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {item.found_location_details} · Held at: <span className="font-medium text-slate-700">{item.custody_desk_location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md capitalize ${
                    item.status === 'unclaimed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'claim_pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>

                <button
                  onClick={() => onViewItem(item)}
                  className="py-1.5 px-3 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Details
                </button>

                {item.status === 'unclaimed' && (
                  <button
                    onClick={() => onClaimItem(item)}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    Claim Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

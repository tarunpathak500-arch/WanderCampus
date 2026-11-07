import React from 'react';
import { CampusStats } from '../types';
import { resetCampusDatabase } from '../services/api';
import {
  TrendingUp,
  Shield,
  Clock,
  RotateCcw,
  CheckCircle2,
  Building,
  Layers,
  PieChart,
} from 'lucide-react';

interface AnalyticsSectionProps {
  stats: CampusStats | null;
  onRefresh: () => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ stats, onRefresh }) => {
  const [resetting, setResetting] = React.useState(false);

  const handleResetData = async () => {
    if (!confirm('Reset campus lost & found database to default seed data?')) return;
    try {
      setResetting(true);
      await resetCampusDatabase();
      onRefresh();
      alert('Campus database successfully reset to clean 600-acre demo data!');
    } catch (e: any) {
      alert(e.message || 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  if (!stats) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            600-Acre Campus Recovery Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics on item discovery density, recovery rates, and security custody response times.
          </p>
        </div>

        <button
          onClick={handleResetData}
          disabled={resetting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors shadow-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          Reset Demo Data
        </button>
      </div>

      {/* 4 Stat KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Logged Items
          </span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
            {stats.total_reported}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Across 10 campus blocks</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Recovery Rate
          </span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-emerald-600">
            {stats.recovery_rate_percent}%
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Verified owner restitution</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Claims Pending
          </span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-amber-600">
            {stats.claims_pending}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Under security review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Turnaround
          </span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
            {stats.avg_resolution_hours}h
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Report-to-handover time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campus Block Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              Misplaced Item Distribution by Sector
            </h3>
            <span className="text-[11px] font-mono text-slate-400">600 Acres Density</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.by_block).map(([blockName, count]) => {
              const pct = stats.total_reported > 0 ? Math.round((count / stats.total_reported) * 100) : 0;
              return (
                <div key={blockName} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{blockName}</span>
                    <span className="font-mono text-slate-500">
                      {count} {count === 1 ? 'item' : 'items'} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown & Custody Security Matrix */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Category Incidence Frequency
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Item Classes</span>
            </div>

            <div className="space-y-3">
              {Object.entries(stats.by_category).map(([catName, count]) => {
                const pct = stats.total_reported > 0 ? Math.round((count / stats.total_reported) * 100) : 0;
                return (
                  <div key={catName} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">{catName}</span>
                      <span className="font-mono text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custody Desks Status */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Custody Chain Security Assurance
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">All 6 Desks Active</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every found item is tagged with a physical tracking code, secured in a locked locker at the designated drop-off desk, and released only upon biometric ID match and secret mark confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

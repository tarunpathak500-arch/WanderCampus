import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Plus, ChevronDown } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  currentTab: 'feed' | 'report' | 'map' | 'claims' | 'admin' | 'analytics';
  onSelectTab: (tab: 'feed' | 'report' | 'map' | 'claims' | 'admin' | 'analytics') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="w-full bg-white border-b border-emerald-900/10 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Wander Campus Logo with Golden Compass Badge */}
          <button
            onClick={() => onSelectTab('feed')}
            className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md cursor-pointer"
            aria-label="Wander Campus Home"
          >
            <AppLogo size="sm" variant="light" subtitle="600-Acre Recovery Portal" />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onSelectTab('feed')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                currentTab === 'feed' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : ''
              }`}
            >
              Found Items Feed
            </button>
            <button
              onClick={() => onSelectTab('map')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                currentTab === 'map' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : ''
              }`}
            >
              600-Acre Map
            </button>
            {user?.role === 'admin' ? (
              <button
                onClick={() => onSelectTab('admin')}
                className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'admin' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Security Desk
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('claims')}
                className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  currentTab === 'claims' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : ''
                }`}
              >
                My Claims
              </button>
            )}
            <button
              onClick={() => onSelectTab('analytics')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                currentTab === 'analytics' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : ''
              }`}
            >
              Campus Stats
            </button>
          </nav>

          {/* Zone 3: Primary action & User Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('report')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] rounded-xl transition-all shadow-sm shadow-emerald-900/15 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Report Found Item
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 text-xs border border-slate-200 rounded-xl hover:border-emerald-300 bg-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 whitespace-nowrap shrink-0 cursor-pointer"
                  aria-expanded={showUserMenu}
                  aria-label="User profile menu"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white bg-emerald-700 shadow-2xs">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="font-bold text-slate-800 leading-none truncate max-w-[120px]">
                      {user.full_name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-800 leading-none mt-0.5">
                      {user.registration_number}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                        <span>{user.registration_number}</span>
                        <span>·</span>
                        <span className="capitalize font-sans font-bold text-emerald-700">{user.role}</span>
                      </div>
                    </div>

                    <div className="px-3.5 py-2.5 bg-emerald-50/60 border-b border-emerald-100 text-xs">
                      <p className="text-[10.5px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                        Department / Facility
                      </p>
                      <p className="text-slate-800 font-medium text-[11.5px] leading-snug">
                        {user.department || (user.role === 'admin' ? 'Campus Security & Vigilance' : 'Student Body')}
                      </p>
                      <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Portal Clearance:</span>
                        <span className="font-bold text-emerald-800">
                          {user.role === 'admin' ? 'Administrator' : 'Student Access'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 px-2 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          onOpenAuth();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50/90 px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 overflow-x-auto">
        <button
          onClick={() => onSelectTab('feed')}
          className={`px-2.5 py-1 whitespace-nowrap rounded-lg ${currentTab === 'feed' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : ''}`}
        >
          Feed
        </button>
        <button
          onClick={() => onSelectTab('report')}
          className={`px-2.5 py-1 whitespace-nowrap rounded-lg ${currentTab === 'report' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : ''}`}
        >
          + Report
        </button>
        <button
          onClick={() => onSelectTab('map')}
          className={`px-2.5 py-1 whitespace-nowrap rounded-lg ${currentTab === 'map' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : ''}`}
        >
          600-Acre Map
        </button>
        {user?.role === 'admin' ? (
          <button
            onClick={() => onSelectTab('admin')}
            className={`px-2.5 py-1 whitespace-nowrap rounded-lg ${currentTab === 'admin' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : ''}`}
          >
            Admin Desk
          </button>
        ) : (
          <button
            onClick={() => onSelectTab('claims')}
            className={`px-2.5 py-1 whitespace-nowrap rounded-lg ${currentTab === 'claims' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : ''}`}
          >
            My Claims
          </button>
        )}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`px-2.5 py-1 whitespace-nowrap rounded-lg ${currentTab === 'analytics' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : ''}`}
        >
          Stats
        </button>
      </div>
    </header>
  );
};

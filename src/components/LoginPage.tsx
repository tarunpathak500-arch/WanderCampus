import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Building2,
  KeyRound,
  GraduationCap,
  Mail,
  Phone,
  UserPlus,
  LogIn,
  Info,
} from 'lucide-react';
import { CAMPUS_BLOCKS } from '../campusData';
import { AppLogo } from './AppLogo';

interface LoginPageProps {
  onContinueAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onContinueAsGuest }) => {
  const { login, register } = useAuth();

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loginRegNo, setLoginRegNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDepartment, setRegDepartment] = useState(CAMPUS_BLOCKS[0].id);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleRoleChange = (newRole: 'student' | 'admin') => {
    setRole(newRole);
    setError(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanReg = loginRegNo.trim();
    if (!cleanReg) {
      setError('Please provide your University Registration Number or Employee ID.');
      return;
    }

    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(cleanReg, loginPassword, role);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please verify your Registration Number and Password.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!regFullName.trim()) {
      setError('Please enter your full name as printed on your university ID.');
      return;
    }

    const cleanReg = regNumber.trim().toUpperCase();
    if (!cleanReg || cleanReg.length < 4) {
      setError('Please enter a valid university registration number (at least 4 characters).');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please provide a valid university email address (e.g. name@lpu.in).');
      return;
    }

    if (!regPhone.trim()) {
      setError('Please provide an active mobile contact number.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        full_name: regFullName.trim(),
        registration_number: cleanReg,
        email: regEmail.trim().toLowerCase(),
        phone_number: regPhone.trim(),
        department: regDepartment,
        password: regPassword,
      });

      if (!res.success) {
        setError(res.error || 'Registration failed. Please check your information.');
      } else {
        setSuccessMessage('Student account created successfully! You are now logged in.');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Brand Bar featuring Wander Campus Emblem */}
      <header className="bg-white border-b border-emerald-900/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs z-20">
        <AppLogo size="sm" variant="light" subtitle="600-Acre Campus Recovery Portal" />

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Phagwara, Punjab (GT Road)</span>
          </div>

          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-bold text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 bg-white px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Split-Screen Desktop Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left Side: Campus Visual Showcase with Deep Forest Green Theme */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#0d2b20] text-white flex-col justify-between p-10 xl:p-12 overflow-hidden border-r border-emerald-900/40">
          {/* Background Aerial Campus Photography */}
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/hero_campus_aerial_1794051803068.jpg"
              alt="600-Acre Campus Aerial View"
              className="w-full h-full object-cover opacity-25 scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Measured forest green scrim matching Wander Campus brand */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a231a] via-[#0d2b20]/90 to-[#0a231a]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0d2b20]/40 to-[#0a231a]/95" />
          </div>

          {/* Top Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-600/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 mb-6 backdrop-blur-xs shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Wander Campus · 600-Acre Unified Recovery Network</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              One Unified Recovery Portal for 35,000+ Students & Staff.
            </h2>

            <p className="text-sm text-emerald-100/80 mt-4 leading-relaxed max-w-md">
              Replacing fragmented messaging groups and lost notices. Connect directly to designated campus custody desks,
              verify ownership with hidden cryptographic marks, and collect your possessions securely.
            </p>
          </div>

          {/* Middle: 600-Acre Key Highlights */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-emerald-100">
              <div className="flex items-center gap-2.5 font-bold text-white mb-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Physical Custody Drop Desks</span>
              </div>
              <p className="text-emerald-200/80 leading-relaxed text-[11.5px]">
                Main Gate 1 Control Room, Block 34 Helpdesk, Uni-Mall Security, Central Library (Block 13/14), and Warden Offices (BH-1 to BH-8 & GH-1 to GH-6).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-emerald-100">
              <div className="flex items-center gap-2.5 font-bold text-white mb-1.5 text-sm">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Protected Ownership Proof</span>
              </div>
              <p className="text-emerald-200/80 leading-relaxed text-[11.5px]">
                Hidden distinguishing marks (cash denominations, lock screen wallpapers, custom engravings) protect genuine item ownership from fraudulent claims.
              </p>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 pt-4 border-t border-emerald-900/60 flex items-center justify-between text-xs text-emerald-300/70 font-mono">
            <span>Campus SSO Protected</span>
            <span>Wander Campus Portal</span>
          </div>
        </div>

        {/* Right Side: Clean Centered Login & Registration Card (7 Cols on Desktop) */}
        <div className="lg:col-span-7 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-slate-50/80">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 p-6 sm:p-8 relative">
            {/* Center Header with Wander Campus Emblem */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-amber-400 via-emerald-600 to-emerald-950 shadow-lg shadow-emerald-950/25 ring-2 ring-amber-400/50 mb-3">
                <img
                  src="/assets/aistudio/logo_958dd360.png"
                  alt="Wander Campus Emblem"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Wander Campus
              </h2>
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                Unified Lost & Found Portal · 600-Acre Campus
              </p>
            </div>

            {/* Mode Selector Tabs (Sign In vs Create Student Account) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-emerald-700" />
                <span>Create Student Account</span>
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ================= SIGN IN MODE ================= */}
            {authMode === 'login' ? (
              <div>
                {/* Role Toggle Tabs */}
                <div className="grid grid-cols-2 p-1 bg-slate-50 border border-slate-200 rounded-xl mb-5 text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-emerald-800 shadow-xs border border-emerald-100 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>Student / Scholar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'admin'
                        ? 'bg-white text-emerald-800 shadow-xs border border-emerald-100 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Security / Admin</span>
                  </button>
                </div>

                {/* Main Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {role === 'admin' ? 'Security Officer ID / Admin ID' : 'University Registration Number'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginRegNo}
                        onChange={(e) => setLoginRegNo(e.target.value)}
                        placeholder={role === 'admin' ? 'ADM-SEC-091' : '12314567'}
                        className="w-full pl-10 pr-3 py-2.5 text-xs font-mono font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 bg-white"
                      />
                    </div>
                    <p className="text-[10.5px] text-slate-400 mt-1">
                      {role === 'admin'
                        ? 'Enter designated Security Badge ID (e.g. ADM-SEC-091)'
                        : 'Enter your 8-digit student registration number'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your confidential password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium text-slate-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                      />
                      <span>Remember registration ID</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer text-[11px] flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      <span>{showDemoCredentials ? 'Hide ID guide' : 'View registered test IDs'}</span>
                    </button>
                  </div>

                  {/* Informational box showing registered IDs & distinct passwords */}
                  {showDemoCredentials && (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-[11px] text-slate-600 space-y-1.5 animate-in fade-in duration-150">
                      <div className="font-bold text-emerald-900 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pre-Registered Accounts (Individual Passwords):</span>
                      </div>
                      <div className="space-y-1 pt-1 font-mono text-[10.5px]">
                        <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-100">
                          <span>Student 1: <strong>12314567</strong></span>
                          <span className="text-emerald-800">Pass: <strong>Tarun@123</strong></span>
                        </div>
                        <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-100">
                          <span>Student 2: <strong>12317890</strong></span>
                          <span className="text-emerald-800">Pass: <strong>Ananya@123</strong></span>
                        </div>
                        <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-100">
                          <span>Security Admin: <strong>ADM-SEC-091</strong></span>
                          <span className="text-amber-800">Pass: <strong>Admin@Gate1</strong></span>
                        </div>
                        <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-100">
                          <span>BH Warden: <strong>ADM-SEC-104</strong></span>
                          <span className="text-amber-800">Pass: <strong>Warden@BH3</strong></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/20 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Authenticating with Wander Campus...' : `Sign In as ${role === 'admin' ? 'Security Officer' : 'Student'}`}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Switch to Register footer */}
                <div className="mt-5 text-center">
                  <p className="text-xs text-slate-500">
                    Are you a new student on campus?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setError(null);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Create a Student Account</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* ================= CREATE ACCOUNT MODE ================= */
              <div>
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Student Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Rohit Kumar Verma"
                        className="w-full pl-10 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        required
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        placeholder="e.g. 12319045"
                        className="w-full px-3 py-2 text-xs font-mono font-semibold uppercase border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        University Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="student@lpu.in"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98765 00000"
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Academic Block / Faculty
                      </label>
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value as any)}
                        className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-800 bg-white"
                      >
                        {CAMPUS_BLOCKS.filter((b) => b.categoryGroup === 'Academic Blocks').map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.shortName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password (min 6 chars)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegConfirmPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-400">
                    By creating an account, you register with Wander Campus and can report found items or submit proof of ownership for claims.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/20 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Creating University Account...' : 'Register Student Account & Access Portal'}
                    <UserPlus className="w-4 h-4" />
                  </button>
                </form>

                {/* Switch back to Login */}
                <div className="mt-5 text-center">
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setError(null);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Sign In with ID & Password</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* University Portal Security Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Encrypted Portal SSO</span>
              </span>
              <span>Wander Campus · Security & Welfare</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

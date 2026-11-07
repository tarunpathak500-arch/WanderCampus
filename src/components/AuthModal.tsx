import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Eye,
  EyeOff,
  Shield,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { CAMPUS_BLOCKS } from '../campusData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'admin'>('student');

  // Login
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register
  const [fullName, setFullName] = useState('');
  const [regId, setRegId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dept, setDept] = useState(CAMPUS_BLOCKS[0].id);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) {
      setError('Please provide your university registration number or employee ID.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(regNo.trim(), password, role);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !regId.trim() || !email.trim() || !phone.trim() || !newPassword) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await register({
        full_name: fullName.trim(),
        registration_number: regId.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        phone_number: phone.trim(),
        department: dept,
        password: newPassword,
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-150">
        {/* Left Wander Campus Branding Panel (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0a231a] via-[#0d2b20] to-slate-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-emerald-900/30">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-amber-400 via-emerald-600 to-emerald-950 shadow-md ring-1 ring-amber-400/50 mb-4">
              <img
                src="/assets/aistudio/logo_958dd360.png"
                alt="Wander Campus Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-black tracking-tight uppercase">
              Wander Campus
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
              Official Single Sign-On for students, faculty, and campus security desks.
            </p>
          </div>

          <div className="relative z-10 my-6 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Biometric & ID Verified Handover</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Confidential Distinguishing Marks</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>600-Acre Campus Custody Desks</span>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-emerald-400/70 font-mono">
            Security Control Protocol v1.0
          </div>
        </div>

        {/* Right Authentication Form Panel (7 Cols) */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                {mode === 'login' ? 'Sign in to Wander Campus' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'login'
                  ? 'Authenticate with your university registration ID and password.'
                  : 'Register your details to claim items or report found belongings.'}
              </p>
            </div>

            {/* Mode switch */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Role Tabs */}
                <div className="grid grid-cols-2 p-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      role === 'student' ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-emerald-100' : 'text-slate-600'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      role === 'admin' ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-emerald-100' : 'text-slate-600'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    Security Admin
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'admin' ? 'Security ID' : 'Registration Number'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder={role === 'admin' ? 'ADM-SEC-091' : '12314567'}
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Authenticating...' : `Sign In as ${role === 'admin' ? 'Security Admin' : 'Student'}`}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">
                      Registration No.
                    </label>
                    <input
                      type="text"
                      required
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      placeholder="12319080"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold uppercase border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">
                    University Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@lpu.in"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">
                      Password (min 6)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-2.5 pr-7 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Register & Sign In'}
                  <UserPlus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

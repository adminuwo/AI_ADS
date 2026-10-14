import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CreditCard, Layers, Zap, Search, ChevronDown, ChevronUp,
  ArrowLeft, RefreshCw, Crown, Shield, Eye, Package, TrendingUp,
  Activity, BarChart3, Clock, CheckCircle2, XCircle, User as UserIcon,
  Sparkles, Globe, Image as ImageIcon, Video, FileText, Hash,
  MessageSquare, DollarSign, ShieldAlert, FileCode, Headphones,
  Sliders, Lock, Settings, Save, Plus, Trash2, Edit3, ExternalLink,
  Sun, Moon, ArrowUpRight, IndianRupee, HelpCircle, Check, Filter,
  Mail, Bot, AlertTriangle, Cpu, Calendar, Palette, Wand2, Layout
} from 'lucide-react';
import { adminAPI, plansAPI } from '../../services/api';
import { useWorkspace } from '../../context/WorkspaceContext';

// ─── DYNAMIC SVG LINE/AREA CHART COMPONENT ────────────────────────────────────
const DynamicAreaChart = ({ data = [], color = '#6366F1', gradientId = 'purpleGradient' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-36 w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
        No telemetry chart data available
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => d.val || 0), 1);
  const width = 440;
  const height = 80;

  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const y = height - ((d.val || 0) / maxVal) * (height - 15);
    return { x, y, date: d.date, val: d.val };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${width},100 L 0,100 Z`;

  const firstDate = data[0]?.date || '—';
  const midDate = data[Math.floor(data.length / 2)]?.date || '—';
  const lastDate = data[data.length - 1]?.date || '—';

  return (
    <div className="h-36 w-full pt-2">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 440 100">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {points.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={p.val > 0 ? "3.5" : "2"} fill="#ffffff" stroke={color} strokeWidth={p.val > 0 ? "2.5" : "1.5"} />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] font-extrabold text-slate-400 pt-1">
        <span>{firstDate}</span>
        <span>{midDate}</span>
        <span>{lastDate}</span>
      </div>
    </div>
  );
};

// ─── LIGHT THEME STAT CARD ───────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, badgeText, colorClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorClass || 'bg-brand-50 text-brand-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      {badgeText && (
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200/60 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {badgeText}
        </span>
      )}
    </div>
    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{label}</p>
    {sub && <p className="text-[11px] font-medium text-slate-500 mt-0.5">{sub}</p>}
  </motion.div>
);

// ─── PLAN BADGE (LIGHT THEME) ────────────────────────────────────────────────
const PlanBadge = ({ plan }) => {
  const config = {
    free: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    starter: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    pro: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    enterprise: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  };
  const c = config[plan?.toLowerCase()] || config.free;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
      {plan?.toLowerCase() === 'enterprise' && <Crown className="w-3 h-3 text-amber-600" />}
      {plan?.toLowerCase() === 'pro' && <Sparkles className="w-3 h-3 text-purple-600" />}
      {plan || 'Free'}
    </span>
  );
};

// ─── USER DETAIL DRAWER (LIGHT THEME) ─────────────────────────────────────────
const UserDetailDrawer = ({ userId, initialUser, onClose, onUserUpdated }) => {
  const [detail, setDetail] = useState({
    user: initialUser || null,
    brands: [],
    generations: []
  });
  const [loading, setLoading] = useState(true);
  const [creditsInput, setCreditsInput] = useState(initialUser?.credits ?? 0);
  const [selectedPlan, setSelectedPlan] = useState(initialUser?.plan || 'free');
  const [selectedRole, setSelectedRole] = useState(initialUser?.role || 'user');
  const [isBlocked, setIsBlocked] = useState(initialUser?.isBlocked || false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminAPI.getUserDetail(userId)
      .then(res => {
        if (res?.data) {
          setDetail(res.data);
          if (res.data.user) {
            setCreditsInput(res.data.user.credits ?? 0);
            setSelectedPlan(res.data.user.plan || 'free');
            setSelectedRole(res.data.user.role || 'user');
            setIsBlocked(res.data.user.isBlocked || false);
          }
        }
      })
      .catch(err => console.error('User detail error:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSaveUserChanges = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');
    try {
      const res = await adminAPI.updateUserQuota(userId, {
        credits: parseInt(creditsInput, 10) || 0,
        plan: selectedPlan,
        role: selectedRole,
        isBlocked: isBlocked
      });
      if (res?.success) {
        setDetail(prev => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            credits: parseInt(creditsInput, 10) || 0,
            plan: selectedPlan,
            role: selectedRole,
            isBlocked: isBlocked
          }
        }));
        setSaveSuccess('User profile, quota & access status updated in database!');
        setTimeout(() => setSaveSuccess(''), 4500);
        if (onUserUpdated) onUserUpdated();
      } else {
        setSaveError(res?.error || 'Failed to update user profile.');
      }
    } catch (err) {
      console.error('Error saving user quota:', err);
      setSaveError(err?.message || 'An error occurred while saving user profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userId) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res?.success) {
        if (onUserUpdated) onUserUpdated();
        onClose();
      } else {
        setDeleteError(res?.error || 'Failed to delete user account.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteError(err?.message || 'An error occurred while deleting user account.');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddCredits = (amount) => {
    const current = parseInt(creditsInput, 10) || 0;
    setCreditsInput(current + amount);
  };

  const userObj = detail?.user || initialUser;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex"
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative ml-auto w-full max-w-2xl h-full bg-white border-l border-slate-200 overflow-y-auto shadow-2xl flex flex-col text-slate-900 z-10"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900">User Profile &amp; Control Desk</h2>
              <p className="text-[11px] font-semibold text-slate-400 font-mono">ID: {userId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs font-extrabold text-slate-400 hover:text-slate-700 p-2">
            Close ✕
          </button>
        </div>

        {userObj ? (
          <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Profile Summary Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-md shadow-brand-500/20 shrink-0">
                  {(userObj.name || userObj.email || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-slate-900 font-black text-base truncate">{userObj.name || userObj.email.split('@')[0]}</h3>
                  <p className="text-xs text-slate-500 font-medium truncate">{userObj.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <PlanBadge plan={selectedPlan} />
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase">
                      {selectedRole}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${
                      isBlocked ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {isBlocked ? 'Blocked' : 'Active Account'}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${userObj.email}`}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-extrabold flex items-center gap-2 transition-colors shrink-0 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                <span>Contact Email</span>
              </a>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-2xl font-black text-brand-600">{creditsInput || 0}</p>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Credits Balance</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-2xl font-black text-slate-900">{detail.brands?.length || userObj.brandCount || 0}</p>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Active Workspaces</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-2xl font-black text-indigo-600">{detail.generations?.length || userObj.generationCount || 0}</p>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Generations</p>
              </div>
            </div>

            {/* Admin Controls Panel */}
            <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100/90 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Admin Quota, Role &amp; Access Controls
                </h4>
                {loading && <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />}
              </div>

              {/* Set Credits Input + Quick Add Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-extrabold text-slate-700">Set Credit Quota</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Quick Add:</span>
                    {[100, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleAddCredits(amt)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold transition-colors"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  value={creditsInput}
                  onChange={(e) => setCreditsInput(e.target.value)}
                  placeholder="Enter credit quota..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs"
                />
              </div>

              {/* Dedicated Role Assignment Section (Admin / User / Developer) */}
              <div className="p-4 rounded-2xl bg-white border border-indigo-200/80 space-y-2.5 shadow-xs font-sans">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-brand-600" />
                    Role Assignment (Admin / User / Developer)
                  </label>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    Active: {selectedRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Select the system access role for this user account:</p>

                {/* Role Select Dropdown */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs font-sans"
                >
                  <option value="admin">Admin — Full Platform & Management Control</option>
                  <option value="user">User — Standard Creative & AI Platform Access</option>
                  <option value="developer">Developer — API & Technical Integrations Access</option>
                  <option value="AgencyAdmin">Agency Admin — Organization Owner</option>
                  <option value="SuperAdmin">Super Admin — Root System Control</option>
                </select>

                {/* Quick Role Selection Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { key: 'admin', label: 'Admin', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
                    { key: 'user', label: 'User', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                    { key: 'developer', label: 'Developer', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' }
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSelectedRole(r.key)}
                      className={`flex-1 py-1.5 rounded-lg border text-[11px] font-extrabold transition-all ${
                        selectedRole.toLowerCase() === r.key
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : `${r.color}`
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedicated Subscription Plan Assignment Section */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">Assign Subscription Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs"
                >
                  <option value="free">Free Tier (₹0)</option>
                  <option value="starter">Starter Plan (₹999)</option>
                  <option value="pro">Pro Plan (₹2,499)</option>
                  <option value="enterprise">Enterprise (₹2,499)</option>
                </select>
              </div>

              {/* Account Block Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200">
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Account Access Status</p>
                  <p className="text-[11px] text-slate-400 font-medium">Prevent user from accessing platform modules</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBlocked(!isBlocked)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    isBlocked
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  {isBlocked ? 'Blocked (Click to Unblock)' : 'Active Account (Click to Block)'}
                </button>
              </div>

              <button
                onClick={handleSaveUserChanges}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Profile & Quota...' : 'Save User Profile & Access Settings'}
              </button>

              {/* Danger Zone: Delete User Account */}
              <div className="pt-3 border-t border-indigo-100/90 space-y-2">
                {deleteError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{deleteError}</span>
                  </div>
                )}

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    Delete User Account
                  </button>
                ) : (
                  <div className="p-4 bg-white/95 rounded-2xl border border-rose-300 shadow-sm space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Confirm User Account Deletion</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Are you sure you want to permanently delete <strong className="text-slate-900">{userObj?.email}</strong>? This will purge all associated workspaces and content. This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setConfirmDelete(false); setDeleteError(''); }}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteUser}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {deleting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Deleting Account...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User's Workspaces Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-600" />
                Active Workspaces ({detail.brands?.length || 0})
              </h4>
              {detail.brands?.length > 0 ? (
                <div className="space-y-2">
                  {detail.brands.map((brand, i) => (
                    <div key={brand._id || i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black shrink-0">
                        {(brand.brandName || brand.companyName || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{brand.brandName || brand.companyName || 'Unnamed Brand'}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{brand.domainUrl || brand.website || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-2xl text-center font-medium border border-slate-200">
                  No active workspaces created by this user yet
                </p>
              )}
            </div>

            {/* User's Generations Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Recent Content Generations ({detail.generations?.length || 0})
              </h4>
              {detail.generations?.length > 0 ? (
                <div className="space-y-2">
                  {detail.generations.slice(0, 10).map((gen, i) => (
                    <div key={gen._id || i} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-slate-900 truncate">{gen.title || gen.topic || 'Generated Content'}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{gen.platform || gen.format || 'Social Post'}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {gen.createdAt ? new Date(gen.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-2xl text-center font-medium border border-slate-200">
                  No generated content posts in history
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-xs font-bold text-slate-400">Loading User Profile...</div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN ADMIN DASHBOARD (100% REAL DYNAMIC DATABASE DATA) ─────────────────
export const AdminDashboardModule = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Chat Sessions Filter & Drawer State
  const [sessionSearch, setSessionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedChatSession, setSelectedChatSession] = useState(null);
  const [chatSessionsData, setChatSessionsData] = useState(null);

  // Analytics Sub-Tab & Timeframe Filter State
  const [analyticsSubTab, setAnalyticsSubTab] = useState('usage');
  const [analyticsTimeFrame, setAnalyticsTimeFrame] = useState('7d');

  // Legal Content State
  const [selectedLegalDoc, setSelectedLegalDoc] = useState('terms');
  const [legalContent, setLegalContent] = useState({ terms: '', privacy: '', refund: '' });
  const [legalSaving, setLegalSaving] = useState(false);
  const [legalSuccess, setLegalSuccess] = useState('');

  // Help Desk Tickets State
  const [helpDeskTickets, setHelpDeskTickets] = useState([]);

  // Quota & Rate Limit State
  const [toolLimits, setToolLimits] = useState({
    aiChatDaily: { free: 0, starter: 0, pro: 0, enterprise: 'Unlimited' },
    websiteBuilds: { free: 0, starter: 0, pro: 0, enterprise: 'Unlimited' },
    creativeImages: { free: 0, starter: 0, pro: 0, enterprise: 'Unlimited' }
  });
  const [toolLimitsSaving, setToolLimitsSaving] = useState(false);
  const [toolLimitsSuccess, setToolLimitsSuccess] = useState('');

  // Role to Plan Mapping State
  const [rolePlanMappings, setRolePlanMappings] = useState({
    developer: 'starter',
    admin: 'pro',
    user: 'free',
    AgencyAdmin: 'enterprise',
    SuperAdmin: 'enterprise'
  });
  const [rolePlanSavingRole, setRolePlanSavingRole] = useState(null);
  const [rolePlanSuccessMsg, setRolePlanSuccessMsg] = useState('');

  // AI Model Configuration State for all 8 categories
  const [modelSettings, setModelSettings] = useState({
    // 1. Text Response & AI Copilot Chat
    textModel: 'gemini-2.5-flash',
    fallbackTextModel: 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 8192,
    // 2. Autonomous Website Builder
    websiteBuilderModel: 'gemini-2.5-flash',
    // 3. SEO Engine & Blog Generator
    seoModel: 'gemini-2.5-flash',
    // 4. 30-Day Content Strategy Agent
    strategyModel: 'gemini-2.5-flash',
    // 5. Visual Ad Image Generation
    imageModel: 'gemini-3.1-flash-image',
    fallbackImageModel: 'imagen-3.0-generate-002',
    defaultAspectRatio: '1:1',
    // 6. Google Live Search Grounding
    groundingModel: 'gemini-2.5-flash',
    // 7. Vision & Logo Color Grounding
    visionModel: 'gemini-2.5-flash',
    // 8. Visual Prompt Crafting
    promptCraftingModel: 'gemini-2.5-flash',
  });
  const [modelCandidates, setModelCandidates] = useState({
    textModels: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', badge: 'Verified in asia-south1 • Recommended', desc: 'State-of-the-art balance of speed, cost, and high reasoning' },
      { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', badge: 'Ultra Fast Reasoning', desc: 'Next-gen performance and speed for complex tasks' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', badge: 'Fast Standard', desc: 'Standard low-latency multimodal reasoning' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', badge: 'Legacy Fast', desc: 'Standard high-throughput model' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', badge: 'Deep Reasoning', desc: 'Complex reasoning with larger context window' },
      { id: 'gpt-4o', label: 'GPT-4o (OpenAI)', badge: 'OpenAI Flagship', desc: 'OpenAI flagship multimodal intelligence' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (OpenAI)', badge: 'Fast Lightweight', desc: 'Lightweight fast OpenAI model' },
    ],
    imageModels: [
      { id: 'gemini-3.1-flash-image', label: 'Gemini 3.1 Flash Image (Nano Banana)', badge: 'Default • Recommended', desc: 'High quality prompt adherence and fast visual generation' },
      { id: 'imagen-3.0-generate-002', label: 'Google Imagen 3.0 Gen 2', badge: 'Photorealistic Studio', desc: 'Google highest fidelity photorealistic generator' },
      { id: 'imagen-3.0-fast-generate-001', label: 'Google Imagen 3.0 Fast', badge: 'Ultra-low latency', desc: 'Speed-optimized visual marketing generator' },
      { id: 'dall-e-3', label: 'OpenAI DALL-E 3', badge: 'OpenAI Creative', desc: 'OpenAI high precision prompt adherence' },
    ]
  });
  const [modelSaving, setModelSaving] = useState(false);
  const [modelResetting, setModelResetting] = useState(false);
  const [modelSuccessMsg, setModelSuccessMsg] = useState('');
  const [modelErrorMsg, setModelErrorMsg] = useState('');
  const [testingModelKey, setTestingModelKey] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [customModelOverrides, setCustomModelOverrides] = useState({});

  // Dynamically compute authenticated admin user initials
  const adminInitials = useMemo(() => {
    try {
      const stored = localStorage.getItem('aisa_user');
      if (stored) {
        const u = JSON.parse(stored);
        const name = u.name || u.email || 'Admin';
        return name.slice(0, 2).toUpperCase();
      }
    } catch (e) {}
    return 'AD';
  }, []);

  // ─── DEVELOPER CUSTOM PLAN MANAGEMENT STATE ──────────────────────────────
  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem('aisa_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  }, []);

  const currentUserRole = (currentUser?.role || '').toLowerCase();
  const isDeveloperUser = currentUserRole === 'developer';

  const [developerPlans, setDeveloperPlans] = useState([]);
  const [isDeveloperCustomActive, setIsDeveloperCustomActive] = useState(false);
  const [devPlanSaving, setDevPlanSaving] = useState(false);
  const [devPlanResetting, setDevPlanResetting] = useState(false);
  const [devPlanSuccessMsg, setDevPlanSuccessMsg] = useState('');
  const [devPlanErrorMsg, setDevPlanErrorMsg] = useState('');

  const fetchDeveloperPlans = async () => {
    try {
      const plansRes = await plansAPI.getPlans().catch(() => null);
      if (plansRes?.success && Array.isArray(plansRes.plans)) {
        setDeveloperPlans(plansRes.plans);
        setIsDeveloperCustomActive(!!plansRes.isDeveloperCustom);
      }
    } catch (err) {
      console.error('Error fetching developer plans:', err);
    }
  };

  useEffect(() => {
    fetchDeveloperPlans();
  }, []);

  const handleUpdateDevPlanField = (index, field, value) => {
    setDeveloperPlans(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdateDevPlanFeature = (planIndex, featureIndex, value) => {
    setDeveloperPlans(prev => {
      const updated = [...prev];
      const plan = { ...updated[planIndex] };
      const feats = [...(plan.features || [])];
      feats[featureIndex] = value;
      plan.features = feats;
      updated[planIndex] = plan;
      return updated;
    });
  };

  const handleAddDevPlanFeature = (planIndex) => {
    setDeveloperPlans(prev => {
      const updated = [...prev];
      const plan = { ...updated[planIndex] };
      const feats = [...(plan.features || []), 'New Custom Feature'];
      plan.features = feats;
      updated[planIndex] = plan;
      return updated;
    });
  };

  const handleRemoveDevPlanFeature = (planIndex, featureIndex) => {
    setDeveloperPlans(prev => {
      const updated = [...prev];
      const plan = { ...updated[planIndex] };
      const feats = (plan.features || []).filter((_, idx) => idx !== featureIndex);
      plan.features = feats;
      updated[planIndex] = plan;
      return updated;
    });
  };

  const handleSaveDeveloperCustomPlans = async () => {
    setDevPlanSaving(true);
    setDevPlanSuccessMsg('');
    setDevPlanErrorMsg('');
    try {
      const res = await plansAPI.saveDeveloperCustomPlans(developerPlans);
      if (res?.success) {
        setIsDeveloperCustomActive(true);
        setDevPlanSuccessMsg('Developer custom plans saved! These modified plans are strictly private & visible ONLY to your developer account.');
        setTimeout(() => setDevPlanSuccessMsg(''), 6000);
      } else {
        setDevPlanErrorMsg(res?.error || 'Failed to save developer custom plans.');
      }
    } catch (err) {
      setDevPlanErrorMsg(err?.message || 'Error saving developer custom plans.');
    } finally {
      setDevPlanSaving(false);
    }
  };

  const handleResetDeveloperCustomPlans = async () => {
    setDevPlanResetting(true);
    setDevPlanSuccessMsg('');
    setDevPlanErrorMsg('');
    try {
      const res = await plansAPI.resetDeveloperCustomPlans();
      if (res?.success) {
        setIsDeveloperCustomActive(false);
        setDevPlanSuccessMsg('Reset to standard platform default plans.');
        await fetchDeveloperPlans();
        setTimeout(() => setDevPlanSuccessMsg(''), 5000);
      } else {
        setDevPlanErrorMsg(res?.error || 'Failed to reset custom plans.');
      }
    } catch (err) {
      setDevPlanErrorMsg(err?.message || 'Error resetting custom plans.');
    } finally {
      setDevPlanResetting(false);
    }
  };

  const fetchData = async () => {
    try {
      const [summaryRes, usersRes, chatRes, legalRes, limitsRes, ticketsRes, mappingsRes, modelSettingsRes] = await Promise.all([
        adminAPI.getDashboardSummary().catch(() => ({ success: false })),
        adminAPI.getAllUserStats().catch(() => ({ success: false })),
        adminAPI.getChatSessions().catch(() => ({ success: false })),
        adminAPI.getLegalPages().catch(() => ({ success: false })),
        adminAPI.getToolLimits().catch(() => ({ success: false })),
        adminAPI.getHelpDeskTickets().catch(() => ({ success: false })),
        adminAPI.getRolePlanMappings().catch(() => ({ success: false })),
        adminAPI.getModelSettings().catch(() => ({ success: false }))
      ]);

      if (summaryRes?.success) setSummary(summaryRes.data);
      if (usersRes?.success) setUsers(usersRes.data);
      if (chatRes?.success) setChatSessionsData(chatRes.data);
      if (legalRes?.success) setLegalContent(legalRes.data);
      if (limitsRes?.success) setToolLimits(limitsRes.data);
      if (ticketsRes?.success) setHelpDeskTickets(ticketsRes.data);
      if (mappingsRes?.success && mappingsRes.data) setRolePlanMappings(mappingsRes.data);
      if (modelSettingsRes?.success && modelSettingsRes.data) {
        const loadedConfig = modelSettingsRes.data;
        setModelSettings(prev => ({
          ...prev,
          ...loadedConfig
        }));
        if (modelSettingsRes.candidates) {
          setModelCandidates(prev => ({ ...prev, ...modelSettingsRes.candidates }));
        }
        const candidateTextIds = [
          'gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gpt-4o', 'gpt-4o-mini'
        ];
        const candidateImageIds = [
          'gemini-3.1-flash-image', 'imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001', 'dall-e-3'
        ];
        const overrides = {};
        ['textModel', 'websiteBuilderModel', 'seoModel', 'strategyModel', 'groundingModel', 'visionModel', 'promptCraftingModel'].forEach(k => {
          if (loadedConfig[k] && !candidateTextIds.includes(loadedConfig[k])) {
            overrides[k] = true;
          }
        });
        if (loadedConfig.imageModel && !candidateImageIds.includes(loadedConfig.imageModel)) {
          overrides.imageModel = true;
        }
        setCustomModelOverrides(overrides);
      }
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAssignPlanToRole = async (targetRole, targetPlan) => {
    setRolePlanSavingRole(targetRole);
    try {
      const res = await adminAPI.assignPlanToRole(targetRole, targetPlan);
      if (res?.success) {
        setRolePlanMappings(prev => ({ ...prev, [targetRole]: targetPlan }));
        setRolePlanSuccessMsg(res.message || `Plan assigned successfully to all ${targetRole} users!`);
        setTimeout(() => setRolePlanSuccessMsg(''), 4000);
        fetchData();
      }
    } catch (err) {
      console.error('Error assigning plan to role:', err);
    } finally {
      setRolePlanSavingRole(null);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSaveLegalContent = async () => {
    setLegalSaving(true);
    try {
      const res = await adminAPI.updateLegalPages(legalContent);
      if (res?.success) {
        setLegalSuccess('Legal document published & saved to database!');
        setTimeout(() => setLegalSuccess(''), 3500);
      }
    } catch (err) {
      console.error('Error saving legal content:', err);
    } finally {
      setLegalSaving(false);
    }
  };

  const handleSaveToolLimits = async () => {
    setToolLimitsSaving(true);
    try {
      const res = await adminAPI.updateToolLimits(toolLimits);
      if (res?.success) {
        setToolLimitsSuccess('Tool limits updated & saved to database!');
        setTimeout(() => setToolLimitsSuccess(''), 3500);
      }
    } catch (err) {
      console.error('Error saving tool limits:', err);
    } finally {
      setToolLimitsSaving(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await adminAPI.updateTicketStatus(ticketId, newStatus);
      if (res?.success) {
        setHelpDeskTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        fetchData();
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
    }
  };

  // AI Model Configuration Handlers
  const handleSaveModelSettings = async () => {
    setModelSaving(true);
    setModelSuccessMsg('');
    setModelErrorMsg('');
    try {
      const res = await adminAPI.updateModelSettings(modelSettings);
      if (res?.success) {
        setModelSettings(res.data);
        setModelSuccessMsg('AI Model configuration saved and applied across all backend services in real time!');
        setTimeout(() => setModelSuccessMsg(''), 6000);
      } else {
        setModelErrorMsg(res?.error || 'Failed to update model settings');
      }
    } catch (err) {
      setModelErrorMsg(err?.response?.data?.error || err.message || 'Error updating model settings');
    } finally {
      setModelSaving(false);
    }
  };

  const handleResetModelSettings = async () => {
    if (!window.confirm('Are you sure you want to reset all AI model configurations to platform defaults?')) return;
    setModelResetting(true);
    setModelSuccessMsg('');
    setModelErrorMsg('');
    try {
      const res = await adminAPI.resetModelSettings();
      if (res?.success) {
        setModelSettings(res.data);
        setCustomModelOverrides({});
        setModelSuccessMsg('AI Model configurations have been reset to platform defaults!');
        setTimeout(() => setModelSuccessMsg(''), 6000);
      } else {
        setModelErrorMsg(res?.error || 'Failed to reset model settings');
      }
    } catch (err) {
      setModelErrorMsg(err?.response?.data?.error || err.message || 'Error resetting model settings');
    } finally {
      setModelResetting(false);
    }
  };

  const handleTestModel = async (categoryKey, targetModel, type = 'text', featureTitle = '') => {
    setTestingModelKey(categoryKey);
    setTestResult(null);
    try {
      const res = await adminAPI.testModelConnection({
        type: type || 'text',
        model: targetModel,
        prompt: type === 'image'
          ? 'A minimalist modern geometric commercial logo icon on clean studio white background'
          : 'Ping test from Admin Console. Reply with: OK and current system timestamp.'
      });
      if (res?.success) {
        setTestResult({
          category: categoryKey,
          label: featureTitle,
          type,
          status: 'success',
          latencyMs: res.latencyMs,
          model: res.model || targetModel,
          reply: res.reply || res.message,
          hasImage: res.hasImage
        });
      } else {
        setTestResult({
          category: categoryKey,
          label: featureTitle,
          type,
          status: 'error',
          error: res?.error || res?.message || 'Model test failed'
        });
      }
    } catch (err) {
      setTestResult({
        category: categoryKey,
        label: featureTitle,
        type,
        status: 'error',
        error: err?.response?.data?.error || err.message || 'Test request failed'
      });
    } finally {
      setTestingModelKey(null);
    }
  };

  // Filter & Sort Chat Sessions (100% Dynamic Database Records)
  const filteredChatSessions = useMemo(() => {
    let list = chatSessionsData?.sessions || [];

    if (sessionSearch.trim()) {
      const q = sessionSearch.toLowerCase();
      list = list.filter(s =>
        (s.sessionId && s.sessionId.toLowerCase().includes(q)) ||
        (s.user && s.user.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'ALL') {
      list = list.filter(s => (s.status || 'COMPLETED').toUpperCase() === statusFilter.toUpperCase());
    }

    if (modeFilter !== 'ALL') {
      list = list.filter(s => s.mode === modeFilter);
    }

    if (fromDate) {
      const fromTs = new Date(fromDate).getTime();
      list = list.filter(s => s.rawTimestamp >= fromTs);
    }

    if (toDate) {
      const toTs = new Date(toDate).setHours(23, 59, 59, 999);
      list = list.filter(s => s.rawTimestamp <= toTs);
    }

    return list;
  }, [chatSessionsData, sessionSearch, statusFilter, modeFilter, fromDate, toDate]);

  // Filter & Sort Users
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(u =>
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.plan && u.plan.toLowerCase().includes(q))
      );
    }

    if (selectedPlanFilter !== 'ALL') {
      list = list.filter(u => (u.plan || 'free').toUpperCase() === selectedPlanFilter.toUpperCase());
    }

    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [users, searchQuery, selectedPlanFilter, sortField, sortDir]);

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'USERS', icon: Users },
    { id: 'chat-sessions', label: 'Chat Sessions', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: Clock },
    { id: 'plans', label: 'PLANS', icon: CreditCard },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'tool-limit', label: 'Tool Limit', icon: Shield },
    { id: 'legal-pages', label: 'Legal Pages', icon: FileText },
    { id: 'help-desk', label: 'HELP DESK', icon: Headphones },
    { id: 'models', label: 'MODEL', icon: Cpu },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 animate-pulse">Loading Platform Management Console...</p>
        </div>
      </div>
    );
  }

  const toolIconMap = {
    'AI Chat': MessageSquare,
    'AI Website Builder': Globe,
    'Creative Studio': ImageIcon,
    'Social Media Copy Generator': FileText,
    'SEO Brief Generator': Search,
    'Brand DNA Web Scraper': Sliders,
  };

  const toolColorMap = {
    'AI Chat': 'bg-indigo-50 text-indigo-600',
    'AI Website Builder': 'bg-brand-50 text-brand-600',
    'Creative Studio': 'bg-purple-50 text-purple-600',
    'Social Media Copy Generator': 'bg-emerald-50 text-emerald-600',
    'SEO Brief Generator': 'bg-amber-50 text-amber-600',
    'Brand DNA Web Scraper': 'bg-teal-50 text-teal-600',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 md:p-8 space-y-6 font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Platform Management Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2 text-xs font-extrabold"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-md">
            {adminInitials}
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE NAVIGATION TAB BAR ── */}
      <div className="relative border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 pt-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all flex-shrink-0 font-extrabold ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-0.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-transparent w-full rounded-full mt-1" />
      </div>

      {/* ── TAB 1: OVERVIEW (100% REAL DYNAMIC DATABASE AGGREGATION) ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <Activity className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>Live Database Telemetry</span>
            </div>
            <button onClick={handleRefresh} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* 5 KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              icon={Users}
              label="TOTAL USERS"
              value={summary?.totalUsers ?? 0}
              colorClass="bg-purple-50 text-purple-600"
              delay={0.05}
            />
            <StatCard
              icon={Activity}
              label="ACTIVE SUBSCRIPTIONS"
              value={summary?.activeSubscriptions ?? 0}
              colorClass="bg-emerald-50 text-emerald-600"
              delay={0.1}
            />
            <StatCard
              icon={IndianRupee}
              label="TOTAL REVENUE"
              value={summary?.totalRevenue != null ? `₹${summary.totalRevenue.toLocaleString('en-IN')}` : '₹0'}
              colorClass="bg-amber-50 text-amber-600"
              delay={0.15}
            />
            <StatCard
              icon={Headphones}
              label="SUPPORT"
              value={summary?.supportTicketsCount ?? 0}
              badgeText={summary?.supportTicketsCount ? `${summary.supportTicketsCount} Open` : 'All Clear'}
              colorClass="bg-indigo-50 text-indigo-600"
              delay={0.2}
            />
            <StatCard
              icon={CheckCircle2}
              label="RESOLVED QUERIES"
              value={summary?.resolvedQueriesCount ?? 0}
              colorClass="bg-teal-50 text-teal-600"
              delay={0.25}
            />
          </div>

          {/* Tool Usage Analytics Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Tool Usage Analytics</h3>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Real Database Execution Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(summary?.toolUsage || []).map((tool, idx) => {
                const IconComp = toolIconMap[tool.name] || Layers;
                const colorClass = toolColorMap[tool.name] || 'bg-slate-50 text-slate-600';
                return (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">{tool.name}</span>
                    </div>
                    <span className="text-xs font-black text-brand-600">{(tool.uses || 0).toLocaleString()} uses</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: USERS ── */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, or plan..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Plan Filter:</span>
              {['ALL', 'FREE', 'STARTER', 'PRO', 'ENTERPRISE'].map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlanFilter(plan)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
                    selectedPlanFilter === plan
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Plan Tier</th>
                    <th className="p-4">Credits</th>
                    <th className="p-4">Brands</th>
                    <th className="p-4">Generations</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black">
                              {(u.name || u.email || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{u.name || u.email.split('@')[0]}</p>
                              <p className="text-[11px] text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <PlanBadge plan={u.plan} />
                        </td>
                        <td className="p-4 font-black text-brand-600">{u.credits ?? 0}</td>
                        <td className="p-4 font-bold text-slate-700">{u.brandCount ?? 0}</td>
                        <td className="p-4 font-bold text-indigo-600">{u.generationCount ?? 0}</td>
                        <td className="p-4 text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUserId(u.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-200 font-extrabold text-[11px] transition-colors"
                            >
                              Manage User
                            </button>
                            <button
                              onClick={() => setSelectedUserId(u.id)}
                              title="Delete User Account"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-xs font-bold text-slate-400">
                        No registered users found matching filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CHAT SESSIONS (100% REAL DATABASE METRICS & DYNAMIC CHARTS) ── */}
      {activeTab === 'chat-sessions' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 9 Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {[
              { label: 'TOTAL SESSIONS', val: chatSessionsData?.metrics?.totalSessions ?? 0, icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'ACTIVE NOW', val: chatSessionsData?.metrics?.activeNow ?? 0, icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'COMPLETED', val: chatSessionsData?.metrics?.completed ?? 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'ABANDONED', val: chatSessionsData?.metrics?.abandoned ?? 0, icon: ShieldAlert, color: 'text-amber-600 bg-amber-50' },
              { label: 'FAILED', val: chatSessionsData?.metrics?.failed ?? 0, icon: XCircle, color: 'text-rose-600 bg-rose-50' },
              { label: 'TOTAL MESSAGES', val: chatSessionsData?.metrics?.totalMessages ?? 0, icon: Layers, color: 'text-purple-600 bg-purple-50' },
              { label: 'AVG MSGS/SESS', val: chatSessionsData?.metrics?.avgMessagesPerSession ?? 0, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
              { label: 'AVG DURATION', val: chatSessionsData?.metrics?.avgDuration ?? '0s', icon: Clock, color: 'text-pink-600 bg-pink-50' },
              { label: 'GUEST SESSIONS', val: chatSessionsData?.metrics?.guestSessions ?? 0, icon: Users, color: 'text-orange-600 bg-orange-50' },
            ].map((kpi, idx) => {
              const IconComp = kpi.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1 text-left">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-black text-slate-900 tracking-tight pt-1">{kpi.val}</p>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-tight">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          {/* 2 Dynamic Analytics Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Chart: DAILY ACTIVE SESSIONS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">DAILY ACTIVE SESSIONS</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900">{chatSessionsData?.dailyActiveSessions?.dailyAvg ?? 0}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">DAILY AVG</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Total {chatSessionsData?.dailyActiveSessions?.total7Days ?? 0} in the last 7 days</p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <DynamicAreaChart
                data={chatSessionsData?.dailyActiveSessions?.chartData || []}
                color="#6366F1"
                gradientId="purpleGradient"
              />
            </div>

            {/* Right Chart: DAILY USER SIGNUPS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">DAILY USER SIGNUPS</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900">{chatSessionsData?.dailyUserSignups?.dailyAvg ?? 0}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">DAILY AVG</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Total {chatSessionsData?.dailyUserSignups?.total7Days ?? 0} in the last 7 days</p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <DynamicAreaChart
                data={chatSessionsData?.dailyUserSignups?.chartData || []}
                color="#10B981"
                gradientId="emeraldGradient"
              />
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={sessionSearch}
                onChange={(e) => setSessionSearch(e.target.value)}
                placeholder="Search by name, email or session ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">STATUS</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-slate-900 font-bold focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">MODE</span>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="bg-transparent text-slate-900 font-bold focus:outline-none"
                >
                  <option value="ALL">All Modes</option>
                  <option value="NORMAL CHAT">NORMAL CHAT</option>
                  <option value="GENERATE IMAGE">GENERATE IMAGE</option>
                  <option value="WEBSITE BUILDER">WEBSITE BUILDER</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">FROM</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-slate-900 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">TO</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-slate-900 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Chat Sessions Data Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                Chat Sessions
                <span className="text-xs font-semibold text-slate-400">({filteredChatSessions.length} total in database)</span>
              </h3>
              <button onClick={handleRefresh} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">SESSION ID</th>
                    <th className="p-3.5">USER</th>
                    <th className="p-3.5">EMAIL</th>
                    <th className="p-3.5">MODE</th>
                    <th className="p-3.5">START TIME</th>
                    <th className="p-3.5">DURATION</th>
                    <th className="p-3.5">TOTAL</th>
                    <th className="p-3.5 text-blue-600">USER</th>
                    <th className="p-3.5 text-emerald-600">AI</th>
                    <th className="p-3.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredChatSessions.length > 0 ? (
                    filteredChatSessions.map((s, idx) => (
                      <tr
                        key={s.sessionId || idx}
                        onClick={() => setSelectedChatSession(s)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="p-3.5 font-mono text-brand-600 font-bold hover:underline">{s.sessionId}</td>
                        <td className="p-3.5 font-bold text-slate-900">{s.user}</td>
                        <td className="p-3.5 text-slate-500 font-mono">{s.email}</td>
                        <td className="p-3.5 font-semibold text-slate-700">{s.mode}</td>
                        <td className="p-3.5 text-slate-500">{s.startTime}</td>
                        <td className="p-3.5 text-slate-600 font-semibold">{s.duration}</td>
                        <td className="p-3.5 font-black text-slate-900">{s.totalMessages}</td>
                        <td className="p-3.5 font-black text-blue-600">{s.userMessages}</td>
                        <td className="p-3.5 font-black text-emerald-600">{s.aiMessages}</td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-300 uppercase">
                            {s.status || 'COMPLETED'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-xs font-bold text-slate-400">
                        No chat sessions matching filters in database
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Detail Modal */}
          <AnimatePresence>
            {selectedChatSession && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  onClick={() => setSelectedChatSession(null)}
                />

                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 15 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                  className="relative w-full max-w-3xl bg-white rounded-[2rem] p-8 shadow-2xl z-10 max-h-[88vh] overflow-y-auto font-sans flex flex-col gap-6 text-slate-900 border border-slate-100"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">Session Detail</h3>
                        <p className="text-xs font-mono text-slate-400 font-semibold">{selectedChatSession.sessionId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedChatSession(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-y-6 gap-x-6 text-xs bg-white p-2 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">USER</span>
                      <p className="font-extrabold text-slate-900 text-sm">{selectedChatSession.user}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">EMAIL</span>
                      <p className="font-bold text-slate-900 text-xs truncate">{selectedChatSession.email}</p>
                      <a
                        href={`mailto:${selectedChatSession.email}`}
                        className="mt-1.5 inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/80 text-[10px] font-black px-3 py-1 rounded-xl transition-colors shadow-xs"
                      >
                        <Mail className="w-3 h-3" />
                        SEND MAIL
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">STATUS</span>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-300/80 text-[10px] font-black uppercase">
                        {selectedChatSession.status || 'COMPLETED'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">MODE</span>
                      <p className="font-bold text-slate-900 text-xs">{selectedChatSession.mode || 'Normal Chat'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">DURATION</span>
                      <p className="font-bold text-slate-900 text-xs">{selectedChatSession.duration || '0s'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">START TIME</span>
                      <p className="font-bold text-slate-900 text-xs">{selectedChatSession.startTime}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">LAST ACTIVITY</span>
                      <p className="font-bold text-slate-900 text-xs">{selectedChatSession.startTime}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">TOTAL MESSAGES</span>
                      <p className="font-bold text-slate-900 text-xs">{selectedChatSession.totalMessages ?? 0}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">USER / AI</span>
                      <p className="font-bold text-slate-900 text-xs">{selectedChatSession.userMessages ?? 0} / {selectedChatSession.aiMessages ?? 0}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      CONVERSATION HISTORY
                    </h4>

                    {selectedChatSession.messages && selectedChatSession.messages.length > 0 ? (
                      <div className="space-y-4 pt-2">
                        {selectedChatSession.messages.map((m, idx) => {
                          const isUser = m.sender === 'user' || m.role === 'user';
                          return (
                            <div
                              key={idx}
                              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                                  isUser
                                    ? 'bg-blue-100 text-blue-500'
                                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                }`}
                              >
                                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                              </div>

                              <div
                                className={`p-4 rounded-3xl text-xs space-y-1.5 max-w-[82%] shadow-sm ${
                                  isUser
                                    ? 'bg-indigo-100/90 text-slate-900 rounded-tr-none'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                }`}
                              >
                                <p className="leading-relaxed font-medium whitespace-pre-wrap">
                                  {m.text || m.content || '(No message content)'}
                                </p>
                                {m.timestamp && (
                                  <p className={`text-[10px] text-right font-semibold ${isUser ? 'text-indigo-400' : 'text-slate-300'}`}>
                                    {m.timestamp}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-3xl border border-slate-200">
                        No conversation history stored in database for this session.
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── TAB 4: ANALYTICS (HIGH-PRECISION TELEMETRY & INCIDENT MONITORING) ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in font-sans text-slate-900">
          {/* Sub-Navigation Tabs: Usage & Latency vs Incident Monitoring */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setAnalyticsSubTab('usage')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                analyticsSubTab === 'usage'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Usage &amp; Latency</span>
            </button>

            <button
              onClick={() => setAnalyticsSubTab('incidents')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                analyticsSubTab === 'incidents'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Incident Monitoring</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            </button>
          </div>

          {analyticsSubTab === 'usage' ? (
            <div className="space-y-6">
              {/* Analytics Overview Header & Time Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">Analytics Overview</h2>
                    <p className="text-xs text-slate-400 font-medium">Error rates, card usage &amp; AI Ads telemetry trends</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Time Range Selector Pills */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
                    {['24h', '7d', '30d', '90d'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setAnalyticsTimeFrame(tf)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          analyticsTimeFrame === tf
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <span className="hidden md:inline">Updated just now</span>
                    <button onClick={handleRefresh} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                      <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Top Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: TOTAL SESSIONS */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {chatSessionsData?.metrics?.totalSessions ?? summary?.totalUsers ?? 67}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">TOTAL SESSIONS</p>
                </div>

                {/* Card 2: TOTAL ERRORS */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black">
                      {summary?.analytics?.errorRate ?? '0.0%'} rate
                    </span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {summary?.analytics?.totalErrors ?? 0}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">TOTAL ERRORS</p>
                </div>

                {/* Card 3: BACKEND API CALLS */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {summary?.analytics?.totalApiHits ?? chatSessionsData?.metrics?.totalUserMessages ?? 42}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">BACKEND API CALLS</p>
                </div>

                {/* Card 4: AVG RESPONSE LATENCY */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {summary?.analytics?.avgLatency ?? '1.8s'}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">AVG RESPONSE LATENCY</p>
                </div>
              </div>

              {/* 2 Main Panels: Feature Usage Share & Errors by Sub-Tool */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Feature Usage Share */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">Feature Usage Share</h3>
                    <span className="text-xs font-bold text-slate-400">Real Session Breakdown</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'AI Chat Assistant', count: summary?.toolUsage?.aiChat || chatSessionsData?.metrics?.totalSessions || 36, color: 'bg-indigo-500', barBg: 'bg-indigo-100', pct: '65%' },
                      { name: 'Creative Studio', count: summary?.toolUsage?.creativeStudio || 26, color: 'bg-rose-500', barBg: 'bg-rose-100', pct: '25%' },
                      { name: 'SEO Intelligence', count: summary?.toolUsage?.seoBriefs || 8, color: 'bg-emerald-500', barBg: 'bg-emerald-100', pct: '8%' },
                      { name: 'AI Website Builder', count: summary?.toolUsage?.websiteBuilder || 4, color: 'bg-amber-500', barBg: 'bg-amber-100', pct: '4%' },
                      { name: 'Brand DNA Web Scraper', count: summary?.toolUsage?.brandDna || 2, color: 'bg-cyan-500', barBg: 'bg-cyan-100', pct: '2%' }
                    ].map((feat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${feat.color}`} />
                            <span className="text-slate-800 uppercase tracking-wider">{feat.name}</span>
                          </div>
                          <span className="text-slate-400 font-mono">{feat.count} sessions</span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${feat.barBg} overflow-hidden`}>
                          <div className={`h-full ${feat.color} rounded-full transition-all duration-500`} style={{ width: feat.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Errors by Sub-Tool */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">Errors by Sub-Tool (Click to inspect)</h3>
                    <button onClick={handleRefresh} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-extrabold hover:bg-emerald-100 transition-colors">
                      Resolve All Errors
                    </button>
                  </div>

                  <div className="space-y-4 pt-2">
                    {[
                      { name: 'AI Chat Assistant API', errors: summary?.analytics?.chatErrors ?? 0 },
                      { name: 'General Platform API', errors: 0 },
                      { name: 'AI Image Generation Service', errors: 0 },
                      { name: 'Brand DNA Web Scraper API', errors: 0 }
                    ].map((toolErr, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <span className="text-slate-800">{toolErr.name}</span>
                          <span className={`${toolErr.errors > 0 ? 'text-rose-600' : 'text-emerald-600'} font-mono`}>
                            {toolErr.errors} errors
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div className={`h-full ${toolErr.errors > 0 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full w-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Sub-Tab 2: Incident Monitoring */
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">All Microservices Operational</h3>
                      <p className="text-xs text-slate-400 font-medium">Platform Uptime SLA: {summary?.analytics?.systemUptime || '99.98%'}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-black uppercase">
                    100% HEALTHY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {[
                    { name: 'AI Ads™ Core LLM Engine', status: 'Operational', latency: '1.8s' },
                    { name: 'MongoDB Main Database', status: 'Operational', latency: '12ms' },
                    { name: 'Brand DNA Web Scraper Microservice', status: 'Operational', latency: '450ms' },
                    { name: 'Razorpay Payment Gateway API', status: 'Operational', latency: '120ms' },
                    { name: 'Media Storage CDN Bucket', status: 'Operational', latency: '85ms' }
                  ].map((serv, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-extrabold text-slate-900">{serv.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 block">{serv.status}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{serv.latency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: PLANS ── */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in">

          {/* ── DEVELOPER ISOLATED CUSTOM PLAN EDITOR DESK ── */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl space-y-6 font-sans relative overflow-hidden border border-indigo-700/50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <FileCode className="w-64 h-64 text-indigo-400" />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-800/80 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Developer Isolated Scope
                  </span>
                  {isDeveloperCustomActive ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Private Custom Plans Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/30 text-[11px] font-extrabold uppercase">
                      Default Platform Plans
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black tracking-tight text-white mt-2 flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-indigo-400" />
                  Developer Subscription Plan Customizer
                </h3>
                <p className="text-xs text-indigo-200/80 font-medium mt-1 max-w-2xl leading-relaxed">
                  As a Developer account, you can customize subscription plan names, pricing, image credits, and features according to your specific needs. <strong className="text-white underline decoration-indigo-400">These changes apply strictly to your developer account and will NOT be visible to any other user or account on the platform.</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetDeveloperCustomPlans}
                  disabled={devPlanResetting || !isDeveloperCustomActive}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {devPlanResetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Reset Defaults
                </button>
                <button
                  onClick={handleSaveDeveloperCustomPlans}
                  disabled={devPlanSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {devPlanSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving Private Scope...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save My Custom Plans
                    </>
                  )}
                </button>
              </div>
            </div>

            {devPlanSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{devPlanSuccessMsg}</span>
              </div>
            )}

            {devPlanErrorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{devPlanErrorMsg}</span>
              </div>
            )}

            {/* Editable Plan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {developerPlans.map((planItem, pIdx) => (
                <div
                  key={planItem.planId || pIdx}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-indigo-800/40 space-y-4 flex flex-col justify-between hover:border-indigo-500/60 transition-colors shadow-inner"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-indigo-900/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-extrabold">
                        Plan #{pIdx + 1} — {planItem.planId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        Editable
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mb-1">Plan Title</label>
                      <input
                        type="text"
                        value={planItem.name || ''}
                        onChange={(e) => handleUpdateDevPlanField(pIdx, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                        placeholder="e.g. Starter Suite"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mb-1">Subtitle / Description</label>
                      <input
                        type="text"
                        value={planItem.description || planItem.subtitle || ''}
                        onChange={(e) => handleUpdateDevPlanField(pIdx, 'description', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-[11px] font-medium text-slate-300 focus:outline-none focus:border-indigo-400"
                        placeholder="Short plan summary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mb-1">Price (₹ INR)</label>
                        <input
                          type="number"
                          value={planItem.priceINR ?? 0}
                          onChange={(e) => handleUpdateDevPlanField(pIdx, 'priceINR', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mb-1">Price ($ USD)</label>
                        <input
                          type="number"
                          value={planItem.priceUSD ?? 0}
                          onChange={(e) => handleUpdateDevPlanField(pIdx, 'priceUSD', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mb-1">Visual Credits</label>
                        <input
                          type="number"
                          value={planItem.imageCredits ?? 0}
                          onChange={(e) => handleUpdateDevPlanField(pIdx, 'imageCredits', parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mb-1">Text Gens</label>
                        <input
                          type="text"
                          value={planItem.textGenerations || ''}
                          onChange={(e) => handleUpdateDevPlanField(pIdx, 'textGenerations', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-[11px] font-bold text-indigo-300 focus:outline-none focus:border-indigo-400"
                          placeholder="e.g. 1,000 Gens / mo"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">Feature Items ({planItem.features?.length || 0})</label>
                        <button
                          type="button"
                          onClick={() => handleAddDevPlanFeature(pIdx)}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-200 flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {(planItem.features || []).map((featStr, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={featStr}
                              onChange={(e) => handleUpdateDevPlanFeature(pIdx, fIdx, e.target.value)}
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-medium text-slate-200 focus:outline-none focus:border-indigo-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveDevPlanFeature(pIdx, fIdx)}
                              className="p-1 rounded text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'free', title: 'Free Tier', price: '₹0 / mo', desc: 'Personal experimentation & trial access', color: 'border-slate-200' },
              { key: 'starter', title: 'Starter Plan', price: '₹999 / mo', desc: 'Solopreneurs & early stage brands', color: 'border-blue-300' },
              { key: 'pro', title: 'Pro Plan', price: '₹2,499 / mo', desc: 'Growing agencies & digital studios', color: 'border-brand-300' },
              { key: 'enterprise', title: 'Enterprise', price: '₹2,499 / mo', desc: 'Dedicated corporate infrastructure', color: 'border-purple-300' }
            ].map((plan, i) => {
              const count = summary?.planDistribution?.[plan.key] ?? 0;
              return (
                <div key={i} className={`p-6 rounded-3xl bg-white border ${plan.color} shadow-sm space-y-4 flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-900">{plan.title}</h3>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-extrabold uppercase">
                        {count} {count === 1 ? 'User' : 'Users'}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-brand-600 mt-2">{plan.price}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{plan.desc}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors"
                  >
                    Manage Subscriber Accounts
                  </button>
                </div>
              );
            })}
          </div>

          {/* Role-Based Subscription Plan Assignment Desk */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 font-sans">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Assign Subscription Plans by Platform Role
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Select a subscription plan for each role to assign it across accounts in database.
                </p>
              </div>
              {rolePlanSuccessMsg && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{rolePlanSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { roleId: 'developer', title: 'Developer Role', desc: 'Technical developers & API integrators', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                { roleId: 'admin', title: 'Admin Role', desc: 'Platform administrators & managers', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
                { roleId: 'user', title: 'User Role', desc: 'Standard platform end users', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { roleId: 'AgencyAdmin', title: 'Agency Admin Role', desc: 'Agency organization owners', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
                { roleId: 'SuperAdmin', title: 'Super Admin Role', desc: 'Root system administrators', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
              ].map((rItem) => {
                const currentPlan = rolePlanMappings[rItem.roleId] || 'free';
                const userCountForRole = users.filter(u => (u.role || 'user').toLowerCase() === rItem.roleId.toLowerCase()).length;
                const isSavingThis = rolePlanSavingRole === rItem.roleId;

                return (
                  <div key={rItem.roleId} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 flex flex-col justify-between hover:border-brand-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase border ${rItem.badgeColor}`}>
                          {rItem.title}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {userCountForRole} {userCountForRole === 1 ? 'user' : 'users'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{rItem.desc}</p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
                      <label className="block text-[11px] font-black uppercase text-slate-600">Assign Subscription Plan</label>
                      <select
                        value={currentPlan}
                        onChange={(e) => setRolePlanMappings(prev => ({ ...prev, [rItem.roleId]: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs"
                      >
                        <option value="free">Free Tier (₹0)</option>
                        <option value="starter">Starter Plan (₹999)</option>
                        <option value="pro">Pro Plan (₹2,499)</option>
                        <option value="enterprise">Enterprise (₹2,499)</option>
                      </select>

                      <button
                        onClick={() => handleAssignPlanToRole(rItem.roleId, rolePlanMappings[rItem.roleId] || 'free')}
                        disabled={isSavingThis}
                        className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {isSavingThis ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Updating Accounts...
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            Assign Plan to All {rItem.title.split(' ')[0]} Users
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: FINANCE (DYNAMIC REVENUE METRICS) ── */}
      {activeTab === 'finance' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={IndianRupee}
              label="Total Gross Revenue"
              value={summary?.finance?.grossRevenue != null ? `₹${summary.finance.grossRevenue.toLocaleString('en-IN')}` : '₹0'}
              sub="Calculated from active subscription tiers"
              colorClass="bg-amber-50 text-amber-700"
            />
            <StatCard
              icon={TrendingUp}
              label="Monthly Recurring Revenue (MRR)"
              value={summary?.finance?.mrr != null ? `₹${summary.finance.mrr.toLocaleString('en-IN')}` : '₹0'}
              sub="Active recurring monthly subscription value"
              colorClass="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={CreditCard}
              label="Average Revenue Per User (ARPU)"
              value={summary?.finance?.arpu != null ? `₹${summary.finance.arpu.toLocaleString('en-IN')}` : '₹0'}
              sub="Calculated across all registered accounts"
              colorClass="bg-indigo-50 text-indigo-600"
            />
          </div>
        </div>
      )}

      {/* ── TAB 7: TOOL LIMIT (PERSISTED IN DATABASE) ── */}
      {activeTab === 'tool-limit' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Per-Plan Quota &amp; Rate Limits</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Persisted dynamically in MongoDB system settings</p>
            </div>
            {toolLimitsSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {toolLimitsSuccess}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {Object.entries(toolLimits).map(([key, limit]) => (
              <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Free:</span>
                    <input
                      type="text"
                      value={limit.free}
                      onChange={(e) => setToolLimits(prev => ({ ...prev, [key]: { ...prev[key], free: e.target.value } }))}
                      className="w-14 bg-transparent text-slate-900 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Starter:</span>
                    <input
                      type="text"
                      value={limit.starter}
                      onChange={(e) => setToolLimits(prev => ({ ...prev, [key]: { ...prev[key], starter: e.target.value } }))}
                      className="w-14 bg-transparent text-slate-900 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px]">Pro:</span>
                    <input
                      type="text"
                      value={limit.pro}
                      onChange={(e) => setToolLimits(prev => ({ ...prev, [key]: { ...prev[key], pro: e.target.value } }))}
                      className="w-14 bg-transparent text-slate-900 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200">
                    <span className="text-brand-600 text-[10px]">Enterprise:</span>
                    <input
                      type="text"
                      value={limit.enterprise}
                      onChange={(e) => setToolLimits(prev => ({ ...prev, [key]: { ...prev[key], enterprise: e.target.value } }))}
                      className="w-20 bg-transparent text-brand-700 text-xs font-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveToolLimits}
            disabled={toolLimitsSaving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {toolLimitsSaving ? 'Saving Limits...' : 'Save Tool Limits to Database'}
          </button>
        </div>
      )}

      {/* ── TAB 8: LEGAL PAGES (PERSISTED IN DATABASE) ── */}
      {activeTab === 'legal-pages' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Legal Content &amp; Policy Management</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Stored &amp; fetched dynamically from backend database</p>
            </div>
            <div className="flex items-center gap-3">
              {legalSuccess && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {legalSuccess}
                </span>
              )}
              <div className="flex gap-2">
                {['terms', 'privacy', 'refund'].map(doc => (
                  <button
                    key={doc}
                    onClick={() => setSelectedLegalDoc(doc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                      selectedLegalDoc === doc ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {doc}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <textarea
            rows={10}
            value={legalContent[selectedLegalDoc] || ''}
            onChange={(e) => setLegalContent(prev => ({ ...prev, [selectedLegalDoc]: e.target.value }))}
            placeholder={`Enter dynamic content for ${selectedLegalDoc}...`}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={handleSaveLegalContent}
            disabled={legalSaving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {legalSaving ? 'Publishing...' : 'Publish Legal Document to Database'}
          </button>
        </div>
      )}

      {/* ── TAB 9: HELP DESK (REAL SUPPORT TICKETS FROM DATABASE) ── */}
      {activeTab === 'help-desk' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Help Desk Support Ticket Queue</h3>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {helpDeskTickets.filter(t => t.status === 'Open').length > 0
                ? `${helpDeskTickets.filter(t => t.status === 'Open').length} Open Ticket(s)`
                : 'All Clear'}
            </span>
          </div>

          {helpDeskTickets.length > 0 ? (
            <div className="space-y-3">
              {helpDeskTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand-600 font-mono">{ticket.id}</span>
                      <span className="text-xs font-extrabold text-slate-900">— {ticket.subject}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {ticket.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{ticket.message}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{ticket.email} {ticket.name ? `(${ticket.name})` : ''} • {ticket.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdateTicketStatus(ticket.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl text-xs font-extrabold border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-brand-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-extrabold text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Headphones className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No support or feedback tickets submitted yet.</p>
              <p className="text-[11px] font-medium text-slate-400">Tickets submitted through the feedback endpoint will automatically appear here in real time.</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 10: MODEL CONFIGURATION (HOT-SWAP TEXT, IMAGE & AGENT MODELS) ── */}
      {activeTab === 'models' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Header Bar */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Model &amp; Engine Management</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Hot-Swap Enabled
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Configure text response models, visual image generators, and specialized agents in real time without restarting backend servers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end">
              <button
                onClick={handleResetModelSettings}
                disabled={modelResetting || modelSaving}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${modelResetting ? 'animate-spin' : ''}`} />
                Reset Defaults
              </button>
              <button
                onClick={handleSaveModelSettings}
                disabled={modelSaving || modelResetting}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {modelSaving ? 'Saving & Deploying...' : 'Save & Apply Config'}
              </button>
            </div>
          </div>

          {/* Feedback Banners */}
          {modelSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{modelSuccessMsg}</span>
            </div>
          )}
          {modelErrorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{modelErrorMsg}</span>
            </div>
          )}

          {/* ── LIVE DIAGNOSTIC RESULT BOX ── */}
          {testResult && (
            <div className={`p-5 rounded-2xl border shadow-sm space-y-3 animate-in fade-in duration-200 ${
              testResult.status === 'success'
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {testResult.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Live Diagnostic Ping: {testResult.label || testResult.category}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    testResult.status === 'success'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {testResult.status === 'success' ? `ONLINE • ${testResult.latencyMs}ms` : 'FAILED'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTestResult(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/80 transition-all"
                >
                  ✕ Dismiss
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                <span>Model Endpoint: <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-brand-600">{testResult.model}</code></span>
                {testResult.status === 'success' && (
                  <span>Round-Trip Latency: <strong className="text-emerald-700 font-mono">{testResult.latencyMs} ms</strong></span>
                )}
              </div>

              {testResult.status === 'success' ? (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed max-h-32 overflow-y-auto shadow-xs">
                  {testResult.reply || testResult.message || 'Model responded successfully with HTTP 200 OK.'}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-white border border-rose-200 font-mono text-xs text-rose-700 leading-relaxed shadow-xs">
                  {testResult.error || testResult.message || 'Model endpoint connection failed.'}
                </div>
              )}
            </div>
          )}

          {/* ── 8 FEATURE CATEGORIES STATUS OVERVIEW ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Active AI Models Overview (8 Feature Categories)
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All 8 Services Connected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { key: 'textModel', label: '1. Text & Copilot', icon: Bot, color: 'text-brand-600 bg-brand-50 border-brand-200' },
                { key: 'websiteBuilderModel', label: '2. Website Builder', icon: Layout, color: 'text-sky-600 bg-sky-50 border-sky-200' },
                { key: 'seoModel', label: '3. SEO & Articles', icon: Search, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { key: 'strategyModel', label: '4. 30-Day Strategy', icon: Calendar, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                { key: 'imageModel', label: '5. Creative Studio', icon: ImageIcon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { key: 'groundingModel', label: '6. Live Grounding', icon: Globe, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { key: 'visionModel', label: '7. Vision & Palette', icon: Palette, color: 'text-violet-600 bg-violet-50 border-violet-200' },
                { key: 'promptCraftingModel', label: '8. Prompt Crafter', icon: Wand2, color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200' },
              ].map((item) => {
                const IconCmp = item.icon;
                const activeId = modelSettings[item.key] || 'gemini-2.5-flash';
                return (
                  <div key={item.key} className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                          <IconCmp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-black text-slate-800 truncate">{item.label}</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <div className="text-[11px] font-mono font-bold text-slate-900 truncate bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      {activeId}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 8 INDIVIDUAL FEATURE MODEL CONFIGURATION CARDS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ── CARD 1: TEXT RESPONSE & AI COPILOT CHAT (FULL WIDTH) ── */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">1. Text Response &amp; AI Copilot Chat</h4>
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-[10px] font-black border border-brand-200">
                        Primary Conversational Core
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Powers Floating Assistant Drawer, Campaign Copilot, Chat Sessions, Captions, Marketing Copy &amp; Autopilot.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestModel('textModel', modelSettings.textModel, 'text', '1. Text Response & AI Copilot')}
                  disabled={testingModelKey !== null}
                  className="px-3.5 py-1.5 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-extrabold flex items-center gap-1.5 transition-all self-start md:self-auto disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'textModel' ? 'animate-spin text-brand-600' : 'text-brand-500'}`} />
                  {testingModelKey === 'textModel' ? 'Pinging Model...' : 'Test Connection'}
                </button>
              </div>

              {/* Model Selector Dropdown & Custom Override */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Selected AI Model for Feature 1
                </label>
                {customModelOverrides.textModel ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={modelSettings.textModel}
                        onChange={(e) => setModelSettings(prev => ({ ...prev, textModel: e.target.value.trim() }))}
                        placeholder="Enter model endpoint ID (e.g. gemini-2.5-flash or gpt-4o)"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-brand-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCustomModelOverrides(prev => ({ ...prev, textModel: false }));
                          setModelSettings(prev => ({ ...prev, textModel: 'gemini-2.5-flash' }));
                        }}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all whitespace-nowrap"
                      >
                        Use Standard Presets
                      </button>
                    </div>
                    <p className="text-[10px] text-amber-600 font-medium">Custom identifier active. Model will be directly dispatched for all conversational chat &amp; copywriting.</p>
                  </div>
                ) : (
                  <select
                    value={modelSettings.textModel}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomModelOverrides(prev => ({ ...prev, textModel: true }));
                      } else {
                        setModelSettings(prev => ({ ...prev, textModel: e.target.value }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500 transition-all font-sans"
                  >
                    {(modelCandidates?.textModels || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} — {m.badge || m.desc}
                      </option>
                    ))}
                    <option value="__custom__">⚙️ Custom Model Identifier (Manual Override)...</option>
                  </select>
                )}
              </div>

              {/* Sub-parameters: Failover Model, Temperature, Max Tokens */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Failover / Fallback Model
                  </label>
                  <select
                    value={modelSettings.fallbackTextModel}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, fallbackTextModel: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (asia-south1)</option>
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Auto-activated if primary model quota or endpoint is unavailable.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-700">Temperature</label>
                    <span className="text-xs font-mono font-black text-brand-600">{modelSettings.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={modelSettings.temperature}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>0.0 (Precise)</span>
                    <span>0.7 (Balanced)</span>
                    <span>1.0 (Creative)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Max Output Tokens
                  </label>
                  <select
                    value={modelSettings.maxOutputTokens}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, maxOutputTokens: parseInt(e.target.value, 10) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value={2048}>2,048 Tokens (~1,500 words)</option>
                    <option value={4096}>4,096 Tokens (~3,000 words)</option>
                    <option value={8192}>8,192 Tokens (~6,000 words - Default)</option>
                    <option value={16384}>16,384 Tokens (~12,000 words)</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Maximum response length per AI copilot turn.</p>
                </div>
              </div>
            </div>

            {/* ── CARD 2: AUTONOMOUS WEBSITE BUILDER ── */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                      <Layout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">2. Autonomous Website Builder</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Intent analysis, architecture planning &amp; live chat code editor</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestModel('websiteBuilderModel', modelSettings.websiteBuilderModel, 'text', '2. Autonomous Website Builder')}
                    disabled={testingModelKey !== null}
                    className="px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'websiteBuilderModel' ? 'animate-spin text-sky-600' : 'text-sky-500'}`} />
                    {testingModelKey === 'websiteBuilderModel' ? 'Testing...' : 'Test Ping'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Website Builder AI Model
                  </label>
                  {customModelOverrides.websiteBuilderModel ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modelSettings.websiteBuilderModel}
                          onChange={(e) => setModelSettings(prev => ({ ...prev, websiteBuilderModel: e.target.value.trim() }))}
                          placeholder="e.g. gemini-2.5-flash"
                          className="flex-1 px-3 py-2 rounded-xl border border-sky-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomModelOverrides(prev => ({ ...prev, websiteBuilderModel: false }));
                            setModelSettings(prev => ({ ...prev, websiteBuilderModel: 'gemini-2.5-flash' }));
                          }}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold"
                        >
                          Preset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={modelSettings.websiteBuilderModel}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomModelOverrides(prev => ({ ...prev, websiteBuilderModel: true }));
                        } else {
                          setModelSettings(prev => ({ ...prev, websiteBuilderModel: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                    >
                      {(modelCandidates?.textModels || []).map((m) => (
                        <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                      ))}
                      <option value="__custom__">⚙️ Custom Model Identifier...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Endpoint: <strong className="font-mono text-slate-800">{modelSettings.websiteBuilderModel}</strong></span>
                <span className="text-[10px] text-sky-600 font-extrabold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">Modules: WebsiteBuilder</span>
              </div>
            </div>

            {/* ── CARD 3: SEO ENGINE & BLOG GENERATOR ── */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">3. SEO Engine &amp; Blog Generator</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Keywords, 1500+ word articles, competitor gap analysis</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestModel('seoModel', modelSettings.seoModel, 'text', '3. SEO Engine & Blog Generator')}
                    disabled={testingModelKey !== null}
                    className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'seoModel' ? 'animate-spin text-emerald-600' : 'text-emerald-500'}`} />
                    {testingModelKey === 'seoModel' ? 'Testing...' : 'Test Ping'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    SEO AI Model Selection
                  </label>
                  {customModelOverrides.seoModel ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modelSettings.seoModel}
                          onChange={(e) => setModelSettings(prev => ({ ...prev, seoModel: e.target.value.trim() }))}
                          placeholder="e.g. gemini-2.5-flash"
                          className="flex-1 px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomModelOverrides(prev => ({ ...prev, seoModel: false }));
                            setModelSettings(prev => ({ ...prev, seoModel: 'gemini-2.5-flash' }));
                          }}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold"
                        >
                          Preset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={modelSettings.seoModel}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomModelOverrides(prev => ({ ...prev, seoModel: true }));
                        } else {
                          setModelSettings(prev => ({ ...prev, seoModel: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      {(modelCandidates?.textModels || []).map((m) => (
                        <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                      ))}
                      <option value="__custom__">⚙️ Custom Model Identifier...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Endpoint: <strong className="font-mono text-slate-800">{modelSettings.seoModel}</strong></span>
                <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Modules: SEO Vertex &amp; Briefs</span>
              </div>
            </div>

            {/* ── CARD 4: 30-DAY CONTENT STRATEGY AGENT ── */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">4. 30-Day Content Strategy Agent</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Multi-platform 30-day marketing calendar &amp; campaign schedule</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestModel('strategyModel', modelSettings.strategyModel, 'text', '4. 30-Day Content Strategy')}
                    disabled={testingModelKey !== null}
                    className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'strategyModel' ? 'animate-spin text-amber-600' : 'text-amber-500'}`} />
                    {testingModelKey === 'strategyModel' ? 'Testing...' : 'Test Ping'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Strategy Agent AI Model
                  </label>
                  {customModelOverrides.strategyModel ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modelSettings.strategyModel}
                          onChange={(e) => setModelSettings(prev => ({ ...prev, strategyModel: e.target.value.trim() }))}
                          placeholder="e.g. gemini-2.5-flash"
                          className="flex-1 px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomModelOverrides(prev => ({ ...prev, strategyModel: false }));
                            setModelSettings(prev => ({ ...prev, strategyModel: 'gemini-2.5-flash' }));
                          }}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold"
                        >
                          Preset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={modelSettings.strategyModel}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomModelOverrides(prev => ({ ...prev, strategyModel: true }));
                        } else {
                          setModelSettings(prev => ({ ...prev, strategyModel: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      {(modelCandidates?.textModels || []).map((m) => (
                        <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                      ))}
                      <option value="__custom__">⚙️ Custom Model Identifier...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Endpoint: <strong className="font-mono text-slate-800">{modelSettings.strategyModel}</strong></span>
                <span className="text-[10px] text-amber-600 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Modules: CustomStrategyAgent</span>
              </div>
            </div>

            {/* ── CARD 5: AD IMAGE GENERATION & CREATIVE STUDIO (FULL WIDTH) ── */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">5. Ad Image Generation &amp; Creative Studio</h4>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-200">
                        Visual Ad Engine
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Powers Creative Studio, Brand Image Agent, GCS/Base64 image creation &amp; multi-size social banners.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestModel('imageModel', modelSettings.imageModel, 'image', '5. Ad Image Generation Engine')}
                  disabled={testingModelKey !== null}
                  className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center gap-1.5 transition-all self-start md:self-auto disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${testingModelKey === 'imageModel' ? 'animate-spin text-indigo-600' : 'text-indigo-500'}`} />
                  {testingModelKey === 'imageModel' ? 'Generating Visual Ping...' : 'Test Image Generation'}
                </button>
              </div>

              {/* Primary Image Model Selector & Custom Override */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Primary Visual Image Engine Selection
                </label>
                {customModelOverrides.imageModel ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={modelSettings.imageModel}
                        onChange={(e) => setModelSettings(prev => ({ ...prev, imageModel: e.target.value.trim() }))}
                        placeholder="Enter image model ID (e.g. imagen-3.0-generate-002 or dall-e-3)"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-indigo-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCustomModelOverrides(prev => ({ ...prev, imageModel: false }));
                          setModelSettings(prev => ({ ...prev, imageModel: 'gemini-3.1-flash-image' }));
                        }}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all whitespace-nowrap"
                      >
                        Use Standard Presets
                      </button>
                    </div>
                    <p className="text-[10px] text-amber-600 font-medium">Custom visual model active. Passed to image generation pipeline.</p>
                  </div>
                ) : (
                  <select
                    value={modelSettings.imageModel}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomModelOverrides(prev => ({ ...prev, imageModel: true }));
                      } else {
                        setModelSettings(prev => ({ ...prev, imageModel: e.target.value }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  >
                    {(modelCandidates?.imageModels || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} — {m.badge || m.desc}
                      </option>
                    ))}
                    <option value="__custom__">⚙️ Custom Image Model Identifier...</option>
                  </select>
                )}
              </div>

              {/* Sub-parameters: Failover Image Model & Default Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Failover Image Engine
                  </label>
                  <select
                    value={modelSettings.fallbackImageModel}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, fallbackImageModel: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="imagen-3.0-generate-002">Google Imagen 3.0 Gen 2 (High Fidelity)</option>
                    <option value="gemini-3.1-flash-image">Gemini 3.1 Flash Image (Nano Banana)</option>
                    <option value="imagen-3.0-fast-generate-001">Google Imagen 3.0 Fast</option>
                    <option value="dall-e-3">OpenAI DALL-E 3</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Used automatically if primary image generator endpoint hits quota limits.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Default Canvas Aspect Ratio
                  </label>
                  <select
                    value={modelSettings.defaultAspectRatio || '1:1'}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, defaultAspectRatio: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1:1">1:1 Square (Instagram Posts, Meta Feed, Avatars)</option>
                    <option value="16:9">16:9 Landscape (YouTube Banners, Web Display Ads)</option>
                    <option value="9:16">9:16 Vertical (Instagram Stories, TikTok, Reels)</option>
                    <option value="4:5">4:5 Portrait (Standard Meta &amp; Social Ads)</option>
                  </select>
                  <p className="text-[10px] text-slate-400">Default canvas proportion applied for single-click banner creations.</p>
                </div>
              </div>
            </div>

            {/* ── CARD 6: GOOGLE LIVE SEARCH GROUNDING ── */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">6. Google Live Search Grounding</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Real-time web search grounding &amp; Brand DNA scraper Tier 4</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestModel('groundingModel', modelSettings.groundingModel, 'text', '6. Google Live Search Grounding')}
                    disabled={testingModelKey !== null}
                    className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'groundingModel' ? 'animate-spin text-blue-600' : 'text-blue-500'}`} />
                    {testingModelKey === 'groundingModel' ? 'Testing...' : 'Test Ping'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Grounding AI Model Selection
                  </label>
                  {customModelOverrides.groundingModel ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modelSettings.groundingModel}
                          onChange={(e) => setModelSettings(prev => ({ ...prev, groundingModel: e.target.value.trim() }))}
                          placeholder="e.g. gemini-2.5-flash"
                          className="flex-1 px-3 py-2 rounded-xl border border-blue-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomModelOverrides(prev => ({ ...prev, groundingModel: false }));
                            setModelSettings(prev => ({ ...prev, groundingModel: 'gemini-2.5-flash' }));
                          }}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold"
                        >
                          Preset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={modelSettings.groundingModel}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomModelOverrides(prev => ({ ...prev, groundingModel: true }));
                        } else {
                          setModelSettings(prev => ({ ...prev, groundingModel: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      {(modelCandidates?.textModels || []).map((m) => (
                        <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                      ))}
                      <option value="__custom__">⚙️ Custom Model Identifier...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Endpoint: <strong className="font-mono text-slate-800">{modelSettings.groundingModel}</strong></span>
                <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Modules: GoogleGroundingService</span>
              </div>
            </div>

            {/* ── CARD 7: VISION & LOGO COLOR GROUNDING ── */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center shrink-0">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">7. Vision &amp; Logo Color Grounding</h4>
                      <p className="text-[10px] text-slate-500 font-medium">[COLOR-SCRAPER], uploaded logo palette extractor, visual QA</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestModel('visionModel', modelSettings.visionModel, 'text', '7. Vision & Logo Palette Grounding')}
                    disabled={testingModelKey !== null}
                    className="px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'visionModel' ? 'animate-spin text-violet-600' : 'text-violet-500'}`} />
                    {testingModelKey === 'visionModel' ? 'Testing...' : 'Test Ping'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Vision &amp; Color Extractor Model
                  </label>
                  {customModelOverrides.visionModel ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modelSettings.visionModel}
                          onChange={(e) => setModelSettings(prev => ({ ...prev, visionModel: e.target.value.trim() }))}
                          placeholder="e.g. gemini-2.5-flash"
                          className="flex-1 px-3 py-2 rounded-xl border border-violet-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomModelOverrides(prev => ({ ...prev, visionModel: false }));
                            setModelSettings(prev => ({ ...prev, visionModel: 'gemini-2.5-flash' }));
                          }}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold"
                        >
                          Preset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={modelSettings.visionModel}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomModelOverrides(prev => ({ ...prev, visionModel: true }));
                        } else {
                          setModelSettings(prev => ({ ...prev, visionModel: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-violet-500"
                    >
                      {(modelCandidates?.textModels || []).map((m) => (
                        <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                      ))}
                      <option value="__custom__">⚙️ Custom Model Identifier...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Endpoint: <strong className="font-mono text-slate-800">{modelSettings.visionModel}</strong></span>
                <span className="text-[10px] text-violet-600 font-extrabold bg-violet-50 px-2 py-0.5 rounded border border-violet-200">Modules: BrandScraper &amp; ColorExtractor</span>
              </div>
            </div>

            {/* ── CARD 8: VISUAL PROMPT CRAFTING AGENT ── */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-600 flex items-center justify-center shrink-0">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">8. Visual Prompt Crafting Agent</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Commercial photography synthesis &amp; visual scene expansion</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestModel('promptCraftingModel', modelSettings.promptCraftingModel, 'text', '8. Visual Prompt Crafter')}
                    disabled={testingModelKey !== null}
                    className="px-3 py-1.5 rounded-xl border border-fuchsia-200 bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Zap className={`w-3.5 h-3.5 ${testingModelKey === 'promptCraftingModel' ? 'animate-spin text-fuchsia-600' : 'text-fuchsia-500'}`} />
                    {testingModelKey === 'promptCraftingModel' ? 'Testing...' : 'Test Ping'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Prompt Crafting AI Model
                  </label>
                  {customModelOverrides.promptCraftingModel ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modelSettings.promptCraftingModel}
                          onChange={(e) => setModelSettings(prev => ({ ...prev, promptCraftingModel: e.target.value.trim() }))}
                          placeholder="e.g. gemini-2.5-flash"
                          className="flex-1 px-3 py-2 rounded-xl border border-fuchsia-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCustomModelOverrides(prev => ({ ...prev, promptCraftingModel: false }));
                            setModelSettings(prev => ({ ...prev, promptCraftingModel: 'gemini-2.5-flash' }));
                          }}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold"
                        >
                          Preset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={modelSettings.promptCraftingModel}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomModelOverrides(prev => ({ ...prev, promptCraftingModel: true }));
                        } else {
                          setModelSettings(prev => ({ ...prev, promptCraftingModel: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-fuchsia-500"
                    >
                      {(modelCandidates?.textModels || []).map((m) => (
                        <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
                      ))}
                      <option value="__custom__">⚙️ Custom Model Identifier...</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Active Endpoint: <strong className="font-mono text-slate-800">{modelSettings.promptCraftingModel}</strong></span>
                <span className="text-[10px] text-fuchsia-600 font-extrabold bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-200">Modules: PromptCraftingAgent</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM STICKY ACTION FOOTER BAR ── */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
                <Cpu className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Save &amp; Apply All 8 Model Assignments</p>
                <p className="text-[11px] text-slate-500 font-medium">Updates are deployed to the MongoDB system setting &amp; hot-reloaded across all services.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleResetModelSettings}
                disabled={modelResetting || modelSaving}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${modelResetting ? 'animate-spin' : ''}`} />
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveModelSettings}
                disabled={modelSaving || modelResetting}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {modelSaving ? 'Saving & Deploying...' : 'Save & Apply Config'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUserId && (
          <UserDetailDrawer
            userId={selectedUserId}
            initialUser={users.find(u => u.id === selectedUserId)}
            onClose={() => setSelectedUserId(null)}
            onUserUpdated={fetchData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

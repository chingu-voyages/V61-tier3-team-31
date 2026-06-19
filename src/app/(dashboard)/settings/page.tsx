'use client';

import {
  Settings, Users, Layout, BellRing, Globe, Database, Lock,
  Sliders, Search, Save, ChevronDown, ChevronRight,
  Shield, User, Mail, Clock, Eye, EyeOff, LogOut,
} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import {useState} from 'react';
import {useDashboard} from '@/lib/auth-context';

/** Settings-Tabs fuer Admin */
type AdminTab = 'general' | 'team' | 'layout' | 'notifications' | 'voyage' | 'integrations' | 'security';
/** Settings-Tabs fuer Participant */
type ParticipantTab = 'general' | 'notifications' | 'security' | 'account';

const adminTabs: {id: AdminTab; label: string; icon: React.ReactNode}[] = [
  {id: 'general', label: 'General', icon: <Settings className="w-4 h-4" />},
  {id: 'team', label: 'Team & Access', icon: <Users className="w-4 h-4" />},
  {id: 'layout', label: 'Dashboard Layout', icon: <Layout className="w-4 h-4" />},
  {id: 'notifications', label: 'Notifications', icon: <BellRing className="w-4 h-4" />},
  {id: 'voyage', label: 'Voyage Setup', icon: <Globe className="w-4 h-4" />},
  {id: 'integrations', label: 'Integrations', icon: <Database className="w-4 h-4" />},
  {id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" />},
];

const participantTabs: {id: ParticipantTab; label: string; icon: React.ReactNode}[] = [
  {id: 'general', label: 'General', icon: <Settings className="w-4 h-4" />},
  {id: 'notifications', label: 'Notifications', icon: <BellRing className="w-4 h-4" />},
  {id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" />},
  {id: 'account', label: 'Account', icon: <User className="w-4 h-4" />},
];

/** Placeholder fuer unvollstaendige Settings-Tabs */
function SettingsPlaceholder({icon, title, description}: {icon: React.ReactNode; title: string; description: string}) {
  return (
    <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden p-12 text-center text-slate-500 dark:text-slate-400">
      <div className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}

/** Toggle-Component */
function Toggle({defaultChecked = false, accentColor = '#77CF97'}: {defaultChecked?: boolean; accentColor?: string}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{'--tw-ring-color': accentColor} as React.CSSProperties} />
      <style>{`.peer:checked + div { background-color: ${accentColor} !important; }`}</style>
    </label>
  );
}

/** ============================================
 *  PARTICIPANT SETTINGS
 * ============================================ */

/** General-Tab fuer Participant */
function ParticipantGeneral() {
  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your personal information.</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" defaultValue="Olivia Chen" readOnly className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white cursor-not-allowed opacity-70" />
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Contact an admin to change your name.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" defaultValue="olivia.chen@email.com" readOnly className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white cursor-not-allowed opacity-70" />
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Contact an admin to change your email.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow">
                  <option>UTC-7 (Pacific Time)</option>
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC+0 (London)</option>
                  <option>UTC+1 (Berlin)</option>
                  <option>UTC+8 (Singapore)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow">
                  <option>English</option>
                  <option>Deutsch</option>
                  <option>Francais</option>
                  <option>Espanol</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Notifications-Tab fuer Participant */
function ParticipantNotifications() {
  return (
    <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Choose what updates you receive.</p>
        </div>
      </div>
      <div className="p-6 space-y-1">
        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receive updates via email.</div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Application Status Changes</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get notified when your application status updates.</div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Team Assignment</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get notified when you are assigned to a team.</div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Onboarding Reminders</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receive reminders for incomplete onboarding steps.</div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Program News</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Receive updates and announcements about the program.</div>
          </div>
          <Toggle defaultChecked={false} />
        </div>
      </div>
    </div>
  );
}

/** Security-Tab fuer Participant */
function ParticipantSecurity() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputClass = 'w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow';

  return (
    <div className="space-y-6">
      {/* Passwort aendern */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your password regularly to keep your account secure.</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} placeholder="Enter current password" className={inputClass} />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} placeholder="Enter new password" className={inputClass} />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password" className={inputClass} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer">
            Update Password
          </button>
        </div>
      </div>

      {/* Aktive Sitzungen */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Sessions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage devices where you are logged in.</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Chrome on macOS</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">San Francisco, US • Current session</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#77CF97] bg-[#77CF97]/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Safari on iPhone</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">San Francisco, US • 2 days ago</div>
              </div>
            </div>
            <button className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
              <LogOut className="w-3 h-3" /> Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Account-Tab fuer Participant */
function ParticipantAccount() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your account details and status.</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-sm text-slate-500 dark:text-slate-400">Account created</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">October 15, 2025</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Participant</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">Team</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Team Atlas</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-rose-200 dark:border-rose-500/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-rose-100 dark:border-rose-500/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Danger Zone</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible actions.</p>
          </div>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Deactivate Account</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Permanently deactivate your account and remove access.</div>
          </div>
          <button className="px-4 py-2 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer">
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

/** ============================================
 *  ADMIN SETTINGS (bestehend)
 * ============================================ */

/** Admin-General-Tab */
function AdminGeneral() {
  return (
    <>
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Organization Profile</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your company photo and details here.</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#0b0c10] flex items-center justify-center shrink-0 border-2 border-slate-100 dark:border-white/10">
              <NexusLogo className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">Upload New</button>
                <button className="px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">Delete</button>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">SVG, PNG, JPG or GIF (max. 800x400px)</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Organization Name</label>
              <input type="text" defaultValue="Amigo" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Support Email</label>
              <input type="email" defaultValue="support@nexus.io" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">System Preferences</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure global settings and defaults.</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Default Match Threshold</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimum score required for auto-matching candidates to teams.</div>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min="50" max="100" defaultValue="85" className="w-32 accent-[#77CF97]" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10 text-right">85%</span>
            </div>
          </div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Automated Onboarding Emails</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Send welcome workflow automatically upon candidate acceptance.</div>
            </div>
            <Toggle defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Require 2FA for Admins</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enforce two-factor authentication for all Workspace Owners.</div>
            </div>
            <Toggle defaultChecked={true} accentColor="#9333ea" />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Einstellungsseite — rollenbasiert.
 * Admin sieht 7 Tabs, Participant sieht 4 Tabs.
 */
export default function SettingsPage() {
  const {role} = useDashboard();
  const isAdmin = role === 'admin';

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('general');
  const [activeParticipantTab, setActiveParticipantTab] = useState<ParticipantTab>('general');

  const activeTab = isAdmin ? activeAdminTab : activeParticipantTab;

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            {isAdmin ? 'Settings Workspace' : 'Settings'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isAdmin ? 'Manage organization preferences, integrations, and access control.' : 'Manage your account preferences and notifications.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm cursor-pointer">
            Discard Changes
          </button>
          <button className="px-4 py-2 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Settings-Seitenleiste */}
        <div className="w-64 shrink-0 space-y-1">
          {(isAdmin ? adminTabs : participantTabs).map((tab) => (
            <button
              key={tab.id}
              onClick={() => isAdmin ? setActiveAdminTab(tab.id as AdminTab) : setActiveParticipantTab(tab.id as ParticipantTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeTab === tab.id ? 'bg-[#77CF97]/15 text-[#77CF97]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Settings-Inhalt */}
        <div className="flex-1 space-y-6">
          {isAdmin ? (
            <>
              {activeAdminTab === 'general' && <AdminGeneral />}
              {activeAdminTab === 'team' && <SettingsPlaceholder icon={<Users />} title="Team & Access Configuration" description="Manage members, roles, and permissions in your organization." />}
              {activeAdminTab === 'layout' && <SettingsPlaceholder icon={<Layout />} title="Dashboard Layout" description="Customize how your widgets and views are organized." />}
              {activeAdminTab === 'notifications' && <SettingsPlaceholder icon={<BellRing />} title="Notifications" description="Set up alert channels, webhooks, and email digests." />}
              {activeAdminTab === 'voyage' && <SettingsPlaceholder icon={<Globe />} title="Voyage Setup" description="Configure parameters for incoming voyages and sprints." />}
              {activeAdminTab === 'integrations' && <SettingsPlaceholder icon={<Database />} title="Integrations" description="Connect third-party apps like Slack, GitHub, and Discord." />}
              {activeAdminTab === 'security' && <SettingsPlaceholder icon={<Lock />} title="Security Settings" description="Manage API keys, SSO policies, and audit logs." />}
            </>
          ) : (
            <>
              {activeParticipantTab === 'general' && <ParticipantGeneral />}
              {activeParticipantTab === 'notifications' && <ParticipantNotifications />}
              {activeParticipantTab === 'security' && <ParticipantSecurity />}
              {activeParticipantTab === 'account' && <ParticipantAccount />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

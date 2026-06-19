'use client';

import {
  Settings, Users, Layout, BellRing, Globe, Database, Lock,
  Sliders, Search, Save, ChevronDown, ChevronRight,
} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import {useState} from 'react';
import type {SettingsTab} from '@/types';

/** Settings-Tabs mit Icons */
const settingsTabs: {id: SettingsTab; label: string; icon: React.ReactNode}[] = [
  {id: 'general', label: 'General', icon: <Settings className="w-4 h-4" />},
  {id: 'team', label: 'Team & Access', icon: <Users className="w-4 h-4" />},
  {id: 'layout', label: 'Dashboard Layout', icon: <Layout className="w-4 h-4" />},
  {id: 'notifications', label: 'Notifications', icon: <BellRing className="w-4 h-4" />},
  {id: 'voyage', label: 'Voyage Setup', icon: <Globe className="w-4 h-4" />},
  {id: 'integrations', label: 'Integrations', icon: <Database className="w-4 h-4" />},
  {id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" />},
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

/**
 * Einstellungsseite mit 7 Tabs.
 * General-Tab ist vollstaendig implementiert, die uebrigen sind Platzhalter.
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Settings Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage organization preferences, integrations, and access control.</p>
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
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors text-left ${
                activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Settings-Inhalt */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <>
              {/* Organisationsprofil */}
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

              {/* Systemeinstellungen */}
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
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#77CF97]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Require 2FA for Admins</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enforce two-factor authentication for all Workspace Owners.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'team' && (
            <SettingsPlaceholder icon={<Users />} title="Team & Access Configuration" description="Manage members, roles, and permissions in your organization." />
          )}
          {activeTab === 'layout' && (
            <SettingsPlaceholder icon={<Layout />} title="Dashboard Layout" description="Customize how your widgets and views are organized." />
          )}
          {activeTab === 'notifications' && (
            <SettingsPlaceholder icon={<BellRing />} title="Notifications" description="Set up alert channels, webhooks, and email digests." />
          )}
          {activeTab === 'voyage' && (
            <SettingsPlaceholder icon={<Globe />} title="Voyage Setup" description="Configure parameters for incoming voyages and sprints." />
          )}
          {activeTab === 'integrations' && (
            <SettingsPlaceholder icon={<Database />} title="Integrations" description="Connect third-party apps like Slack, GitHub, and Discord." />
          )}
          {activeTab === 'security' && (
            <SettingsPlaceholder icon={<Lock />} title="Security Settings" description="Manage API keys, SSO policies, and audit logs." />
          )}
        </div>
      </div>
    </div>
  );
}

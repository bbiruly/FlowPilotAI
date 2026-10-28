import React, { useState } from 'react';
import {
  Settings,
  Building,
  Users,
  Shield,
  CreditCard,
  Bell,
  Palette,
  Database,
  Plus,
  Trash2,
  Check,
  Moon,
  Sun,
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, showToast } = useApp();

  const [activeSection, setActiveSection] = useState<
    'workspace' | 'team' | 'billing' | 'notifications' | 'appearance' | 'data'
  >('workspace');

  // Workspace form state
  const [workspaceName, setWorkspaceName] = useState('NurtureClean India');
  const [supportEmail, setSupportEmail] = useState('care@nurtureclean.in');
  const [supportPhone, setSupportPhone] = useState('+91 98200 90011');
  const [brandWebsite, setBrandWebsite] = useState('https://store.nurtureclean.in');

  // Team members list
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Aryan Patel', email: 'aryan@nurtureclean.in', role: 'Owner / Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: '2', name: 'Meera Rao', email: 'meera.rao@nurtureclean.in', role: 'Operations Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
    { id: '3', name: 'Kabir Sen', email: 'kabir@nurtureclean.in', role: 'Support Agent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Support Agent');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setTeamMembers(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
      }
    ]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    showToast('Invitation Dispatched', `Invited ${inviteEmail} as ${inviteRole}`, 'success');
  };

  const handleSaveWorkspace = () => {
    showToast('Workspace Saved', 'Company profile details updated', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage your organization profile, team permissions, billing tier, and UI appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {(
            [
              { id: 'workspace', label: 'Workspace Profile', icon: <Building className="w-4 h-4" /> },
              { id: 'team', label: 'Team & Roles', icon: <Users className="w-4 h-4" /> },
              { id: 'billing', label: 'Subscription & Usage', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'appearance', label: 'Appearance & Theme', icon: <Palette className="w-4 h-4" /> },
              { id: 'data', label: 'Data Management', icon: <Database className="w-4 h-4" /> }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                activeSection === tab.id
                  ? 'bg-[#635BFF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          {/* SECTION 1: WORKSPACE */}
          {activeSection === 'workspace' && (
            <div className="space-y-5 max-w-xl text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Company Profile</h3>
                <p className="text-slate-500">Your brand details referenced in AI prompt contexts.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={e => setWorkspaceName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Brand Storefront URL</label>
                  <input
                    type="text"
                    value={brandWebsite}
                    onChange={e => setBrandWebsite(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={e => setSupportEmail(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">WhatsApp Helpline</label>
                    <input
                      type="text"
                      value={supportPhone}
                      onChange={e => setSupportPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveWorkspace}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: TEAM */}
          {activeSection === 'team' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Team Members & Operators</h3>
                  <p className="text-xs text-slate-500">People authorized to manage AI agents and handle escalations.</p>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {teamMembers.map(member => (
                  <div key={member.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{member.name}</div>
                        <div className="text-slate-500">{member.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: BILLING */}
          {activeSection === 'billing' && (
            <div className="space-y-5 max-w-xl text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Subscription & Operations Usage</h3>
                <p className="text-slate-500">Your current plan limits and billing cycle.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#635BFF] bg-[#635BFF]/10 px-2 py-0.5 rounded">
                      Current Plan
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">Growth D2C Plan</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                      ₹12,499 <span className="text-xs text-slate-400 font-normal">/ mo</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Next renewal: Nov 15, 2026</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Monthly Operations Quota</span>
                    <span className="font-mono tabular-nums">12,840 / 25,000 (51%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#635BFF] h-full rounded-full" style={{ width: '51%' }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => showToast('Plan Upgraded', 'Switched to Enterprise Scale Tier', 'success')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs"
                >
                  Upgrade to Enterprise (50k ops)
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: APPEARANCE */}
          {activeSection === 'appearance' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Theme & Appearance</h3>
                <p className="text-slate-500">Choose between crisp daylight or focused night mode.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => {
                    if (theme === 'dark') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-[#635BFF] ring-2 ring-[#635BFF]/20 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Sun className="w-6 h-6 text-amber-500 mb-2" />
                  <div className="font-bold text-slate-900">Light Mode</div>
                  <div className="text-[11px] text-slate-500">High-contrast slate & white canvas</div>
                </div>

                <div
                  onClick={() => {
                    if (theme === 'light') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-[#635BFF] ring-2 ring-[#635BFF]/20 bg-slate-900 text-white'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Moon className="w-6 h-6 text-indigo-400 mb-2" />
                  <div className="font-bold text-slate-900">Dark Mode</div>
                  <div className="text-[11px] text-slate-500">Deep obsidian studio theme</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Notification Channels</h3>
                <p className="text-slate-500">Where should urgent escalation alerts be dispatched?</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Instant WhatsApp Alert for Founder/Lead on Escalation', checked: true },
                  { label: 'Email Digest of Daily Autonomous Resolution Rate', checked: true },
                  { label: 'Slack Webhook dispatch for failed courier NDRs', checked: false }
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.checked} className="accent-[#635BFF]" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: DATA MANAGEMENT */}
          {activeSection === 'data' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Data & Privacy</h3>
                <p className="text-slate-500">Export or purge operational conversation records.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="font-bold text-slate-900">Export Full Data Archive</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Download all customers, conversations, CRM leads, and audit logs as a structured JSON bundle.
                </p>
                <button
                  onClick={() => showToast('Archive Generated', 'JSON bundle ready for download', 'success')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                >
                  Download JSON Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INVITE TEAM MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Invite Team Member</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Roy"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="sneha@nurtureclean.in"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="Operations Lead">Operations Lead (Full access & overrides)</option>
                  <option value="Support Agent">Support Agent (Respond & resolve chats)</option>
                  <option value="Analyst">Analyst (Read-only metrics & export)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  X,
  MessageCircle,
  Instagram,
  Globe,
  Mail,
  ShoppingBag,
  Database,
  FileSpreadsheet,
  Code,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IntegrationItem } from '../../types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, toggleIntegrationConnection, showToast } = useApp();
  const [configuringItem, setConfiguringItem] = useState<IntegrationItem | null>(null);

  const getIntegrationIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-indigo-600" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-amber-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-teal-600" />;
      case 'Database':
        return <Database className="w-5 h-5 text-orange-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-700" />;
      case 'Code':
        return <Code className="w-5 h-5 text-slate-700" />;
      default:
        return <Boxes className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Integrations Hub</h1>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              7 / 8 Connected
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Connect your customer messaging channels, e-commerce storefronts, and warehouse ERP webhooks.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-lg max-w-md">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-0.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" /> Demo Integration Notice
          </div>
          <span>
            Simulated frontend connections. Production live deployments connect via official Meta Cloud API, Shopify Webhooks, and secure server tokens.
          </span>
        </div>
      </div>

      {/* Integrations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {integrations.map(item => {
          const isConnected = item.status === 'connected';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                isConnected ? 'border-slate-200' : 'border-dashed border-slate-300 bg-slate-50/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getIntegrationIcon(item.iconName)}
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.name}</h3>
                  <div className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">
                    {item.category}
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Capabilities Badges */}
                <div className="mt-3 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400">Supported Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {item.capabilities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {isConnected ? item.lastSync : 'Not configured'}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setConfiguringItem(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title="Settings"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleIntegrationConnection(item.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isConnected
                        ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                        : 'bg-[#635BFF] text-white hover:bg-[#5145E5]'
                    }`}
                  >
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIGURATION MODAL */}
      {configuringItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIntegrationIcon(configuringItem.iconName)}
                <h2 className="text-sm font-bold text-slate-900">{configuringItem.name} Config</h2>
              </div>
              <button
                onClick={() => setConfiguringItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Connected Account / Instance
                </label>
                <input
                  type="text"
                  readOnly
                  value={configuringItem.connectedAccount || 'Not configured'}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Webhook Ingestion Endpoint
                </label>
                <input
                  type="text"
                  readOnly
                  value={configuringItem.webhookUrl || 'https://api.flowpilot.ai/v1/webhooks'}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-slate-700 space-y-1">
                <div className="font-semibold text-[#635BFF]">Integration Security Policy</div>
                <p className="text-[11px] leading-snug">
                  All requests signed with HMAC-SHA256 signature verification. Re-attempt backoff with alert routing to #ops-alerts.
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <button
                  onClick={() => {
                    toggleIntegrationConnection(configuringItem.id);
                    setConfiguringItem(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                    configuringItem.status === 'connected'
                      ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {configuringItem.status === 'connected' ? 'Sever Connection' : 'Establish Connection'}
                </button>

                <button
                  onClick={() => {
                    showToast('Settings Saved', 'Integration webhook parameters updated', 'success');
                    setConfiguringItem(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg"
                >
                  Close & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

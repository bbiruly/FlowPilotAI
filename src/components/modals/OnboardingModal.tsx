import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  CheckCircle2,
  ArrowRight,
  X,
  Building,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setCurrentPage, showToast } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [businessType, setBusinessType] = useState('d2c');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['whatsapp', 'website']);
  const [agentFocus, setAgentFocus] = useState('support');

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    setIsOnboardingOpen(false);
    showToast('Onboarding Completed', 'Your AI customer operations workspace is ready!', 'success');
    setCurrentPage('inbox');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold text-xs">
              FP
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Welcome to FlowPilot AI
              </h2>
              <span className="text-[11px] text-slate-500">Step {step} of 4: Workspace Initializer</span>
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-xs space-y-4">
          {/* STEP 1: BUSINESS TYPE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Your Business Model</h3>
                <p className="text-slate-500 mt-0.5">
                  We pre-configure agent responses, Indian English tonality, and NDR couriers for your vertical.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'd2c', title: 'D2C Brand', desc: 'Household, beauty, FMCG, apparel stores' },
                  { id: 'ecom', title: 'Multi-Brand E-com', desc: 'High SKU volume & multi-vendor retail' },
                  { id: 'agency', title: 'Growth Agency', desc: 'Managing customer ops for client brands' }
                ].map(type => (
                  <div
                    key={type.id}
                    onClick={() => setBusinessType(type.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      businessType === type.id
                        ? 'border-[#635BFF] bg-indigo-50/40 ring-2 ring-[#635BFF]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{type.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{type.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CHANNELS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Choose Primary Customer Channels</h3>
                <p className="text-slate-500 mt-0.5">
                  Select where your customers message you most frequently.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { id: 'whatsapp', name: 'WhatsApp Business Cloud API', popular: true },
                  { id: 'instagram', name: 'Instagram Direct Messaging', popular: true },
                  { id: 'website', name: 'Shopify Live Chat Widget', popular: false },
                  { id: 'email', name: 'Email Support (Gmail / Outlook)', popular: false }
                ].map(ch => {
                  const isChecked = selectedChannels.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedChannels(selectedChannels.filter(c => c !== ch.id));
                        } else {
                          setSelectedChannels([...selectedChannels, ch.id]);
                        }
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#635BFF] bg-indigo-50/40 font-semibold text-slate-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {ch.name}
                        {ch.popular && (
                          <span className="text-[9px] font-bold uppercase text-[#635BFF] bg-[#635BFF]/10 px-1.5 py-0.2 rounded">
                            Popular
                          </span>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 accent-[#635BFF]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FIRST AGENT SETUP */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Deploy First AI Agent</h3>
                <p className="text-slate-500 mt-0.5">
                  Pick the primary autonomous role to launch first.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { id: 'support', name: 'Customer Support & Order Tracking', desc: 'Answers order delivery status, return policies, and FAQs 24/7.' },
                  { id: 'sales', name: 'Wholesale & B2B Lead Qualifier', desc: 'Triages corporate bulk inquiries from Instagram reels and web.' },
                  { id: 'ndr', name: 'NDR Courier Address Resolver', desc: 'Proactively verifies landmarks on failed deliveries.' }
                ].map(role => (
                  <div
                    key={role.id}
                    onClick={() => setAgentFocus(role.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      agentFocus === role.id
                        ? 'border-[#635BFF] bg-indigo-50/40 ring-2 ring-[#635BFF]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{role.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{role.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: READY */}
          {step === 4 && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Workspace Ready!</h3>
              <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                NurtureClean India is now equipped with 4 intelligent agents, 6 CRM deal pipelines, and omnichannel tracking.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs cursor-pointer"
            >
              Enter Unified Inbox →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

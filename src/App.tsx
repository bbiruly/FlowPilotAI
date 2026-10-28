/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { LandingScene3D } from './components/landing/LandingScene3D';
import { OverviewDashboard } from './components/pages/OverviewDashboard';
import { UnifiedInbox } from './components/pages/UnifiedInbox';
import { AgentsPage } from './components/pages/AgentsPage';
import { CrmPage } from './components/pages/CrmPage';
import { AutomationsPage } from './components/pages/AutomationsPage';
import { KnowledgePage } from './components/pages/KnowledgePage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { IntegrationsPage } from './components/pages/IntegrationsPage';
import { RulesPage } from './components/pages/RulesPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { SearchModal } from './components/modals/SearchModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainAppContent: React.FC = () => {
  const { currentPage, setCurrentPage, theme } = useApp();

  // If on Landing Page, render the Three.js 3D hero experience
  if (currentPage === 'landing') {
    return (
      <main className="w-full h-screen overflow-hidden">
        <LandingScene3D onEnterApp={() => setCurrentPage('overview')} />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#0A0F1D] text-slate-100' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <TopNav />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'overview' && <OverviewDashboard />}
          {currentPage === 'inbox' && <UnifiedInbox />}
          {currentPage === 'agents' && <AgentsPage />}
          {currentPage === 'crm' && <CrmPage />}
          {currentPage === 'automations' && <AutomationsPage />}
          {currentPage === 'knowledge' && <KnowledgePage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'integrations' && <IntegrationsPage />}
          {currentPage === 'rules' && <RulesPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Overlays & Modals */}
      <SearchModal />
      <OnboardingModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Views
import HomeView from './views/HomeView';
import DashboardView from './views/DashboardView';
import NewInvestigationView from './views/NewInvestigationView';
import UploadView from './views/UploadView';
import CdrOverviewView from './views/CdrOverviewView';
import CallAnalysisView from './views/CallAnalysisView';
import NumberAnalysisView from './views/NumberAnalysisView';
import DateTimeAnalysisView from './views/DateTimeAnalysisView';
import ImeiAnalysisView from './views/ImeiAnalysisView';
import ImsiAnalysisView from './views/ImsiAnalysisView';
import CellIdAnalysisView from './views/CellIdAnalysisView';
import TowerAnalysisView from './views/TowerAnalysisView';
import GeolocationView from './views/GeolocationView';
import ContactAnalysisView from './views/ContactAnalysisView';
import LinkAnalysisView from './views/LinkAnalysisView';
import TimelineView from './views/TimelineView';
import PatternDetectionView from './views/PatternDetectionView';
import CdrComparisonView from './views/CdrComparisonView';
import IpdrAnalysisView from './views/IpdrAnalysisView';
import DataCleaningView from './views/DataCleaningView';
import EvidenceManagementView from './views/EvidenceManagementView';
import ReportGenerationView from './views/ReportGenerationView';
import CaseStudiesView from './views/CaseStudiesView';
import LearningCenterView from './views/LearningCenterView';
import GlossaryView from './views/GlossaryView';
import SettingsView from './views/SettingsView';
import AboutView from './views/AboutView';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import LegalDisclaimerView from './views/LegalDisclaimerView';
import ContactView from './views/ContactView';

function AppContent() {
  const { currentView, loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'new-investigation':
        return <NewInvestigationView />;
      case 'upload-cdr':
        return <UploadView />;
      case 'cdr-overview':
        return <CdrOverviewView />;
      case 'call-analysis':
        return <CallAnalysisView />;
      case 'number-analysis':
        return <NumberAnalysisView />;
      case 'datetime-analysis':
        return <DateTimeAnalysisView />;
      case 'imei-analysis':
        return <ImeiAnalysisView />;
      case 'imsi-analysis':
        return <ImsiAnalysisView />;
      case 'cell-id-analysis':
        return <CellIdAnalysisView />;
      case 'tower-analysis':
        return <TowerAnalysisView />;
      case 'geolocation-analysis':
        return <GeolocationView />;
      case 'contact-analysis':
        return <ContactAnalysisView />;
      case 'link-analysis':
        return <LinkAnalysisView />;
      case 'timeline-analysis':
        return <TimelineView />;
      case 'pattern-detection':
        return <PatternDetectionView />;
      case 'cdr-comparison':
        return <CdrComparisonView />;
      case 'ipdr-analysis':
        return <IpdrAnalysisView />;
      case 'data-cleaning':
        return <DataCleaningView />;
      case 'evidence-management':
        return <EvidenceManagementView />;
      case 'report-generation':
        return <ReportGenerationView />;
      case 'case-studies':
        return <CaseStudiesView />;
      case 'learning-center':
        return <LearningCenterView />;
      case 'cdr-fields-glossary':
        return <GlossaryView />;
      case 'settings':
        return <SettingsView />;
      case 'about-us':
        return <AboutView />;
      case 'privacy-policy':
        return <PrivacyPolicyView />;
      case 'legal-disclaimer':
        return <LegalDisclaimerView />;
      case 'contact-us':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* View Content */}
        <main className="flex-1 p-4 md:p-8 min-w-0 relative">
          {loading && (
            <div className="absolute inset-0 bg-[#070b14]/70 z-30 flex items-center justify-center backdrop-blur-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 shadow-2xl">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs font-mono text-cyan-400">Processing Telecom Forensics Records...</div>
              </div>
            </div>
          )}

          {renderView()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

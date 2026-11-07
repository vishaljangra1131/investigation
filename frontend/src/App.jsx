import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalSearchModal from './components/GlobalSearchModal';

// Existing Views
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

// Priority & Master Modules
import ArthagyaBankView from './views/ArthagyaBankView';
import NcrpGraphView from './views/NcrpGraphView';
import IpIntelligenceView from './views/IpIntelligenceView';
import DomainIntelligenceView from './views/DomainIntelligenceView';
import LbsMappingView from './views/LbsMappingView';
import SuspectIntelligenceView from './views/SuspectIntelligenceView';
import VajraDashboardView from './views/VajraDashboardView';
import ToolsDirectoryView from './views/ToolsDirectoryView';
import CaseManagementView from './views/CaseManagementView';
import TelecomUtilitiesView from './views/TelecomUtilitiesView';
import FinancialUtilitiesView from './views/FinancialUtilitiesView';
import CyberUtilitiesView from './views/CyberUtilitiesView';
import LocationUtilitiesView from './views/LocationUtilitiesView';
import LegalUtilitiesView from './views/LegalUtilitiesView';
import DownloadsView from './views/DownloadsView';
import AdminDashboardView from './views/AdminDashboardView';
import CommunityView from './views/CommunityView';
import PricingView from './views/PricingView';
import OfficerAuthView from './views/OfficerAuthView';

function AppContent() {
  const { currentView, loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      // 1. Overview & Cases
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'new-investigation':
        return <NewInvestigationView />;
      case 'case-management':
        return <CaseManagementView />;
      case 'tools-directory':
        return <ToolsDirectoryView />;

      // 2. Telecom & CDR Investigation
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
      case 'timeline-analysis':
        return <TimelineView />;
      case 'telecom-utilities':
      case 'tsp-lookup':
        return <TelecomUtilitiesView initialTab="tsp" />;
      case 'cell-spyder':
        return <TelecomUtilitiesView initialTab="cell-spyder" />;
      case 'imei-lookup':
        return <TelecomUtilitiesView initialTab="imei" />;
      case 'mcc-mnc-lookup':
        return <TelecomUtilitiesView initialTab="mcc-mnc" />;
      case 'mni-analysis':
        return <TelecomUtilitiesView initialTab="tsp" />;

      // 3. Financial Investigation
      case 'arthagya-bank':
        return <ArthagyaBankView />;
      case 'ncrp-graph':
        return <NcrpGraphView />;
      case 'financial-utilities':
      case 'phonepe-analyzer':
        return <FinancialUtilitiesView initialTab="phonepe" />;
      case 'upi-lookup':
        return <FinancialUtilitiesView initialTab="upi" />;
      case 'ifsc-lookup':
        return <FinancialUtilitiesView initialTab="ifsc" />;
      case 'atm-lookup':
        return <FinancialUtilitiesView initialTab="ifsc" />;
      case 'tsdp-parser':
        return <FinancialUtilitiesView initialTab="tsdp" />;

      // 4. Internet & Cyber Intelligence
      case 'ipdr-analysis':
        return <IpdrAnalysisView />;
      case 'ip-intelligence':
        return <IpIntelligenceView />;
      case 'domain-intelligence':
        return <DomainIntelligenceView />;
      case 'cyber-utilities':
      case 'mac-lookup':
        return <CyberUtilitiesView initialTab="mac" />;
      case 'sms-header-intelligence':
        return <CyberUtilitiesView initialTab="sms-header" />;
      case 'google-analyzer':
        return <CyberUtilitiesView initialTab="google" />;

      // 5. Location & Movement Intelligence
      case 'lbs-mapping':
        return <LbsMappingView />;
      case 'geolocation-analysis':
        return <GeolocationView />;
      case 'location-utilities':
      case 'cctv-calculator':
        return <LocationUtilitiesView initialTab="cctv" />;
      case 'toll-plaza-analysis':
        return <LocationUtilitiesView initialTab="toll" />;
      case 'lat-long-mapper':
      case 'sugam-route':
        return <GeolocationView />;

      // 6. Suspect & Identity Intelligence
      case 'suspect-intelligence':
        return <SuspectIntelligenceView />;
      case 'vajra-dashboard':
        return <VajraDashboardView />;
      case 'imei-analysis':
        return <ImeiAnalysisView />;
      case 'imsi-analysis':
        return <ImsiAnalysisView />;
      case 'cell-id-analysis':
        return <CellIdAnalysisView />;
      case 'tower-analysis':
        return <TowerAnalysisView />;
      case 'ceir-trace':
        return <SuspectIntelligenceView />;

      // 7. Intelligence & Linking
      case 'contact-analysis':
        return <ContactAnalysisView />;
      case 'link-analysis':
        return <LinkAnalysisView />;
      case 'pattern-detection':
        return <PatternDetectionView />;
      case 'cdr-comparison':
        return <CdrComparisonView />;

      // 8. Legal Documentation & Evidence
      case 'evidence-management':
        return <EvidenceManagementView />;
      case 'report-generation':
        return <ReportGenerationView />;
      case 'data-cleaning':
        return <DataCleaningView />;
      case 'legal-utilities':
      case 'lea-templates':
        return <LegalUtilitiesView initialTab="notices" />;
      case 'hash-generator':
        return <LegalUtilitiesView initialTab="hasher" />;
      case 'nodal-directory':
        return <LegalUtilitiesView initialTab="nodal" />;
      case 'police-stations':
        return <LegalUtilitiesView initialTab="nodal" />;
      case 'aadhaar-validator':
        return <LegalUtilitiesView initialTab="aadhaar" />;
      case 'caf-summarizer':
      case 'sampark-vcf':
        return <LegalUtilitiesView initialTab="notices" />;

      // 9. Portal & Platform Reference
      case 'downloads':
        return <DownloadsView />;
      case 'admin-panel':
        return <AdminDashboardView />;
      case 'community':
        return <CommunityView />;
      case 'pricing':
        return <PricingView />;
      case 'officer-auth':
        return <OfficerAuthView />;
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
      {/* Global Tool Search Modal (Ctrl + K) */}
      <GlobalSearchModal />

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
                <div className="text-xs font-mono text-cyan-400">Processing Digital Forensics Intelligence...</div>
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

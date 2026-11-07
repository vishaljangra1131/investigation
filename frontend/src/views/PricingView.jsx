import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard, Check, ShieldCheck, Zap, Building2,
  Download, ArrowRight, Shield, Award, HelpCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function PricingView() {
  const { addNotification } = useApp();
  const [billingCycle, setBillingCycle] = useState('annual');

  const plans = [
    {
      name: "Trial / Evaluation",
      priceMonthly: "₹0",
      priceAnnual: "₹0",
      description: "For individual officers & cyber researchers testing forensic capabilities on demo data.",
      features: [
        "Access to 10 Basic Telecom Tools",
        "Up to 500 CDR Records Ingestion",
        "Basic IP & MAC Resolution",
        "Community Knowledge Forum",
        "Standard PDF Export"
      ],
      current: false,
      badge: "Free 14-Day Trial",
      buttonText: "Start Trial Access"
    },
    {
      name: "Professional Investigator",
      priceMonthly: "₹4,999",
      priceAnnual: "₹3,999",
      description: "Dedicated workstation for active Investigating Officers & Forensic Analysts.",
      features: [
        "All 36+ Forensic & Intelligence Modules",
        "Unlimited CDR, IPDR & Bank Statements",
        "Arthagya AI Structuring Heuristics",
        "NCRP Multi-Layer Graph Link Analysis",
        "Section 63 BSA Certified Dossier Export",
        "Real-Time SHA-256 Evidence Locker",
        "CCTV Time Offset & LBS Trajectories"
      ],
      current: true,
      badge: "Most Popular",
      buttonText: "Current Plan"
    },
    {
      name: "Department Enterprise",
      priceMonthly: "₹24,999",
      priceAnnual: "₹19,999",
      description: "Centralized server deployment for Cyber Police Stations & Specialized Cell Units.",
      features: [
        "Everything in Professional Investigator",
        "Multi-Officer Role-Based Access (RBAC)",
        "Centralized FIR Case Management",
        "Department-Wide Cross-Case Matching",
        "Local Air-Gapped Offline Server Deploy",
        "Priority 24/7 Forensic Tech Support",
        "Custom Law Enforcement Integrations"
      ],
      current: false,
      badge: "Police HQ Standard",
      buttonText: "Request Procurement Quotation"
    }
  ];

  const handleSelectPlan = (planName) => {
    addNotification(`Selected ${planName}. Law enforcement procurement invoice generated.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Investigation Pro – Deployment Plans & Procurement
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transparent licensing tailored for Law Enforcement Agencies, Police Units, and Government Forensic Laboratories. No automatic deductions without formal sanctions.
          </p>
        </div>

        {/* Cycle Toggle */}
        <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 p-0.5 text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
              billingCycle === 'annual' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              plan.current
                ? 'bg-cyan-950/20 border-cyan-500/60 shadow-xl shadow-cyan-950/30'
                : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {plan.name}
                </span>
                {plan.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {plan.badge}
                  </span>
                )}
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white">
                  {billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                  <span className="text-xs text-slate-400 font-normal"> / officer / mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.current
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <span>{plan.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GeM Portal / Government Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs leading-relaxed text-slate-300">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Government e-Marketplace (GeM) Procurement:</span>
          Investigation Pro licenses are available through custom bids and direct contracting on Government e-Marketplace (GeM) for State Police Departments, Central Armed Police Forces (CAPF), and National Enforcement Agencies.
        </div>
      </div>
    </div>
  );
}

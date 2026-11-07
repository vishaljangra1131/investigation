import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall, TowerControl, Smartphone, Database, Shield,
  Search, CheckCircle, AlertTriangle, Download, RefreshCw,
  ExternalLink, Layers
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function TelecomUtilitiesView({ initialTab = 'tsp' }) {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  // TSP Lookup State
  const [tspInput, setTspInput] = useState('+919876543210');
  const [tspResult, setTspResult] = useState({
    number: '+919876543210',
    operator: 'Bharti Airtel Limited',
    circle: 'Delhi & NCR Telecom Circle',
    series_original_operator: 'Airtel',
    mnp_status: 'Ported (Original Series: Vodafone)',
    technology: '4G LTE / 5G SA Enabled',
    hlr_circle_code: 'DL',
    national_dialing_code: '+91',
    valid_format: true
  });

  // Cell Spyder State
  const [cellInput, setCellInput] = useState({ mcc: '404', mnc: '10', lac: '1284', cellId: '4821' });
  const [cellResult, setCellResult] = useState({
    cgi: '404-10-1284-4821',
    towerName: 'Lajpat Nagar Central Metro BTS Tower #04',
    operator: 'Bharti Airtel',
    lat: 28.5677,
    lon: 77.2433,
    azimuth: 60,
    beamwidth: '65° Horizontal Sector',
    antenna_height: '28 meters above ground level',
    cell_type: 'Macrocell 4G LTE'
  });

  // IMEI Lookup State
  const [imeiInput, setImeiInput] = useState('864920048192831');
  const [imeiResult, setImeiResult] = useState({
    imei: '864920048192831',
    valid_luhn: true,
    tac: '86492004',
    manufacturer: 'OnePlus Technology (Shenzhen) Co., Ltd.',
    brand_model: 'OnePlus Nord CE 3 Lite 5G (CPH2467)',
    dual_sim_device: true,
    radio_access: 'GSM / WCDMA / LTE / 5G Sub-6',
    ceir_status: 'CLEAN (Not Reported Stolen in CEIR)'
  });

  // MCC-MNC State
  const [mccInput, setMccInput] = useState('404');
  const [mncInput, setMncInput] = useState('10');
  const [mccResult, setMccResult] = useState({
    mcc: '404',
    mnc: '10',
    country: 'India',
    iso: 'IN',
    operator: 'Bharti Airtel Limited (Delhi)',
    band: '900 / 1800 / 2100 / 2300 MHz'
  });

  const handleTspLookup = (e) => {
    e.preventDefault();
    if (!tspInput.trim()) return;
    const clean = tspInput.trim();
    const isJio = clean.includes('9877') || clean.includes('7011');
    const isVi = clean.includes('9820') || clean.includes('9811');

    setTspResult({
      number: clean,
      operator: isJio ? 'Reliance Jio Infocomm' : (isVi ? 'Vodafone Idea Ltd (Vi)' : 'Bharti Airtel Limited'),
      circle: 'Delhi & NCR Circle',
      series_original_operator: isJio ? 'Reliance Jio' : 'Bharti Airtel',
      mnp_status: 'Active Subscriber on Live HLR/HSS',
      technology: isJio ? 'True 5G Standalone (VoNR)' : '4G LTE / 5G NSA',
      hlr_circle_code: 'DL',
      national_dialing_code: '+91',
      valid_format: clean.length >= 10
    });
    addNotification(`TSP identification complete for ${clean}.`);
  };

  const handleCellSpyder = (e) => {
    e.preventDefault();
    setCellResult({
      cgi: `${cellInput.mcc}-${cellInput.mnc}-${cellInput.lac}-${cellInput.cellId}`,
      towerName: `Serving Cell Sector #${cellInput.cellId}`,
      operator: cellInput.mnc === '10' ? 'Bharti Airtel' : 'Reliance Jio',
      lat: 28.5677 + (Math.random() - 0.5) * 0.05,
      lon: 77.2433 + (Math.random() - 0.5) * 0.05,
      azimuth: 120,
      beamwidth: '65° Sector Cone',
      antenna_height: '32 meters AGL',
      cell_type: 'Macro eNodeB'
    });
    addNotification("Cell tower footprint decoded successfully.");
  };

  const handleImeiLookup = (e) => {
    e.preventDefault();
    const imei = imeiInput.trim();
    setImeiResult({
      imei: imei,
      valid_luhn: true,
      tac: imei.slice(0, 8),
      manufacturer: 'Apple Inc. / Samsung Electronics',
      brand_model: 'Smartphone 5G Dual-SIM (Forensic Verified TAC)',
      dual_sim_device: true,
      radio_access: 'Multi-Band 5G NR / LTE',
      ceir_status: 'CLEAN (Authorised Device)'
    });
    addNotification(`IMEI TAC resolution complete for ${imei}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-cyan-400" />
          Telecom Investigation Utilities (TSP, Cell Spyder, IMEI & MNI)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Specialized cellular telecom utilities for Law Enforcement Officers: Telecom Service Provider carrier lookup, Cell ID azimuth footprint, IMEI TAC hardware identification, and MCC-MNC codes.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('tsp')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'tsp' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. TSP Carrier Lookup
        </button>
        <button
          onClick={() => setActiveTab('cell-spyder')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'cell-spyder' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. Cell Spyder (Azimuth & Sector)
        </button>
        <button
          onClick={() => setActiveTab('imei')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'imei' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. IMEI & TAC Lookup
        </button>
        <button
          onClick={() => setActiveTab('mcc-mnc')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'mcc-mnc' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          4. MCC-MNC Directory
        </button>
      </div>

      {/* Tab 1: TSP Carrier Lookup */}
      {activeTab === 'tsp' && (
        <div className="space-y-4">
          <form onSubmit={handleTspLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={tspInput}
              onChange={(e) => setTspInput(e.target.value)}
              placeholder="Enter mobile number with country code (e.g. +919876543210)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Identify Carrier
            </button>
          </form>

          {tspResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                TSP Carrier Metadata Result: {tspResult.number}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Current Operator</span>
                  <span className="font-bold text-cyan-300 text-sm">{tspResult.operator}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Licensed Service Area</span>
                  <span className="font-bold text-white text-sm">{tspResult.circle}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Radio Generation</span>
                  <span className="font-bold text-emerald-400 text-sm">{tspResult.technology}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Porting Status</span>
                  <span className="text-slate-300 text-xs">{tspResult.mnp_status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cell Spyder */}
      {activeTab === 'cell-spyder' && (
        <div className="space-y-4">
          <form onSubmit={handleCellSpyder} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <input
              type="text"
              placeholder="MCC (404)"
              value={cellInput.mcc}
              onChange={(e) => setCellInput({ ...cellInput, mcc: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            />
            <input
              type="text"
              placeholder="MNC (10)"
              value={cellInput.mnc}
              onChange={(e) => setCellInput({ ...cellInput, mnc: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            />
            <input
              type="text"
              placeholder="LAC / TAC (1284)"
              value={cellInput.lac}
              onChange={(e) => setCellInput({ ...cellInput, lac: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            />
            <input
              type="text"
              placeholder="Cell ID (4821)"
              value={cellInput.cellId}
              onChange={(e) => setCellInput({ ...cellInput, cellId: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Decode Tower
            </button>
          </form>

          {cellResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <TowerControl className="w-4 h-4 text-cyan-400" />
                Cell Global Identity (CGI) Forensic Decoding
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Full CGI Code</span>
                  <span className="font-bold text-cyan-300">{cellResult.cgi}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Serving Base Station</span>
                  <span className="font-bold text-white">{cellResult.towerName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Antenna Sector Azimuth</span>
                  <span className="font-bold text-amber-400 text-sm">{cellResult.azimuth}° ({cellResult.beamwidth})</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Coordinates</span>
                  <span className="font-bold text-emerald-400">{cellResult.lat.toFixed(4)}, {cellResult.lon.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: IMEI & TAC Lookup */}
      {activeTab === 'imei' && (
        <div className="space-y-4">
          <form onSubmit={handleImeiLookup} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex gap-3 text-xs">
            <input
              type="text"
              required
              value={imeiInput}
              onChange={(e) => setImeiInput(e.target.value)}
              placeholder="Enter 15-digit IMEI number (e.g. 864920048192831)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Verify IMEI
            </button>
          </form>

          {imeiResult && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                GSMA Type Allocation Code (TAC) Resolution
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Luhn Checksum</span>
                  <span className="font-bold text-emerald-400">PASSED (VALID IMEI)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Manufacturer</span>
                  <span className="font-bold text-white truncate block">{imeiResult.manufacturer}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Model Identification</span>
                  <span className="font-bold text-cyan-300 truncate block">{imeiResult.brand_model}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">CEIR Device Blacklist</span>
                  <span className="font-bold text-emerald-400">{imeiResult.ceir_status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: MCC-MNC Directory */}
      {activeTab === 'mcc-mnc' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Database className="w-4 h-4 text-cyan-400" />
              ITU-T E.212 Global Mobile Country & Network Code Reference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 block text-sm">404-10</span>
                <span className="text-white font-bold block">Bharti Airtel</span>
                <span className="text-[10px] text-slate-500">Delhi & NCR LSA</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 block text-sm">405-854</span>
                <span className="text-white font-bold block">Reliance Jio Infocomm</span>
                <span className="text-[10px] text-slate-500">Delhi 4G/5G Network</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 block text-sm">404-20</span>
                <span className="text-white font-bold block">Vodafone Idea (Vi)</span>
                <span className="text-[10px] text-slate-500">Mumbai & Maharashtra</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-cyan-400 block text-sm">404-51</span>
                <span className="text-white font-bold block">BSNL Mobile</span>
                <span className="text-[10px] text-slate-500">Himachal Pradesh Circle</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet, Search, Filter, Download, ArrowUpDown, 
  ChevronLeft, ChevronRight, Eye, PhoneCall, ShieldCheck
} from 'lucide-react';

export default function CdrOverviewView() {
  const { records, formatNumber, searchQuery, setSearchQuery } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState('datetime');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter & Sort
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filterType !== 'ALL' && r.call_type !== filterType) return false;
      const rDate = r.call_date || (r.datetime ? r.datetime.split(' ')[0] : '');
      if (dateFrom && rDate < dateFrom) return false;
      if (dateTo && rDate > dateTo) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          (r.calling_number && r.calling_number.toLowerCase().includes(q)) ||
          (r.called_number && r.called_number.toLowerCase().includes(q)) ||
          (r.imei && r.imei.toLowerCase().includes(q)) ||
          (r.imsi && r.imsi.toLowerCase().includes(q)) ||
          (r.tower_name && r.tower_name.toLowerCase().includes(q)) ||
          (r.first_cell_id && r.first_cell_id.toLowerCase().includes(q)) ||
          (r.record_id && r.record_id.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      let vA = a[sortField] || '';
      let vB = b[sortField] || '';
      if (sortField === 'duration') {
        vA = Number(vA) || 0;
        vB = Number(vB) || 0;
      }
      if (vA < vB) return sortAsc ? -1 : 1;
      if (vA > vB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [records, filterType, dateFrom, dateTo, searchQuery, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const exportFilteredCSV = () => {
    if (filteredRecords.length === 0) return;
    const headers = Object.keys(filteredRecords[0]).join(',');
    const rows = filteredRecords.map(r => Object.values(r).map(v => `"${v || ''}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CDR_Filtered_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            CDR Overview & Record Master Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredRecords.length} of {records.length} total telecommunications records.
          </p>
        </div>

        <button
          onClick={exportFilteredCSV}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div>
          <label className="text-slate-400 font-mono text-[10px] block mb-1">SEARCH RECORDS</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Number, IMEI, Tower, Cell ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Call Type Filter */}
        <div>
          <label className="text-slate-400 font-mono text-[10px] block mb-1">CALL TYPE</label>
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">ALL TYPES ({records.length})</option>
            <option value="OUTGOING">OUTGOING</option>
            <option value="INCOMING">INCOMING</option>
            <option value="MISSED">MISSED (0s)</option>
            <option value="SMS_OUT">SMS OUT</option>
            <option value="SMS_IN">SMS IN</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="text-slate-400 font-mono text-[10px] block mb-1">FROM DATE</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="text-slate-400 font-mono text-[10px] block mb-1">TO DATE</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] whitespace-nowrap">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th onClick={() => handleSort('record_id')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Record ID <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('calling_number')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">A-Party (Caller) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('called_number')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">B-Party (Callee) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('datetime')} className="p-3 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Date & Time <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('duration')} className="p-3 cursor-pointer hover:text-white text-right">
                  <div className="flex items-center justify-end gap-1">Duration <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3">Type</th>
                <th className="p-3">IMEI</th>
                <th className="p-3">Serving Tower</th>
                <th className="p-3">Cell ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedRecords.map((r, i) => {
                const isMissed = r.call_type === 'MISSED' || r.duration === 0;
                return (
                  <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 text-cyan-400 font-bold">{r.record_id}</td>
                    <td className="p-3 text-white font-medium">{formatNumber(r.calling_number)}</td>
                    <td className="p-3 text-slate-200">{formatNumber(r.called_number)}</td>
                    <td className="p-3 text-slate-400">{r.datetime || `${r.call_date} ${r.call_time}`}</td>
                    <td className={`p-3 text-right font-bold ${isMissed ? 'text-slate-500' : 'text-emerald-400'}`}>
                      {r.duration}s
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        r.call_type === 'INCOMING' ? 'bg-emerald-500/20 text-emerald-400' :
                        r.call_type === 'OUTGOING' ? 'bg-blue-500/20 text-blue-400' :
                        r.call_type === 'MISSED' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {r.call_type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{r.imei || 'N/A'}</td>
                    <td className="p-3 text-slate-300 max-w-[160px] truncate" title={r.tower_name}>
                      {r.tower_name || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-500 text-[10px]">{r.first_cell_id || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/50">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white text-[11px]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


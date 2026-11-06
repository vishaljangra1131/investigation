import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock, PhoneCall, MessageSquare, Smartphone, MapPin, 
  Filter, Search, Calendar, ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function TimelineView() {
  const { records, formatNumber } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Sorted chronological events
  const timelineEvents = useMemo(() => {
    return [...records]
      .filter(r => {
        if (filterType === 'CALLS' && (r.call_type.includes('SMS') || r.call_type === 'MISSED')) return false;
        if (filterType === 'SMS' && !r.call_type.includes('SMS')) return false;
        if (filterType === 'MISSED' && r.call_type !== 'MISSED') return false;

        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const match = 
            r.calling_number?.toLowerCase().includes(q) ||
            r.called_number?.toLowerCase().includes(q) ||
            r.tower_name?.toLowerCase().includes(q) ||
            r.imei?.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => (a.datetime || '').localeCompare(b.datetime || ''));
  }, [records, filterType, searchFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Chronological Timeline Reconstruction
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Minute-by-minute sequential sequence of calls, text messages, device alterations, and cell tower transitions.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search timeline..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">ALL EVENTS</option>
            <option value="CALLS">VOICE CALLS</option>
            <option value="SMS">SMS TEXTS</option>
            <option value="MISSED">MISSED ONLY</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Total Timeline Events" value={timelineEvents.length} subtitle="Chronological Items" color="cyan" icon={Clock} />
        <StatCard title="First Event" value={timelineEvents[0]?.datetime ? timelineEvents[0].datetime.split(' ')[0] : "N/A"} subtitle={timelineEvents[0]?.datetime ? timelineEvents[0].datetime.split(' ')[1] : ""} color="emerald" />
        <StatCard title="Last Event" value={timelineEvents[timelineEvents.length - 1]?.datetime ? timelineEvents[timelineEvents.length - 1].datetime.split(' ')[0] : "N/A"} subtitle={timelineEvents[timelineEvents.length - 1]?.datetime ? timelineEvents[timelineEvents.length - 1].datetime.split(' ')[1] : ""} color="purple" />
      </div>

      {/* Interactive Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 pl-6 space-y-6">
        {timelineEvents.map((ev, idx) => {
          const isSMS = ev.call_type.includes('SMS');
          const isMissed = ev.call_type === 'MISSED' || ev.duration === 0;
          return (
            <div key={idx} className="relative group">
              {/* Timeline Node Dot */}
              <div className={`
                absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center
                ${isMissed ? 'bg-rose-500' : isSMS ? 'bg-purple-500' : 'bg-cyan-400'}
              `}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{ev.datetime || `${ev.call_date} ${ev.call_time}`}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      ev.call_type === 'INCOMING' ? 'bg-emerald-500/20 text-emerald-400' :
                      ev.call_type === 'OUTGOING' ? 'bg-blue-500/20 text-blue-400' :
                      ev.call_type === 'MISSED' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {ev.call_type}
                    </span>
                  </div>

                  <span className="text-slate-400 text-[11px]">
                    Duration: <span className="text-white font-bold">{ev.duration}s</span>
                  </span>
                </div>

                <div className="text-xs font-mono flex items-center gap-2">
                  <span className="text-white font-bold">{formatNumber(ev.calling_number)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300">{formatNumber(ev.called_number)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    Tower: {ev.tower_name || 'N/A'} ({ev.first_cell_id || 'N/A'})
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-purple-400" />
                    IMEI: {ev.imei || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


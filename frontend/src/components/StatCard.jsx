import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = "cyan", trend }) {
  const colorMap = {
    cyan: {
      bg: "from-cyan-500/10 to-blue-500/5",
      border: "border-cyan-500/20 hover:border-cyan-500/50",
      text: "text-cyan-400",
      iconBg: "bg-cyan-500/20 text-cyan-400"
    },
    blue: {
      bg: "from-blue-500/10 to-indigo-500/5",
      border: "border-blue-500/20 hover:border-blue-500/50",
      text: "text-blue-400",
      iconBg: "bg-blue-500/20 text-blue-400"
    },
    emerald: {
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20 hover:border-emerald-500/50",
      text: "text-emerald-400",
      iconBg: "bg-emerald-500/20 text-emerald-400"
    },
    amber: {
      bg: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20 hover:border-amber-500/50",
      text: "text-amber-400",
      iconBg: "bg-amber-500/20 text-amber-400"
    },
    rose: {
      bg: "from-rose-500/10 to-red-500/5",
      border: "border-rose-500/20 hover:border-rose-500/50",
      text: "text-rose-400",
      iconBg: "bg-rose-500/20 text-rose-400"
    },
    purple: {
      bg: "from-purple-500/10 to-pink-500/5",
      border: "border-purple-500/20 hover:border-purple-500/50",
      text: "text-purple-400",
      iconBg: "bg-purple-500/20 text-purple-400"
    }
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`
      relative p-4 rounded-xl bg-gradient-to-br ${c.bg} bg-slate-900/80
      border ${c.border} transition-all duration-300 hover:shadow-lg
    `}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${c.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className={`text-2xl font-bold font-mono tracking-tight ${c.text}`}>
          {value}
        </div>
        {trend && (
          <span className="text-[11px] font-mono text-emerald-400 flex items-center">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
}


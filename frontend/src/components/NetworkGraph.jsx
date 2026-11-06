import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export default function NetworkGraph({ records, onSelectNumber }) {
  const { formatNumber } = useApp();
  const [selectedNode, setSelectedNode] = useState(null);

  // Compute graph data
  const { nodes, edges } = useMemo(() => {
    if (!records || records.length === 0) return { nodes: [], edges: [] };

    const nodeMap = new Map();
    const edgeMap = new Map();

    records.forEach(r => {
      const src = r.calling_number;
      const dst = r.called_number;
      if (!src || !dst || src === 'UNKNOWN' || dst === 'UNKNOWN') return;

      // Update node counts
      [src, dst].forEach(num => {
        if (!nodeMap.has(num)) {
          nodeMap.set(num, { id: num, count: 0, incoming: 0, outgoing: 0 });
        }
      });
      nodeMap.get(src).count += 1;
      nodeMap.get(src).outgoing += 1;
      nodeMap.get(dst).count += 1;
      nodeMap.get(dst).incoming += 1;

      // Update edge counts
      const edgeKey = `${src}->${dst}`;
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, { source: src, target: dst, weight: 0 });
      }
      edgeMap.get(edgeKey).weight += 1;
    });

    // Top 12 nodes by volume for clean layout
    const sortedNodes = Array.from(nodeMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    const validNodeIds = new Set(sortedNodes.map(n => n.id));

    // Position nodes in a radial layout around the primary center
    const width = 640;
    const height = 440;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 160;

    const positionedNodes = sortedNodes.map((n, idx) => {
      if (idx === 0) {
        return { ...n, x: centerX, y: centerY, isCenter: true };
      }
      const angle = ((idx - 1) / (sortedNodes.length - 1)) * 2 * Math.PI;
      return {
        ...n,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        isCenter: false
      };
    });

    const posMap = new Map(positionedNodes.map(n => [n.id, n]));

    const filteredEdges = Array.from(edgeMap.values())
      .filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map(e => ({
        ...e,
        sourceNode: posMap.get(e.source),
        targetNode: posMap.get(e.target)
      }));

    return { nodes: positionedNodes, edges: filteredEdges };
  }, [records]);

  return (
    <div className="relative w-full h-[480px] bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Communication Link Network Graph ({nodes.length} Nodes, {edges.length} Links)
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Click any node to isolate target communication
        </span>
      </div>

      <div className="flex-1 relative">
        <svg viewBox="0 0 640 440" className="w-full h-full select-none">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, idx) => {
            if (!e.sourceNode || !e.targetNode) return null;
            const isHighlighted = selectedNode === e.source || selectedNode === e.target;
            const strokeColor = isHighlighted ? '#38bdf8' : '#1e293b';
            const strokeWidth = Math.min(6, Math.max(1.5, e.weight / 2));
            return (
              <g key={idx}>
                <line
                  x1={e.sourceNode.x}
                  y1={e.sourceNode.y}
                  x2={e.targetNode.x}
                  y2={e.targetNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={selectedNode ? (isHighlighted ? 0.9 : 0.2) : 0.6}
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const isSelected = selectedNode === n.id;
            const nodeRadius = n.isCenter ? 26 : Math.min(22, Math.max(14, 10 + n.count / 3));
            return (
              <g
                key={n.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => {
                  setSelectedNode(isSelected ? null : n.id);
                  if (onSelectNumber) onSelectNumber(n.id);
                }}
              >
                {/* Glow ring */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={nodeRadius + 4}
                  fill={n.isCenter ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.15)'}
                  className={n.isCenter ? 'animate-pulse' : ''}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={nodeRadius}
                  fill={n.isCenter ? '#0891b2' : (isSelected ? '#0284c7' : '#0f172a')}
                  stroke={isSelected ? '#38bdf8' : (n.isCenter ? '#22d3ee' : '#334155')}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={n.isCenter ? "11" : "9"}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {n.count}
                </text>
                <text
                  x={n.x}
                  y={n.y + nodeRadius + 14}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {formatNumber(n.id).slice(-8)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Box */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-cyan-500/40 rounded-lg p-3 text-xs shadow-xl backdrop-blur-md max-w-xs">
            <div className="font-mono text-cyan-400 font-bold mb-1">
              {formatNumber(selectedNode)}
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div>Total Communications: <span className="font-bold text-white">{nodes.find(n => n.id === selectedNode)?.count}</span></div>
              <div>Outgoing: <span className="text-cyan-400 font-mono">{nodes.find(n => n.id === selectedNode)?.outgoing}</span></div>
              <div>Incoming: <span className="text-emerald-400 font-mono">{nodes.find(n => n.id === selectedNode)?.incoming}</span></div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="mt-2 text-[10px] text-slate-400 hover:text-white underline"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


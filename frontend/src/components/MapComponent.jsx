import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle } from 'lucide-react';

export default function MapComponent({ towers = [], trajectory = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default to New Delhi coordinates
    const defaultCenter = [28.6139, 77.2090];
    const initialCenter = towers.length > 0 && towers[0].lat ? [towers[0].lat, towers[0].lon] : defaultCenter;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 11,
        zoomControl: true
      });

      // Dark style OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const latLngs = [];

    // Add Tower Markers
    towers.forEach(t => {
      if (!t.lat || !t.lon) return;
      const pos = [t.lat, t.lon];
      latLngs.push(pos);

      // Pulse coverage circle
      L.circle(pos, {
        radius: 800, // 800m approximate urban sector coverage radius
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.12,
        weight: 1
      }).addTo(map);

      // Custom tower pin
      const marker = L.circleMarker(pos, {
        radius: Math.min(16, Math.max(7, 5 + Math.sqrt(t.event_count || 1))),
        fillColor: '#0284c7',
        color: '#38bdf8',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #0f172a; min-width: 180px;">
          <b style="font-size: 12px; color: #0369a1;">${t.tower_name || 'Cell Tower'}</b><br/>
          <hr style="margin: 4px 0; border: 0; border-top: 1px solid #cbd5e1;"/>
          <b>Cell ID:</b> ${t.cell_id || 'N/A'}<br/>
          <b>LAC / TAC:</b> ${t.lac || 'N/A'}<br/>
          <b>Recorded Events:</b> <span style="color: #b91c1c; font-weight: bold;">${t.event_count || 0}</span><br/>
          <b>Coordinates:</b> ${t.lat.toFixed(4)}, ${t.lon.toFixed(4)}<br/>
          <b>Sector Azimuth:</b> ${t.azimuth !== undefined ? t.azimuth + '°' : 'Omni'}
        </div>
      `);
    });

    // Add Trajectory Polyline (Chronological serving cell transitions)
    if (trajectory && trajectory.length > 1) {
      const routePoints = trajectory
        .filter(p => p.lat && p.lon)
        .map(p => [p.lat, p.lon]);

      if (routePoints.length > 1) {
        L.polyline(routePoints, {
          color: '#f59e0b',
          weight: 2.5,
          opacity: 0.75,
          dashArray: '6, 8',
          lineCap: 'round'
        }).addTo(map);
      }
    }

    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 14 });
    }
  }, [towers, trajectory]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-xl min-h-[440px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating map legend */}
        <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-xs space-y-1.5 shadow-lg">
          <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wide font-mono">Map Legend</div>
          <div className="flex items-center gap-2 text-slate-300 text-[10px]">
            <span className="w-3 h-3 rounded-full bg-cyan-500 border border-cyan-300 inline-block"></span>
            <span>Serving Cell Tower</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[10px]">
            <span className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500 inline-block"></span>
            <span>Approx. Sector Footprint (800m)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[10px]">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 inline-block"></span>
            <span>Chronological Cell Sequence</span>
          </div>
        </div>
      </div>

      {/* Mandatory Forensic Disclaimer Bar */}
      <div className="mt-2.5 p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Forensic Location Notice:</span> Cellular antenna coordinates represent the physical installation site of the serving base station and its approximate radio coverage sector. Historical CDR records reflect radio cell handovers and do NOT constitute exact GPS positioning of individuals.
        </div>
      </div>
    </div>
  );
}


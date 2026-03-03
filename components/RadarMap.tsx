"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";

export function RadarMap({ lat, lon }: { lat: number; lon: number }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Radar</h2>
        <p className="text-xs text-slate-300/70">RainViewer tiles</p>
      </div>
      <div className="h-[420px]">
        <MapContainer
          center={[lat, lon]}
          zoom={9}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TileLayer
            attribution='&copy; RainViewer'
            opacity={0.55}
            url="https://tilecache.rainviewer.com/v2/radar/nowcast_0/256/{z}/{x}/{y}/2/1_1.png"
          />
        </MapContainer>
      </div>
    </section>
  );
}

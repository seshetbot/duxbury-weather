"use client";

import { RadarMap } from "@/components/RadarMap";

export function RadarSection({ lat, lon }: { lat: number; lon: number }) {
  return <RadarMap lat={lat} lon={lon} />;
}

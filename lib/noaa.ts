import { DUXBURY } from "@/lib/weather";

export type TideStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
};

export type TidePrediction = {
  t: string; // ISO-ish local timestamp
  v: string; // water level
  type: "H" | "L";
};

// Find nearest station that supports tide predictions using NOAA MDAPI.
export async function fetchNearestTideStation(): Promise<TideStation> {
  const url = new URL("https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json");
  url.searchParams.set("type", "tidepredictions");
  url.searchParams.set("units", "metric");
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(DUXBURY.lat));
  url.searchParams.set("lon", String(DUXBURY.lon));
  url.searchParams.set("radius", "80");

  const res = await fetch(url.toString(), {
    // NOAA station list can exceed Next.js data cache limits; don't cache it.
    cache: "no-store",
    headers: { "User-Agent": "duxbury-weather (openclaw demo)" },
  });
  if (!res.ok) {
    throw new Error(`NOAA MDAPI station lookup failed: ${res.status}`);
  }
  const data = await res.json();
  const stations = (data?.stations ?? []) as Array<Record<string, unknown>>;
  if (!stations.length) {
    throw new Error("No NOAA tide stations found near Duxbury");
  }

  const best = stations
    .map((s) => ({
      id: String(s.id ?? s.stationId ?? ""),
      name: String(s.name ?? ""),
      lat: Number(s.lat),
      lng: Number(s.lng),
      distanceKm: typeof s.distance === "number" ? s.distance : undefined,
    }))
    .filter((s) => s.id && Number.isFinite(s.lat) && Number.isFinite(s.lng))
    .sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999))[0];

  if (!best) {
    throw new Error("Could not parse NOAA station list");
  }

  return best;
}

export async function fetchTidePredictions(): Promise<{ station: TideStation; predictions: TidePrediction[] }> {
  const station = await fetchNearestTideStation();

  const now = new Date();
  const begin = new Date(now);
  begin.setDate(begin.getDate() - 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 2);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  const url = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter");
  url.searchParams.set("product", "predictions");
  url.searchParams.set("application", "duxbury-weather");
  url.searchParams.set("begin_date", fmt(begin));
  url.searchParams.set("end_date", fmt(end));
  url.searchParams.set("datum", "MLLW");
  url.searchParams.set("station", station.id);
  url.searchParams.set("time_zone", "lst_ldt");
  url.searchParams.set("units", "english");
  url.searchParams.set("interval", "hilo");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { "User-Agent": "duxbury-weather (openclaw demo)" },
  });

  if (!res.ok) {
    throw new Error(`NOAA tide predictions failed: ${res.status}`);
  }
  const data = await res.json();
  const predictions = (data?.predictions ?? []) as TidePrediction[];
  return { station, predictions };
}

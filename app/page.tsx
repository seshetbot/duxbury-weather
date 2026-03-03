import { format } from "date-fns";
import { fetchDuxburyWeather, weatherCodeLabel, DUXBURY } from "@/lib/weather";
import { fetchActiveAlerts } from "@/lib/nws";
import { fetchTidePredictions } from "@/lib/noaa";
import { logWeatherView } from "@/app/actions/logWeatherView";
import { AlertsPanel } from "@/components/AlertsPanel";
import { TidesPanel } from "@/components/TidesPanel";
import { RadarPanel } from "@/components/RadarPanel";

export default async function Home() {
  const [weather, alerts, tides] = await Promise.all([
    fetchDuxburyWeather(),
    fetchActiveAlerts().catch(() => []),
    fetchTidePredictions().catch(() => null),
  ]);

  // Fire-and-forget log (safe if supabase not configured).
  void logWeatherView();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-white">
      <header className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.4em] text-sky-200/70">Live weather</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{weather.locationName}</h1>
        <p className="mt-2 text-slate-200/80">
          Updated {format(new Date(weather.current.time), "EEE p")} · {weatherCodeLabel(weather.current.weatherCode)}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">Temperature</p>
            <p className="mt-2 text-4xl font-semibold">{Math.round(weather.current.temperatureC)}°F</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">Wind</p>
            <p className="mt-2 text-4xl font-semibold">{Math.round(weather.current.windSpeedKph)} mph</p>
            <p className="mt-1 text-sm text-slate-300/70">Dir {Math.round(weather.current.windDirectionDeg)}°</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">Today</p>
            <p className="mt-2 text-lg text-slate-200/80">
              Hourly outlook below (precip, wind gusts, temp).
            </p>
          </div>
        </div>
      </header>

      <section className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold">Next 24 hours</h2>
          <p className="text-sm text-slate-300/70">America/New_York</p>
        </div>
        <div className="divide-y divide-white/10">
          {weather.hourly.map((point) => (
            <div key={point.time} className="grid grid-cols-2 gap-3 px-6 py-4 sm:grid-cols-5">
              <div className="font-mono text-sm text-slate-200">
                {format(new Date(point.time), "EEE p")}
              </div>
              <div className="text-slate-100">{Math.round(point.temperatureC)}°F</div>
              <div className="text-slate-200/80">Precip {point.precipMm.toFixed(2)} in</div>
              <div className="text-slate-200/80">Wind {Math.round(point.windSpeedKph)} mph</div>
              <div className="text-slate-200/80">Gust {Math.round(point.windGustKph)} mph</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <AlertsPanel alerts={alerts} />
        {tides ? <TidesPanel station={tides.station} predictions={tides.predictions} /> : null}
      </div>

      <div className="mt-10">
        <RadarPanel />
      </div>

      <footer className="mt-10 text-xs text-slate-400">
        Data sources: Open-Meteo, NOAA CO-OPS, NWS, RainViewer. This is a demo app; verify conditions before heading out.
      </footer>
    </main>
  );
}

export function RadarPanel() {
  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Radar</h2>
        <p className="text-xs text-slate-300/70">NOAA NEXRAD (KBOX)</p>
      </div>
      <div className="bg-slate-950/40 p-4">
        <img
          src="https://radar.weather.gov/ridge/standard/KBOX_loop.gif"
          alt="NEXRAD radar loop (KBOX)"
          className="h-auto w-full rounded-2xl border border-white/10"
        />
        <p className="mt-3 text-xs text-slate-400">
          Source: radar.weather.gov. If this is blank, NOAA may be rate-limiting or blocking hotlinking.
        </p>
      </div>
    </section>
  );
}

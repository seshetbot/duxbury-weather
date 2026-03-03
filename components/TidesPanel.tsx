import { format } from "date-fns";
import type { TidePrediction, TideStation } from "@/lib/noaa";

function labelForType(type: "H" | "L") {
  return type === "H" ? "High" : "Low";
}

export function TidesPanel({
  station,
  predictions,
}: {
  station: TideStation;
  predictions: TidePrediction[];
}) {
  const next = predictions.slice(0, 8);

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">NOAA tides</h2>
        <p className="text-xs text-slate-300/70">
          Station: <span className="font-mono">{station.id}</span> · {station.name}
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
        <div className="grid grid-cols-3 gap-2 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300/70">
          <span>Time</span>
          <span>Type</span>
          <span className="text-right">Height</span>
        </div>
        <div className="divide-y divide-white/10">
          {next.map((p) => (
            <div key={`${p.t}-${p.type}`} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm">
              <span className="font-mono text-slate-100">
                {format(new Date(p.t), "EEE p")}
              </span>
              <span className={p.type === "H" ? "text-sky-200" : "text-indigo-200"}>
                {labelForType(p.type)}
              </span>
              <span className="text-right text-slate-100">{Number(p.v).toFixed(2)} ft</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Source: api.tidesandcurrents.noaa.gov. Cached ~1 hour.
      </p>
    </section>
  );
}

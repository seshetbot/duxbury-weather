import { format } from "date-fns";
import type { NwsAlert } from "@/lib/nws";

export function AlertsPanel({ alerts }: { alerts: NwsAlert[] }) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Storm alerts</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            alerts.length ? "bg-rose-500/20 text-rose-200" : "bg-emerald-500/15 text-emerald-200"
          }`}
        >
          {alerts.length ? `${alerts.length} active` : "None"}
        </span>
      </div>

      {alerts.length === 0 ? (
        <p className="mt-3 text-sm text-slate-200/75">No active NWS alerts for Duxbury right now.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {alerts.map((a) => (
            <article key={a.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">{a.severity}</p>
                  <h3 className="text-base font-semibold text-white">{a.event}</h3>
                </div>
                <p className="text-xs text-slate-300/70">
                  {a.sent ? format(new Date(a.sent), "EEE p") : ""}
                </p>
              </header>
              <p className="mt-2 text-sm text-slate-100/90">{a.headline}</p>
              {a.instruction ? (
                <p className="mt-2 text-sm text-sky-200/80">{a.instruction}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">Source: api.weather.gov (NWS). Cached ~2 minutes.</p>
    </section>
  );
}

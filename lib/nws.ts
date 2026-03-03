import { DUXBURY } from "@/lib/weather";

export type NwsAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  sent: string;
  effective: string | null;
  ends: string | null;
  description: string;
  instruction: string | null;
};

export async function fetchActiveAlerts(): Promise<NwsAlert[]> {
  const url = new URL("https://api.weather.gov/alerts/active");
  url.searchParams.set("point", `${DUXBURY.lat},${DUXBURY.lon}`);

  const res = await fetch(url.toString(), {
    next: { revalidate: 120 },
    headers: {
      // NWS requires a descriptive UA.
      "User-Agent": "duxbury-weather (Jeff Woodruff; openclaw demo)",
      Accept: "application/geo+json",
    },
  });

  if (!res.ok) {
    throw new Error(`NWS alerts failed: ${res.status}`);
  }

  const data = await res.json();
  const features = (data?.features ?? []) as Array<Record<string, unknown>>;

  return features
    .map((f) => {
      const props = (f.properties ?? {}) as Record<string, unknown>;
      return {
        id: String(f.id ?? props.id ?? ""),
        event: String(props.event ?? ""),
        headline: String(props.headline ?? props.description ?? ""),
        severity: String(props.severity ?? "unknown"),
        urgency: String(props.urgency ?? "unknown"),
        sent: String(props.sent ?? ""),
        effective: typeof props.effective === "string" ? props.effective : null,
        ends: typeof props.ends === "string" ? props.ends : null,
        description: String(props.description ?? ""),
        instruction: typeof props.instruction === "string" ? props.instruction : null,
      } satisfies NwsAlert;
    })
    .filter((a) => a.id && a.event);
}

export type CurrentWeather = {
  temperatureC: number;
  windSpeedKph: number;
  windDirectionDeg: number;
  weatherCode: number;
  time: string;
};

export type HourPoint = {
  time: string;
  temperatureC: number;
  precipMm: number;
  windSpeedKph: number;
  windGustKph: number;
};

export type WeatherSnapshot = {
  locationName: string;
  lat: number;
  lon: number;
  updatedAt: string;
  current: CurrentWeather;
  hourly: HourPoint[];
};

// Duxbury, MA (approx)
export const DUXBURY = { lat: 42.0418, lon: -70.6723, name: "Duxbury, Massachusetts" };

export function weatherCodeLabel(code: number): string {
  const map: Record<number, string> = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Heavy showers",
    82: "Violent showers",
    95: "Thunderstorm",
  };
  return map[code] ?? `Code ${code}`;
}

export async function fetchDuxburyWeather(): Promise<WeatherSnapshot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(DUXBURY.lat));
  url.searchParams.set("longitude", String(DUXBURY.lon));
  url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m");
  url.searchParams.set(
    "hourly",
    "temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m",
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "America/New_York");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo failed: ${res.status}`);
  }
  const data = await res.json();

  const current = data.current;
  const hourly = data.hourly;

  // convert to “C/kph/mm” style types? We’re actually using F/mph/in but keep names simple.
  const points: HourPoint[] = hourly.time.slice(0, 24).map((time: string, idx: number) => ({
    time,
    temperatureC: hourly.temperature_2m[idx],
    precipMm: hourly.precipitation[idx],
    windSpeedKph: hourly.wind_speed_10m[idx],
    windGustKph: hourly.wind_gusts_10m[idx],
  }));

  return {
    locationName: DUXBURY.name,
    lat: DUXBURY.lat,
    lon: DUXBURY.lon,
    updatedAt: new Date().toISOString(),
    current: {
      temperatureC: current.temperature_2m,
      windSpeedKph: current.wind_speed_10m,
      windDirectionDeg: current.wind_direction_10m,
      weatherCode: current.weather_code,
      time: current.time,
    },
    hourly: points,
  };
}

"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [city, setCity] = useState("Lucknow");

  async function loadWeather(searchCity: string) {
    const res = await fetch(`/api/weather?city=${searchCity}`);
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    loadWeather(city);
  }, []);

  if (!data) return <p>Loading...</p>;

  const current = data.current?.[0];
  const history = data.history;
  const forecast = data.forecast?.DailyForecasts;

  return (
    <main style={{ padding: 40 }}>
      <h1>Weather Dashboard</h1>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={city}
          placeholder="Search city..."
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: 8 }}
        />

        <button
          onClick={() => loadWeather(city)}
          style={{ marginLeft: 10, padding: 8 }}
        >
          Search
        </button>
      </div>

      {/* Current Weather */}
      <h2>{data.city}</h2>
      <p>{current?.WeatherText}</p>
      <p>
        {current?.Temperature?.Metric?.Value}
        {current?.Temperature?.Metric?.Unit}
      </p>

      {/* 24 Hour History */}
      <h3>Last 24 Hours</h3>

      {history?.map((h: any, i: number) => (
        <div key={i}>
          {new Date(h.LocalObservationDateTime).toLocaleTimeString()} —
          {h.Temperature.Metric.Value}°
        </div>
      ))}

      {/* 5 Day Forecast */}
      <h3>5 Day Forecast</h3>

      {forecast?.map((day: any, i: number) => (
        <div key={i}>
          <strong>
            {new Date(day.Date).toLocaleDateString()}
          </strong>

          <p>
            Min: {day.Temperature.Minimum.Value}°
            / Max: {day.Temperature.Maximum.Value}°
          </p>

          <p>{day.Day.IconPhrase}</p>
        </div>
      ))}
    </main>
  );
}
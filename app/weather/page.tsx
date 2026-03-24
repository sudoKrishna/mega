"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [city, setCity] = useState("Bareilly");
  const [loading, setLoading] = useState(true);

  async function loadWeather(searchCity: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(searchCity)}`);
      if (!res.ok) throw new Error("Weather API error");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      alert("Could not load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(city);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-medium tracking-tight">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
          <p className="text-xl">Fetching premium weather…</p>
        </div>
      </div>
    );
  }

  const current = data.current?.[0] || {};
  const history = data.history || [];
  const forecast = data.forecast?.DailyForecasts || [];

  
  const getBackgroundVideo = (weatherText: string) => {
    const text = weatherText.toLowerCase();

    if (text.includes("rain") || text.includes("shower") || text.includes("drizzle")) {
      return "/rain.mp4";
    }
    if (text.includes("cloud") || text.includes("overcast")) {
      return "/sunny.mp4";
    }
    if (text.includes("snow") || text.includes("flurry")) {
      return "/rain.mp4";
    }
    if (text.includes("clear") || text.includes("sun") || text.includes("sunny")) {
      return "/sunny.mp4";
    }

    return "/sunny.mp4"; 
  };

  const videoSrc = getBackgroundVideo(current.WeatherText || "Clear");

  // 24-hour chart data
  const hourlyTemps = history.map((h: any) => ({
    time: new Date(h.LocalObservationDateTime).getHours(),
    temp: Math.round(h.Temperature.Metric.Value),
  }));

  const chartWidth = 520;
  const chartHeight = 220;
  const maxTemp = Math.max(...hourlyTemps.map((p: any) => p.temp), 40);
  const minTemp = Math.min(...hourlyTemps.map((p: any) => p.temp), 0);
  const range = maxTemp - minTemp || 1;

  const points = hourlyTemps
    .map((point: any, i: number) => {
      const x = (i / (hourlyTemps.length - 1)) * chartWidth;
      const y = chartHeight - ((point.temp - minTemp) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const windDirection = current.Wind?.Direction?.Degrees || 0;
  const windSpeed = current.Wind?.Speed?.Metric?.Value || 0;
  const uvIndex = current.UVIndex || 3;
  const uvPercent = Math.min((uvIndex / 11) * 100, 100);
  const humidity = current.RelativeHumidity || 65;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
  
      <video
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-[2] brightness-75"
        src={videoSrc}
      />

      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-[-1]" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 py-8 lg:px-12 lg:py-10">
        {/* Top search bar */}
        <div className="flex justify-end mb-8">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl px-6 py-3 flex items-center shadow-2xl w-full max-w-md">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search any city…"
              className="flex-1 bg-transparent outline-none text-lg tracking-[-0.5px] placeholder:text-white/40"
              onKeyDown={(e) => e.key === "Enter" && loadWeather(city)}
            />
            <button
              onClick={() => loadWeather(city)}
              className="ml-4 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-6 py-2 rounded-3xl backdrop-blur-md"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* HERO SECTION */}
          <div className="lg:w-2/5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl flex flex-col justify-between min-h-[520px] hover:scale-[1.02] transition-transform">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-6xl">☀️</div>
                <div>
                  <h1 className="text-5xl font-semibold tracking-[-1.5px]">{data.city || city}</h1>
                  <p className="text-white/70 text-2xl tracking-tight">{current.WeatherText}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline gap-1">
                <span className="text-[9rem] leading-none font-semibold tracking-[-6px]">
                  {Math.round(current.Temperature?.Metric?.Value || 28)}
                </span>
                <span className="text-5xl font-light text-white/60 mt-8">°C</span>
              </div>

              <div className="flex items-center justify-between text-xl tracking-tight mt-2">
                <div>
                  H{" "}
                  <span className="font-semibold">
                    {Math.round(current.Temperature?.Metric?.Value || 32)}°
                  </span>
                </div>
                <div className="h-px flex-1 bg-white/20 mx-6"></div>
                <div>
                  L{" "}
                  <span className="font-semibold">
                    {Math.round(current.Temperature?.Metric?.Value || 24) - 8}°
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm uppercase tracking-[1px] text-white/50 flex items-center gap-2 mt-8">
              <div className="flex-1 h-px bg-white/20"></div>
              Updated just now
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
          </div>

        
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-fr">
            {/* 24-HOUR CHART */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group">
              <div className="flex justify-between items-baseline mb-6">
                <h3 className="text-xl font-medium tracking-tight">24‑hour forecast</h3>
                <span className="text-sm text-white/50">°C • Today</span>
              </div>

              <div className="relative">
                <svg
                  width={chartWidth}
                  height={chartHeight}
                  className="w-full max-w-full overflow-visible"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                >
                  <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {Array.from({ length: 5 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={(chartHeight / 4) * i}
                      x2={chartWidth}
                      y2={(chartHeight / 4) * i}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}

                  <polyline
                    points={points}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg"
                  />

                  <polyline
                    points={`${points} ${chartWidth},${chartHeight} 0,${chartHeight}`}
                    fill="url(#tempGradient)"
                  />

                  {hourlyTemps.map((point: any, i: number) => {
                    const x = (i / (hourlyTemps.length - 1)) * chartWidth;
                    const y = chartHeight - ((point.temp - minTemp) / range) * chartHeight;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#60a5fa"
                        className="group-hover:scale-125 transition-transform"
                      />
                    );
                  })}
                </svg>

                <div className="flex justify-between text-xs text-white/40 mt-3 px-1">
                  {hourlyTemps.slice(0, 8).map((p: any, i: number) => (
                    <div key={i} className="text-center">
                      {p.time}:00
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5-DAY FORECAST */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-medium tracking-tight mb-6">5‑day outlook</h3>
              <div className="flex-1 space-y-6">
                {forecast.slice(0, 5).map((day: any, i: number) => {
                  const min = day.Temperature.Minimum.Value;
                  const max = day.Temperature.Maximum.Value;
                  const rangeBar = ((max - min) / 40) * 100;
                  return (
                    <div key={i} className="flex items-center gap-6 group">
                      <div className="w-20 font-medium text-white/70">
                        {new Date(day.Date).toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="flex-1 h-2.5 bg-white/10 rounded-3xl relative overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-blue-300 to-orange-300 rounded-3xl transition-all group-hover:brightness-110"
                          style={{ width: `${rangeBar}%`, left: `${(min / 40) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-4 text-right font-medium">
                        <span className="text-white/70">{Math.round(min)}°</span>
                        <span>{Math.round(max)}°</span>
                      </div>
                      <div className="text-3xl w-8">
                        {day.Day.IconPhrase.includes("Sun") ? "☀️" : "☁️"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE RAIN RADAR */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-medium tracking-tight mb-4">Live rain radar</h3>
              <div className="w-full aspect-video bg-[#0a1321] rounded-2xl relative flex items-center justify-center overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,#0a1321_1px)] bg-[length:20px_20px] opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-64 h-64 border-4 border-blue-400 rounded-full animate-[ping_4s_linear_infinite] opacity-30"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-64 h-64 border-4 border-blue-400 rounded-full animate-[ping_4s_linear_infinite] opacity-20 absolute"
                    style={{ animationDelay: "1.2s" }}
                  ></div>
                </div>
                <div className="text-center z-10">
                  <div className="text-5xl mb-2">🌧️</div>
                  <p className="text-white/70 text-lg tracking-tight">Light rain detected 12 km NW</p>
                  <p className="text-xs text-blue-300">Updated live • 14:51 IST</p>
                </div>
                <div className="absolute bottom-8 left-8 text-4xl drop-shadow-2xl">📍</div>
              </div>
            </div>

            {/* UV Index */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center">
              <div className="text-sm font-medium tracking-widest mb-4 text-white/60">UV INDEX</div>
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15" fill="none" stroke="#ffffff20" strokeWidth="4" />
                  <circle
                    cx="21"
                    cy="21"
                    r="15"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="4"
                    strokeDasharray={`${uvPercent * 0.94} 94`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-semibold">{uvIndex}</span>
                  <span className="text-xs text-white/50 -mt-1">moderate</span>
                </div>
              </div>
            </div>

            {/* Wind Compass */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center">
              <div className="text-sm font-medium tracking-widest mb-4 text-white/60">WIND</div>
              <div className="relative w-28 h-28">
                <svg
                  width="112"
                  height="112"
                  viewBox="0 0 112 112"
                  className="transition-transform"
                  style={{ transform: `rotate(${windDirection}deg)` }}
                >
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#ffffff20" strokeWidth="8" />
                  <path d="M56 8 L66 38 L56 56 L46 38 Z" fill="#60a5fa" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-medium">{Math.round(windSpeed)}</span>
                  <span className="text-xs text-white/50">km/h</span>
                </div>
              </div>
            </div>

            {/* Humidity Wave */}
            <div className="lg:col-span-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform flex flex-col">
              <div className="flex justify-between text-sm font-medium tracking-widest mb-4 text-white/60">
                <span>HUMIDITY</span>
                <span className="text-3xl font-semibold text-white">{humidity}%</span>
              </div>
              <div className="flex-1 relative bg-gradient-to-t from-blue-400/20 to-transparent rounded-3xl overflow-hidden flex items-end">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-cyan-300 transition-all"
                  style={{ height: `${humidity}%` }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-60 animate-[wave_3s_linear_infinite]"></div>
                <style jsx>{`
                  @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
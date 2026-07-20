"use client";

import * as React from "react";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaWind,
  FaDroplet,
  FaRobot,
} from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeatherWidget() {
  const [city, setCity] = React.useState("New York");
  const [weather, setWeather] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const CITIES: Record<string, { lat: number; lon: number }> = {
    "New York": { lat: 40.7128, lon: -74.0060 },
    "London": { lat: 51.5074, lon: -0.1278 },
    "Tokyo": { lat: 35.6762, lon: 139.6503 }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function getWeatherDetails(code: number) {
    if (code === 0) return { condition: "Clear Sky", icon: <FaSun className="text-amber-500 size-10" /> };
    if (code >= 1 && code <= 3) return { condition: "Partly Cloudy", icon: <FaCloud className="text-zinc-400 size-10" /> };
    if (code >= 45 && code <= 48) return { condition: "Foggy", icon: <FaCloud className="text-zinc-300 size-10" /> };
    if (code >= 51 && code <= 67) return { condition: "Raining", icon: <FaCloudRain className="text-blue-400 size-10" /> };
    if (code >= 71 && code <= 77) return { condition: "Snowing", icon: <FaCloud className="text-zinc-200 size-10" /> };
    if (code >= 80 && code <= 82) return { condition: "Rain Showers", icon: <FaCloudRain className="text-blue-400 size-10" /> };
    if (code >= 85 && code <= 86) return { condition: "Snow Showers", icon: <FaCloud className="text-zinc-200 size-10" /> };
    if (code >= 95 && code <= 99) return { condition: "Thunderstorm", icon: <FaCloudRain className="text-purple-400 size-10" /> };
    return { condition: "Cloudy", icon: <FaCloud className="text-zinc-400 size-10" /> };
  }

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    const coords = CITIES[city];
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const currentTemp = Math.round(data.current.temperature_2m);
        const { condition, icon } = getWeatherDetails(data.current.weather_code);
        const humidity = data.current.relative_humidity_2m;
        const wind = Math.round(data.current.wind_speed_10m);
        
        const forecastDays = data.daily.time.slice(1, 6).map((timeStr: string, idx: number) => {
          const date = new Date(timeStr + "T00:00:00");
          const day = daysOfWeek[date.getDay()];
          const code = data.daily.weather_code[idx + 1];
          const temp = Math.round(data.daily.temperature_2m_max[idx + 1]);
          
          let forecastIcon = <FaSun className="text-amber-500" />;
          if (code >= 1 && code <= 3) forecastIcon = <FaCloud className="text-zinc-400" />;
          else if (code >= 45 && code <= 48) forecastIcon = <FaCloud className="text-zinc-300" />;
          else if (code >= 51 && code <= 67) forecastIcon = <FaCloudRain className="text-blue-400" />;
          else if (code >= 71 && code <= 77) forecastIcon = <FaCloud className="text-zinc-200" />;
          else if (code >= 80 && code <= 82) forecastIcon = <FaCloudRain className="text-blue-400" />;
          else if (code >= 85 && code <= 86) forecastIcon = <FaCloud className="text-zinc-200" />;
          else if (code >= 95 && code <= 99) forecastIcon = <FaCloudRain className="text-purple-400" />;

          return { day, temp, icon: forecastIcon };
        });

        let tip = "Excellent day for a light walk! Temperatures are pleasant.";
        if (currentTemp > 85) {
          tip = "It is quite hot today. Stay hydrated, wear sunscreen, and seek shade.";
        } else if (currentTemp < 50) {
          tip = "Brrr, it is chilly! Bundle up with a warm coat before heading out.";
        } else if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("thunder")) {
          tip = "Rain is expected. Don't forget your umbrella or raincoat!";
        } else if (condition.toLowerCase().includes("snow")) {
          tip = "Snowy conditions. Watch for icy paths and stay warm.";
        }

        setWeather({
          temp: currentTemp,
          condition,
          icon,
          humidity,
          wind,
          aqi: 42,
          forecast: forecastDays,
          aiInsight: tip,
        });
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [city]);

  return (
    <Card className="overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Local Weather
          </CardTitle>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded border border-zinc-200 bg-transparent px-2 py-0.5 text-xs font-semibold focus:outline-none dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <option value="New York" className="dark:bg-zinc-900">New York</option>
            <option value="London" className="dark:bg-zinc-900">London</option>
            <option value="Tokyo" className="dark:bg-zinc-900">Tokyo</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-xs text-zinc-500 py-6 text-center animate-pulse">Loading weather...</div>
        ) : error || !weather ? (
          <div className="text-xs text-rose-500 py-6 text-center">Failed to load weather.</div>
        ) : (
          <>
            {/* Current weather details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {weather.icon}
                <div>
                  <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {weather.temp}°F
                  </div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {weather.condition}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1 justify-end">
                  <FaWind className="size-3 text-zinc-400" />
                  <span>Wind: {weather.wind} mph</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <FaDroplet className="size-3 text-zinc-400" />
                  <span>Humidity: {weather.humidity}%</span>
                </div>
                <div className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-1.5 py-0.5 rounded-full inline-block">
                  AQI: {weather.aqi} (Good)
                </div>
              </div>
            </div>

            {/* AI Insight section */}
            <div className="rounded-lg bg-teal-50/50 p-3 dark:bg-teal-950/10 border border-teal-100/40 dark:border-teal-900/20">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-400 mb-1">
                <FaRobot className="size-3.5" />
                <span>AI Weather Tip</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {weather.aiInsight}
              </p>
            </div>

            {/* 5-day weather mini-forecast */}
            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="grid grid-cols-5 gap-2 text-center">
                {weather.forecast.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                      {item.day}
                    </div>
                    <div className="flex justify-center">{item.icon}</div>
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {item.temp}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

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

  // Local static weather data
  const weatherData = {
    temp: 72,
    condition: "Partly Cloudy",
    humidity: 62,
    wind: 9,
    aqi: 42,
    forecast: [
      { day: "Mon", temp: 74, icon: <FaSun className="text-amber-500" /> },
      { day: "Tue", temp: 68, icon: <FaCloudRain className="text-blue-400" /> },
      { day: "Wed", temp: 70, icon: <FaCloud className="text-zinc-400" /> },
      { day: "Thu", temp: 75, icon: <FaSun className="text-amber-500" /> },
      { day: "Fri", temp: 73, icon: <FaSun className="text-amber-500" /> },
    ],
    aiInsight: "Excellent day for a light walk! The air quality is optimal, and temperatures are warm but pleasant. Keep a light jacket handy for the evening.",
  };

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
        {/* Current weather details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCloud className="size-10 text-zinc-400 dark:text-zinc-500" />
            <div>
              <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {weatherData.temp}°F
              </div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {weatherData.condition}
              </div>
            </div>
          </div>

          <div className="space-y-1 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1 justify-end">
              <FaWind className="size-3 text-zinc-400" />
              <span>Wind: {weatherData.wind} mph</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <FaDroplet className="size-3 text-zinc-400" />
              <span>Humidity: {weatherData.humidity}%</span>
            </div>
            <div className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-1.5 py-0.5 rounded-full inline-block">
              AQI: {weatherData.aqi} (Good)
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
            {weatherData.aiInsight}
          </p>
        </div>

        {/* 5-day weather mini-forecast */}
        <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <div className="grid grid-cols-5 gap-2 text-center">
            {weatherData.forecast.map((item, idx) => (
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
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { FaFutbol, FaTrophy } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Match {
  id: string;
  league: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  status: "LIVE" | "FT" | "UPCOMING";
  time?: string;
}

export function SportsWidget() {
  const matches: Match[] = [
    {
      id: "1",
      league: "Premier League",
      homeTeam: "Arsenal",
      homeScore: 2,
      awayTeam: "Chelsea",
      awayScore: 1,
      status: "LIVE",
      time: "74'",
    },
    {
      id: "2",
      league: "Premier League",
      homeTeam: "Liverpool",
      homeScore: 3,
      awayTeam: "Man City",
      awayScore: 3,
      status: "FT",
    },
    {
      id: "3",
      league: "Champions League",
      homeTeam: "Real Madrid",
      homeScore: 0,
      awayTeam: "Bayern Munich",
      awayScore: 0,
      status: "UPCOMING",
      time: "21:00",
    },
  ];

  return (
    <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1.5">
          <FaFutbol className="size-4 text-zinc-500" />
          <CardTitle className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Live Sports Scoreboard
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {matches.map((match) => (
          <div key={match.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
              <span>{match.league}</span>
              {match.status === "LIVE" ? (
                <span className="flex items-center gap-1 text-rose-600 animate-pulse">
                  <span className="size-1.5 rounded-full bg-rose-600"></span>
                  LIVE {match.time}
                </span>
              ) : match.status === "FT" ? (
                <span className="text-zinc-500 font-semibold">FINISHED</span>
              ) : (
                <span className="text-teal-600 dark:text-teal-400 font-semibold">
                  {match.time}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {match.homeTeam}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {match.awayTeam}
                  </span>
                </div>
              </div>

              {match.status !== "UPCOMING" ? (
                <div className="text-right font-mono font-extrabold text-sm space-y-1">
                  <div className="text-zinc-900 dark:text-zinc-50">
                    {match.homeScore}
                  </div>
                  <div className="text-zinc-900 dark:text-zinc-50">
                    {match.awayScore}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-1 border border-zinc-100 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900">
                  <FaTrophy className="size-3.5 text-amber-500" />
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

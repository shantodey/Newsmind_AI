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
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        if (!data.events || data.events.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }
        const mapped: Match[] = data.events.slice(0, 5).map((event: any) => {
          const comp = event.competitions?.[0];
          const homeComp = comp?.competitors?.find((c: any) => c.homeAway === "home");
          const awayComp = comp?.competitors?.find((c: any) => c.homeAway === "away");
          const state = event.status?.type?.state;
          
          let status: "LIVE" | "FT" | "UPCOMING" = "UPCOMING";
          if (state === "in") status = "LIVE";
          else if (state === "post") status = "FT";
          
          return {
            id: event.id,
            league: "Premier League",
            homeTeam: homeComp?.team?.shortDisplayName || homeComp?.team?.displayName || "Home Team",
            homeScore: parseInt(homeComp?.score || "0", 10),
            awayTeam: awayComp?.team?.shortDisplayName || awayComp?.team?.displayName || "Away Team",
            awayScore: parseInt(awayComp?.score || "0", 10),
            status,
            time: event.status?.type?.detail || "",
          };
        });
        setMatches(mapped);
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
  }, []);

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
        {loading ? (
          <div className="text-xs text-zinc-500 py-6 text-center animate-pulse">Loading scoreboard...</div>
        ) : error ? (
          <div className="text-xs text-rose-500 py-6 text-center">Failed to load scores.</div>
        ) : matches.length === 0 ? (
          <div className="text-xs text-zinc-500 py-6 text-center">No Premier League matches scheduled today.</div>
        ) : (
          matches.map((match) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
}

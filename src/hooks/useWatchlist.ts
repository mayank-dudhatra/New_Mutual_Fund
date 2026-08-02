// src/hooks/useWatchlist.ts
import { useQuery } from "@tanstack/react-query";
import { WatchlistItem } from "@/models/Watchlist";

export const WATCHLIST_KEY = ["watchlist"] as const;

export function useWatchlist() {
  return useQuery<{ watchlist: WatchlistItem[] }>({
    queryKey: WATCHLIST_KEY,
    queryFn: async () => {
      const res = await fetch("/api/watchlist");
      if (!res.ok) throw new Error("Failed to fetch watchlist.");
      return res.json();
    },
  });
}

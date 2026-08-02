// src/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";

export interface DashboardMover {
  schemeCode: number;
  schemeName: string;
  nav: number;
  dayChange: number | null;
  oneMonth: number | null;
  threeMonths: number | null;
  oneYear: number | null;
}

export function useDashboard() {
  return useQuery<{ gainers: DashboardMover[]; losers: DashboardMover[] }>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard.");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}

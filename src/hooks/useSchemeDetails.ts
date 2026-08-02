// src/hooks/useSchemeDetails.ts
import { useQuery } from "@tanstack/react-query";

export interface NavPoint {
  date: string;
  nav: number;
}

export interface SchemeDetails {
  meta: {
    schemeCode: number;
    schemeName: string;
    fundHouse: string;
    category: string;
    plan: string;
    isin: string;
  };
  navHistory: NavPoint[];
}

export function useSchemeDetails(code: number | string, enabled = true) {
  return useQuery<SchemeDetails>({
    queryKey: ["scheme-details", code],
    queryFn: async () => {
      const res = await fetch(`/api/scheme/${code}`);
      if (!res.ok) throw new Error("Failed to fetch scheme details.");
      return res.json();
    },
    enabled: enabled && code !== "",
  });
}

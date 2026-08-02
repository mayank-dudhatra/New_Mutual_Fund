// src/store/portfolioStore.ts
// Shared global state for the virtual portfolio so expensive fetches and
// calculations are computed once and reused across navigation.
"use client";

import { create } from "zustand";
import { VirtualSip } from "@/models/VirtualPortfolio";

export interface NavPerformance {
  currentNav: number | null;
  prevNav: number | null;
}

const STALE_MS = 5 * 60 * 1000; // 5 minutes

type Status = "idle" | "loading" | "success" | "error";

interface PortfolioState {
  sips: VirtualSip[];
  performance: Record<number, NavPerformance>;
  status: Status;
  isRefreshing: boolean;
  lastFetched: number;
  error: string | null;
  fetchPortfolio: (force?: boolean) => Promise<void>;
  removeSip: (sipId: string) => void;
  reset: () => void;
}

async function fetchPerformance(
  schemeCodes: number[]
): Promise<Record<number, NavPerformance>> {
  const res = await fetch("/api/portfolio/performance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ schemeCodes }),
  });
  if (!res.ok) return {};
  return res.json();
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  sips: [],
  performance: {},
  status: "idle",
  isRefreshing: false,
  lastFetched: 0,
  error: null,

  fetchPortfolio: async (force = false) => {
    const { sips, lastFetched, isRefreshing } = get();
    const now = Date.now();
    const hasData = sips.length > 0;
    const isStale = now - lastFetched > STALE_MS;

    // Fresh cache → reuse it without any network request.
    if (!force && hasData && !isStale) return;
    // An identical request is already in flight.
    if (isRefreshing || (!hasData && get().status === "loading")) return;

    // Only show a full-screen loading state when we have nothing to show.
    if (hasData) {
      set({ isRefreshing: true });
    } else {
      set({ status: "loading", isRefreshing: false, error: null });
    }

    try {
      const sipsRes = await fetch("/api/portfolio");
      const sipsData = await sipsRes.json();
      if (!sipsRes.ok) throw new Error("Failed to fetch portfolio.");

      const fetchedSips: VirtualSip[] = sipsData.sips || [];

      let perf: Record<number, NavPerformance> = {};
      if (fetchedSips.length > 0) {
        perf = await fetchPerformance(
          fetchedSips.map((s) => s.schemeCode)
        );
      }

      set({
        sips: fetchedSips,
        performance: perf,
        status: "success",
        isRefreshing: false,
        lastFetched: Date.now(),
        error: null,
      });
    } catch (err: unknown) {
      set({
        status: hasData ? "success" : "error",
        isRefreshing: false,
        error: err instanceof Error ? err.message : "Failed to load portfolio",
      });
    }
  },

  removeSip: (sipId) =>
    set((state) => ({
      sips: state.sips.filter((sip) => sip._id.toString() !== sipId),
    })),

  reset: () =>
    set({
      sips: [],
      performance: {},
      status: "idle",
      isRefreshing: false,
      lastFetched: 0,
      error: null,
    }),
}));

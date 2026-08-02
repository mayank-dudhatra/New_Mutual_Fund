// src/hooks/useSipDetail.ts
import { useQuery } from "@tanstack/react-query";
import { VirtualSip, SipTransaction } from "@/models/VirtualPortfolio";
import { NavPerformance } from "@/store/portfolioStore";

export interface SipDetail {
  sip: VirtualSip | null;
  transactions: SipTransaction[];
  performance: NavPerformance;
}

export function useSipDetail(id: string) {
  return useQuery<SipDetail>({
    queryKey: ["sip-detail", id],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio/${id}`);
      if (!res.ok) throw new Error("Failed to load SIP.");
      const data = await res.json();

      let performance: NavPerformance = { currentNav: null, prevNav: null };
      if (data.sip) {
        const perfRes = await fetch("/api/portfolio/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schemeCodes: [data.sip.schemeCode] }),
        });
        if (perfRes.ok) {
          const perfData = await perfRes.json();
          performance =
            perfData[data.sip.schemeCode] || { currentNav: null, prevNav: null };
        }
      }

      return {
        sip: data.sip ?? null,
        transactions: data.transactions || [],
        performance,
      };
    },
  });
}

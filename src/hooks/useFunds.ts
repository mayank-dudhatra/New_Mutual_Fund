// src/hooks/useFunds.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Scheme } from "@/types/scheme";

export interface FundsResponse {
  total: number;
  page: number;
  limit: number;
  funds: Scheme[];
}

export const FUNDS_LIMIT = 50;

export function useFunds(page: number) {
  return useQuery<FundsResponse>({
    queryKey: ["funds", page],
    queryFn: async () => {
      const res = await fetch(`/api/mf?page=${page}&limit=${FUNDS_LIMIT}`);
      if (!res.ok) throw new Error("Failed to fetch funds.");
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
}

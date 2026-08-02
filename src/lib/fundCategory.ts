// src/lib/fundCategory.ts
// Lightweight category inference for display purposes based on scheme name.
export type FundCategory = "Equity" | "Debt" | "Hybrid" | "Index";

export function getFundCategory(schemeName: string): FundCategory {
  const name = schemeName.toLowerCase();
  if (name.includes("debt") || name.includes("income") || name.includes("bond") || name.includes("liquid")) return "Debt";
  if (name.includes("hybrid") || name.includes("balanced")) return "Hybrid";
  if (name.includes("index") || name.includes("nifty") || name.includes("sensex")) return "Index";
  return "Equity";
}

export const FUND_CATEGORIES: FundCategory[] = ["Equity", "Debt", "Hybrid", "Index"];

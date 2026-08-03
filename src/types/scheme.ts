// src/types/scheme.ts

// ✅ NAV entry (daily price)
export interface NAVEntry {
  date: string;   // e.g. "2025-09-25"
  nav: number;    // NAV value
}

// ✅ Mutual Fund Scheme metadata (matches the shape returned by https://api.mfapi.in/mf)
export interface Scheme {
  schemeCode: number;          // Unique AMFI scheme code
  schemeName: string;          // Scheme name (e.g. SBI Bluechip Fund)
  schemeType?: string;         // e.g. "Open Ended Schemes", "Close Ended Schemes"
  isinGrowth?: string | null;  // ISIN for growth option (or null)
  isinDivReinvestment?: string | null; // ISIN for dividend reinvestment option (or null)
  isinDivPayout?: string | null;       // ISIN for dividend payout option (or null)
  nav?: number;                // Latest NAV (from activefunds list)
  navDate?: string;            // Date of the latest NAV (DD-MM-YYYY)
}

// ✅ Returns (absolute % for given time periods)
export interface Returns {
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  threeYears?: number;
  fiveYears?: number;
  cagr?: number; // CAGR if available
}

// ✅ SIP Calculation input
export interface SIPInput {
  amount: number;      // Monthly investment
  duration: number;    // In months
  expectedRate: number; // Annual return in %
}

// ✅ SIP Calculation result
export interface SIPResult {
  investedAmount: number;  // Total money invested
  currentValue: number;    // Value at end of SIP
  wealthGain: number;      // Profit earned
  xirr?: number;           // Approximate XIRR %
}

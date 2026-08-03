// src/app/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Button, Container, Typography, Box, Paper, Grid, alpha, Skeleton, Stack } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TickerTape from "@/components/TickerTape";
import ReturnBadge from "@/components/ReturnBadge";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import PlatformOverview from "@/components/landing/PlatformOverview";
import KeyFeatures from "@/components/landing/KeyFeatures";
import HowItWorks from "@/components/landing/HowItWorks";
import PlatformStats from "@/components/landing/PlatformStats";
import WhyVirtualPortfolio from "@/components/landing/WhyVirtualPortfolio";
import CalculatorsOverview from "@/components/landing/CalculatorsOverview";
import Screenshots from "@/components/landing/Screenshots";
import Technology from "@/components/landing/Technology";
import FaqSection from "@/components/landing/FaqSection";
import FinalCta from "@/components/landing/FinalCta";
import LandingFooter from "@/components/landing/LandingFooter";

// Deterministic, market-like equity curve for the hero chart (UI-only).
const HERO_CHART_DATA = [
  { x: "Jan", v: 1000 }, { x: "", v: 1020 }, { x: "", v: 1015 }, { x: "", v: 1045 },
  { x: "Feb", v: 1032 }, { x: "", v: 1068 }, { x: "", v: 1059 }, { x: "", v: 1088 },
  { x: "Mar", v: 1079 }, { x: "", v: 1114 }, { x: "", v: 1102 }, { x: "", v: 1135 },
  { x: "Apr", v: 1121 }, { x: "", v: 1158 }, { x: "", v: 1176 }, { x: "", v: 1161 },
  { x: "May", v: 1194 }, { x: "", v: 1180 }, { x: "", v: 1213 }, { x: "", v: 1242 },
  { x: "Jun", v: 1228 }, { x: "", v: 1261 }, { x: "", v: 1278 }, { x: "", v: 1255 },
  { x: "Jul", v: 1291 }, { x: "", v: 1324 }, { x: "", v: 1312 }, { x: "", v: 1348 },
  { x: "Aug", v: 1360 }, { x: "", v: 1392 }, { x: "", v: 1379 }, { x: "", v: 1417 },
  { x: "Sep", v: 1401 }, { x: "", v: 1436 }, { x: "", v: 1452 }, { x: "", v: 1440 },
  { x: "Oct", v: 1476 }, { x: "", v: 1503 }, { x: "", v: 1489 }, { x: "", v: 1525 },
  { x: "Nov", v: 1541 }, { x: "", v: 1578 }, { x: "", v: 1562 }, { x: "", v: 1601 },
  { x: "Dec", v: 1589 }, { x: "", v: 1627 }, { x: "", v: 1654 }, { x: "", v: 1689 },
];

const HERO_RANGES = ["1M", "3M", "6M", "1Y"] as const;
const RANGE_POINTS: Record<(typeof HERO_RANGES)[number], number> = { "1M": 12, "3M": 24, "6M": 36, "1Y": 48 };
const RANGE_LABEL: Record<(typeof HERO_RANGES)[number], string> = { "1M": "1-month", "3M": "3-month", "6M": "6-month", "1Y": "12-month" };

const INDEX_CHIPS = [
  { label: "NIFTY 50", change: 0.82 },
  { label: "SENSEX", change: 0.74 },
  { label: "BANK NIFTY", change: -0.32 },
  { label: "INDIA VIX", change: -2.1 },
];

const HERO_STATS = [
  { value: "1,000s", label: "Funds to explore" },
  { value: "6+", label: "Return calculators" },
  { value: "Live NAV", label: "Daily updates" },
  { value: "Free", label: "Virtual SIP tracking" },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: dashboard, isLoading: moversLoading } = useDashboard();
  const [heroRange, setHeroRange] = useState<(typeof HERO_RANGES)[number]>("1Y");

  const heroChartData = useMemo(
    () => HERO_CHART_DATA.slice(-RANGE_POINTS[heroRange]),
    [heroRange]
  );

  const latestNav = heroChartData[heroChartData.length - 1]?.v ?? 0;
  const startNav = heroChartData[0]?.v ?? 0;
  const rangeChange = startNav > 0 ? ((latestNav - startNav) / startNav) * 100 : 0;

  // If the user is already logged in, send them to their dashboard.
  if (user) {
    router.push("/home");
    return null;
  }

  const tickerItems = dashboard
    ? [...(dashboard.gainers ?? []), ...(dashboard.losers ?? [])]
        .map((m) => ({ schemeCode: m.schemeCode, schemeName: m.schemeName, dayChange: m.dayChange, nav: m.nav }))
        .slice(0, 12)
    : [];

  return (
    <Box>
      {/* ============ DARK MARKET HERO ============ */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `
            radial-gradient(1000px 520px at 85% -10%, rgba(108,99,255,0.32), transparent 60%),
            radial-gradient(800px 480px at 0% 110%, rgba(22,163,74,0.16), transparent 55%),
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(180deg, #0B1220 0%, #0F1A2E 100%)
          `,
          backgroundSize: "auto, auto, 44px 44px, 44px 44px, auto",
          color: "#fff",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4, flexWrap: "wrap" }}>
            <Paper
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: alpha("#22C55E", 0.12),
                color: "#4ADE80",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: 99, bgcolor: "#22C55E", boxShadow: "0 0 8px #22C55E", animation: "pulse 1.6s ease-in-out infinite" }} />
              <Typography variant="caption" fontWeight={700}>LIVE MARKET DATA</Typography>
            </Paper>
            <Paper sx={{ px: 1.5, py: 0.5, borderRadius: 999, bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.7)" }}>
              <Typography variant="caption" fontWeight={600}>India · IST · Daily NAV from AMFI</Typography>
            </Paper>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left copy */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={900}
                sx={{ mb: 2, letterSpacing: "-0.02em", fontSize: { xs: "2.2rem", md: "3.3rem" }, lineHeight: 1.08 }}
              >
                Invest with{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  market-level clarity
                </Box>{" "}
                on every rupee.
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400, color: "rgba(255,255,255,0.72)", maxWidth: 520 }}>
                Explore thousands of mutual funds, track daily movers, run return calculators and
                simulate SIPs — exactly the way you&apos;d track stocks.
              </Typography>

              {/* Index chips */}
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 3 }}>
                {INDEX_CHIPS.map((chip) => {
                  const up = chip.change >= 0;
                  const Icon = up ? TrendingUpIcon : TrendingDownIcon;
                  return (
                    <Box
                      key={chip.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 0.6,
                        borderRadius: 99,
                        bgcolor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <Typography variant="caption" fontWeight={700} sx={{ color: "rgba(255,255,255,0.7)" }}>
                        {chip.label}
                      </Typography>
                      <Icon sx={{ fontSize: 14, color: up ? "#4ADE80" : "#F87171" }} />
                      <Typography variant="caption" fontWeight={800} sx={{ color: up ? "#4ADE80" : "#F87171", fontVariantNumeric: "tabular-nums" }}>
                        {up ? "+" : ""}
                        {chip.change.toFixed(2)}%
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/register"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, bgcolor: "#22C55E", color: "#0B1220", fontWeight: 800, "&:hover": { bgcolor: "#16A34A" } }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/login"
                  sx={{
                    px: 4,
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.35)",
                    "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
                  }}
                >
                  Login
                </Button>
              </Box>

              {/* Hero stats */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2.5, md: 4 }, borderTop: "1px solid rgba(255,255,255,0.10)", pt: 3 }}>
                {HERO_STATS.map((stat) => (
                  <Box key={stat.label} sx={{ minWidth: 110 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: "#22C55E" }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Right: interactive market chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  borderRadius: 4,
                  p: { xs: 2, md: 3 },
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      FundFolio Growth Index · Past {RANGE_LABEL[heroRange]}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: "#fff" }}>
                      {formatCurrency(latestNav)}
                    </Typography>
                  </Box>
                  <ReturnBadge value={rangeChange} variant="body1" />
                </Box>

                {/* Range toggle */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {HERO_RANGES.map((range) => (
                    <Box
                      key={range}
                      role="button"
                      onClick={() => setHeroRange(range)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 99,
                        cursor: "pointer",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        userSelect: "none",
                        bgcolor: heroRange === range ? "#22C55E" : "rgba(255,255,255,0.06)",
                        color: heroRange === range ? "#0B1220" : "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        transition: "all 0.2s ease",
                        "&:hover": { bgcolor: heroRange === range ? "#22C55E" : "rgba(255,255,255,0.12)" },
                      }}
                    >
                      {range}
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ height: { xs: 220, md: 240 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={heroChartData} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22C55E" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <YAxis hide domain={["dataMin - 40", "dataMax + 40"]} />
                      <XAxis dataKey="x" hide />
                      <Tooltip
                        cursor={{ stroke: "rgba(255,255,255,0.3)" }}
                        contentStyle={{
                          background: "#0B1220",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                        formatter={(value: number) => [`₹${Number(value).toFixed(2)}`, "Index"]}
                        labelFormatter={(label: string) => label || ""}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#22C55E"
                        strokeWidth={3}
                        fill="url(#heroArea)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Typography variant="caption" color="rgba(255,255,255,0.45)">
                  Illustrative {RANGE_LABEL[heroRange]} growth curve
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Ticker tape strip at hero bottom */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", bgcolor: "rgba(0,0,0,0.25)", py: 1.5 }}>
          <Container maxWidth="lg">
            {moversLoading ? (
              <Skeleton variant="rounded" height={40} />
            ) : tickerItems.length > 0 ? (
              <TickerTape items={tickerItems} />
            ) : null}
          </Container>
        </Box>
      </Box>

      {/* ============ PLATFORM OVERVIEW ============ */}
      <PlatformOverview />

      {/* ============ KEY FEATURES ============ */}
      <KeyFeatures />

      {/* ============ HOW IT WORKS ============ */}
      <HowItWorks />

      {/* ============ PLATFORM STATISTICS ============ */}
      <PlatformStats />

      {/* ============ WHY VIRTUAL PORTFOLIO ============ */}
      <WhyVirtualPortfolio />

      {/* ============ INVESTMENT CALCULATORS ============ */}
      <CalculatorsOverview />

      {/* ============ APPLICATION SCREENSHOTS ============ */}
      <Screenshots />

      {/* ============ TECHNOLOGY ============ */}
      <Technology />

      {/* ============ FAQ ============ */}
      <FaqSection />

      {/* ============ FINAL CTA ============ */}
      <FinalCta />

      {/* ============ FOOTER ============ */}
      <LandingFooter />
    </Box>
  );
}

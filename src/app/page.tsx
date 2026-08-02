// src/app/page.tsx
"use client";

import { Button, Container, Typography, Box, Paper, Grid, useTheme, alpha, Skeleton, Stack, Divider } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { data: dashboard, isLoading: moversLoading } = useDashboard();

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

  const movers = dashboard?.gainers ?? [];
  const moversB = dashboard?.losers ?? [];

  return (
    <Box>
      {/* ============ DARK MARKET HERO ============ */}
      <Box
        sx={{
          position: "relative",
          background: "radial-gradient(1200px 600px at 80% -10%, rgba(108,99,255,0.35), transparent 60%), radial-gradient(900px 500px at 0% 110%, rgba(22,163,74,0.18), transparent 55%), linear-gradient(180deg, #0B1220 0%, #0F1A2E 100%)",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
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
            <Typography variant="caption" color="rgba(255,255,255,0.6)">
              Daily-updated NAV from AMFI
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left copy */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight={900}
                sx={{ mb: 2, letterSpacing: "-0.02em", fontSize: { xs: "2.2rem", md: "3.4rem" }, lineHeight: 1.1 }}
              >
                Invest with{" "}
                <Box component="span" sx={{ color: "#22C55E" }}>
                  market-level clarity
                </Box>{" "}
                on every rupee.
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, color: "rgba(255,255,255,0.72)", maxWidth: 520 }}>
                Explore thousands of mutual funds, track daily movers, run return calculators and
                simulate SIPs — exactly the way you&apos;d track stocks.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/register"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, bgcolor: "#22C55E", color: "#0B1220", fontWeight: 800, "&:hover": { bgcolor: "#16A34A" } }}
                >
                  Start Investing Free
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
              <Box sx={{ display: "flex", gap: { xs: 3, md: 5 }, flexWrap: "wrap" }}>
                {[
                  { value: "1,000s", label: "Funds to explore" },
                  { value: "6+", label: "Return calculators" },
                  { value: "Live NAV", label: "Daily updates" },
                  { value: "Free", label: "Virtual SIP tracking" },
                ].map((stat) => (
                  <Box key={stat.label}>
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

            {/* Right: animated market chart */}
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      FundFolio Growth Index
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: "#fff" }}>
                      {formatCurrency(1689)}
                    </Typography>
                  </Box>
                  <ReturnBadge value={4.32} variant="body2" />
                </Box>
                <Box sx={{ height: { xs: 220, md: 260 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HERO_CHART_DATA} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
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
                  Illustrative 12-month growth curve
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

      {/* ============ MARKET MOVERS ============ */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3, flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Today&apos;s Market Movers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real funds sampled from our universe, ranked by 1-day change.
            </Typography>
          </Box>
          <Button component={Link} href="/login" endIcon={<ArrowForwardIcon />} sx={{ textTransform: "none" }}>
            See all funds
          </Button>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ px: 2.5, py: 1.5, bgcolor: alpha(theme.palette.success.main, 0.08), borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: "success.main" }}>
                  Top Gainers
                </Typography>
              </Box>
              {moversLoading ? (
                <Box sx={{ p: 2.5, display: "grid", gap: 1.5 }}>
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rounded" height={44} />)}
                </Box>
              ) : (
                <Box>
                  {movers.slice(0, 4).map((m, i) => (
                    <Link key={m.schemeCode} href={`/scheme/${m.schemeCode}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ px: 2.5, py: 1.4, "&:hover": { bgcolor: alpha(theme.palette.success.main, 0.05) }, borderBottom: i < 3 ? `1px solid ${theme.palette.divider}` : 0 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={800} color="text.secondary" sx={{ width: 18 }}>
                            {i + 1}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {m.schemeName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                            ₹{m.nav.toFixed(2)}
                          </Typography>
                          <ReturnBadge value={m.dayChange} variant="body2" />
                        </Box>
                      </Stack>
                    </Link>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ px: 2.5, py: 1.5, bgcolor: alpha(theme.palette.error.main, 0.08), borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ color: "error.main" }}>
                  Top Losers
                </Typography>
              </Box>
              {moversLoading ? (
                <Box sx={{ p: 2.5, display: "grid", gap: 1.5 }}>
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rounded" height={44} />)}
                </Box>
              ) : (
                <Box>
                  {moversB.slice(0, 4).map((m, i) => (
                    <Link key={m.schemeCode} href={`/scheme/${m.schemeCode}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ px: 2.5, py: 1.4, "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.05) }, borderBottom: i < 3 ? `1px solid ${theme.palette.divider}` : 0 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={800} color="text.secondary" sx={{ width: 18 }}>
                            {i + 1}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {m.schemeName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                            ₹{m.nav.toFixed(2)}
                          </Typography>
                          <ReturnBadge value={m.dayChange} variant="body2" />
                        </Box>
                      </Stack>
                    </Link>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Divider />

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

// src/app/home/page.tsx
// Fintech-style dashboard: greeting, market ticker, quick actions,
// watchlist movers, top market movers and SIP progress.
"use client";

import { useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Skeleton,
  useTheme,
  alpha,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useDashboard } from "@/hooks/useDashboard";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import TickerTape from "@/components/TickerTape";
import MoversList, { MoverItem } from "@/components/MoversList";
import Link from "next/link";
import dayjs from "dayjs";

import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// --- Small helpers ---

function getGreeting(name?: string) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = name?.trim().split(" ")[0] ?? "Investor";
  return `${part}, ${firstName}`;
}

function getMarketStatus() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = day >= 1 && day <= 5 && minutes >= 555 && minutes <= 930;
  return isOpen ? "Markets Open" : "Markets Closed";
}

const QUICK_ACTIONS = [
  {
    label: "Explore Funds",
    description: "Browse 1000s of funds",
    href: "/funds",
    icon: TravelExploreIcon,
  },
  {
    label: "My Watchlist",
    description: "Track funds you follow",
    href: "/watchlist",
    icon: StarBorderIcon,
  },
  {
    label: "Virtual Portfolio",
    description: "Manage your SIPs",
    href: "/virtual-portfolio",
    icon: AccountBalanceWalletIcon,
  },
  {
    label: "Start a SIP",
    description: "Plan your next investment",
    href: "/virtual-portfolio",
    icon: AddIcon,
  },
];

// --- Main page ---

export default function HomePage() {
  const theme = useTheme();
  const { user, loading: authLoading } = useAuth();

  const { data: watchlistData } = useWatchlist();
  const watchlist = useMemo(() => watchlistData?.watchlist ?? [], [watchlistData]);

  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();

  const sips = usePortfolioStore((s) => s.sips);
  const status = usePortfolioStore((s) => s.status);
  const fetchPortfolio = usePortfolioStore((s) => s.fetchPortfolio);
  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const codes = useMemo(() => watchlist.map((w) => w.schemeCode), [watchlist]);

  // Latest + previous NAV for watchlist funds → 1D change.
  const { data: perfData, isLoading: perfLoading } = useQuery({
    queryKey: ["watchlist-performance", codes],
    queryFn: async () => {
      const res = await fetch("/api/portfolio/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeCodes: codes }),
      });
      if (!res.ok) throw new Error("Failed to fetch performance.");
      return res.json();
    },
    enabled: codes.length > 0,
  });

  const watchlistMovers = useMemo<MoverItem[]>(() => {
    if (!perfData) return [];
    return watchlist
      .map((w) => {
        const perf = perfData[w.schemeCode] ?? perfData[String(w.schemeCode)];
        const current = perf?.currentNav ?? null;
        const prev = perf?.prevNav ?? null;
        const dayChange = current != null && prev != null && prev > 0 ? ((current - prev) / prev) * 100 : null;
        return {
          schemeCode: w.schemeCode,
          schemeName: w.schemeName,
          nav: current,
          dayChange,
        } as MoverItem;
      })
      .sort((a, b) => (b.dayChange ?? -Infinity) - (a.dayChange ?? -Infinity));
  }, [watchlist, perfData]);

  const activeSips = useMemo(
    () => sips.filter((sip) => sip.status === "active"),
    [sips]
  );

  const tickerItems = useMemo(() => {
    if (!dashboard) return [];
    return [...dashboard.gainers, ...dashboard.losers].map((f) => ({
      schemeCode: f.schemeCode,
      schemeName: f.schemeName,
      nav: f.nav,
      dayChange: f.dayChange,
    }));
  }, [dashboard]);

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={800}>
            {getGreeting(user?.name)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {dayjs().format("dddd, D MMMM YYYY")} · Your mutual fund dashboard
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: getMarketStatus() === "Markets Open" ? "success.main" : "text.disabled",
                  ml: 1,
                }}
              />
            }
            label={getMarketStatus()}
            size="small"
            sx={{
              bgcolor: getMarketStatus() === "Markets Open" ? alpha(theme.palette.success.main, 0.1) : "background.paper",
              color: getMarketStatus() === "Markets Open" ? "success.main" : "text.secondary",
            }}
          />
          <Button
            variant="contained"
            size="medium"
            component={Link}
            href="/funds"
            startIcon={<TravelExploreIcon />}
          >
            Explore Funds
          </Button>
        </Box>
      </Box>

      {/* Ticker tape */}
      {dashboardLoading ? (
        <Skeleton variant="rounded" height={46} sx={{ mb: 3 }} />
      ) : (
        <Box sx={{ mb: 3 }}>
          <TickerTape items={tickerItems} />
        </Box>
      )}

      {/* Quick actions */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Grid key={action.label} size={{ xs: 6, md: 3 }}>
              <Paper
                variant="outlined"
                component={Link}
                href={action.href}
                sx={{
                  p: 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  textDecoration: "none",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s",
                  "&:hover": {
                    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.1)",
                    transform: "translateY(-3px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  }}
                >
                  <Icon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                    {action.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {action.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Movers: watchlist + market */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <MoversList
            title="Watchlist Movers"
            items={watchlistMovers}
            period="day"
            loading={perfLoading && watchlist.length > 0}
            emptyText="Your watchlist is empty — add funds from any fund page."
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <MoversList
            title="Top Gainers"
            items={(dashboard?.gainers ?? []).map((f) => ({ ...f }))}
            period="multi"
            loading={dashboardLoading}
            accent="success"
            emptyText="No movers data available."
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <MoversList
            title="Top Losers"
            items={(dashboard?.losers ?? []).map((f) => ({ ...f }))}
            period="multi"
            loading={dashboardLoading}
            accent="error"
            emptyText="No movers data available."
          />
        </Grid>
      </Grid>

      {/* SIP progress */}
      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Active SIPs
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeSips.length} running · track progress and next investment date
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            component={Link}
            href="/virtual-portfolio"
            endIcon={<ArrowForwardIcon />}
          >
            View Portfolio
          </Button>
        </Box>

        {status === "loading" && sips.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rounded" height={72} />
          </Box>
        ) : activeSips.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No active SIPs yet. Start a virtual SIP to see its progress here.
            </Typography>
            <Button variant="contained" component={Link} href="/virtual-portfolio" startIcon={<AddIcon />}>
              Start a SIP
            </Button>
          </Box>
        ) : (
          <Box>
            {activeSips.map((sip) => {
              const progress = sip.durationMonths > 0 ? (sip.completedInstallments / sip.durationMonths) * 100 : 0;
              return (
                <Box
                  key={sip._id.toString()}
                  sx={{
                    px: 3,
                    py: 2.25,
                    "&:not(:last-of-type)": { borderBottom: `1px solid ${theme.palette.divider}` },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Link href={`/scheme/${sip.schemeCode}`} style={{ textDecoration: "none" }}>
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          color="text.primary"
                          sx={{ "&:hover": { color: "primary.main" }, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {sip.schemeName}
                        </Typography>
                      </Link>
                      <Typography variant="caption" color="text.secondary">
                        ₹{sip.sipAmount} / month · {sip.completedInstallments}/{sip.durationMonths} installments · Invested{" "}
                        {formatCurrency(sip.totalInvested)}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<EventAvailableIcon sx={{ fontSize: 16 }} />}
                      label={sip.nextSipDate ? `Next: ${dayjs(sip.nextSipDate).format("DD MMM YYYY")}` : "—"}
                      size="small"
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main", fontWeight: 600 }}
                    />
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min(progress, 100)} sx={{ mt: 1.5 }} />
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

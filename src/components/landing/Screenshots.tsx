// src/components/landing/Screenshots.tsx
"use client";

import { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, IconButton, Stack, alpha, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import ReturnBadge from "../ReturnBadge";
import SectionHeading from "./SectionHeading";

const CHART_DATA = [
  { x: "Jan", v: 180 }, { x: "", v: 196 }, { x: "", v: 191 }, { x: "", v: 212 },
  { x: "", v: 208 }, { x: "", v: 235 }, { x: "", v: 229 }, { x: "", v: 251 },
  { x: "", v: 244 }, { x: "", v: 268 }, { x: "", v: 262 }, { x: "", v: 282 },
];

const MOVER_ROWS = [
  { name: "Axis Bluechip Fund", nav: "₹241.31", change: 1.24 },
  { name: "HDFC Flexi Cap Fund", nav: "₹1,142.80", change: 0.86 },
  { name: "SBI Small Cap Fund", nav: "₹214.55", change: 2.31 },
  { name: "ICICI Pru Technology", nav: "₹97.42", change: -0.48 },
];

const PREVIEWS = [
  { id: "home", label: "Home Dashboard" },
  { id: "funds", label: "Mutual Fund List" },
  { id: "scheme", label: "Scheme Details" },
  { id: "nav", label: "NAV Chart" },
  { id: "sip", label: "SIP Calculator" },
  { id: "portfolio", label: "Virtual Portfolio" },
  { id: "watchlist", label: "Watchlist" },
  { id: "performance", label: "Portfolio Performance" },
] as const;

type PreviewId = (typeof PREVIEWS)[number]["id"];

function Row({ name, nav, change }: { name: string; nav: string; change: number }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
      <Typography variant="body2" fontWeight={600} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "62%" }}>
        {name}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {nav}
        </Typography>
        <ReturnBadge value={change} variant="body2" />
      </Stack>
    </Stack>
  );
}

function MiniNavChart() {
  const theme = useTheme();
  return (
    <Box sx={{ height: 140, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="screenshotNav" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.palette.success.main} stopOpacity={0.35} />
              <stop offset="100%" stopColor={theme.palette.success.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin - 15", "dataMax + 15"]} />
          <Tooltip
            cursor={{ stroke: theme.palette.text.secondary }}
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 10,
            }}
            formatter={(value: number) => [`₹${Number(value).toFixed(2)}`, "NAV"]}
          />
          <Area type="monotone" dataKey="v" stroke={theme.palette.success.main} strokeWidth={2.5} fill="url(#screenshotNav)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

function Preview({ id }: { id: PreviewId }) {
  const theme = useTheme();
  const resolveColor = (token: string) => {
    const [palette, shade = "main"] = token.split(".");
    const group = theme.palette[palette as keyof typeof theme.palette];
    const resolved = (group as unknown as Record<string, string> | undefined)?.[shade];
    return typeof resolved === "string" ? resolved : theme.palette.text.primary;
  };
  const chip = (label: string, color = "primary.main") => {
    const resolved = resolveColor(color);
    return (
      <Box sx={{ px: 1.25, py: 0.5, borderRadius: 99, bgcolor: alpha(resolved, 0.1), color: resolved, fontWeight: 700, fontSize: "0.72rem" }}>
        {label}
      </Box>
    );
  };

  switch (id) {
    case "home":
      return (
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={800}>Good morning, Rahul</Typography>
            <Typography variant="body2" color="text.secondary">Here&apos;s how your funds look today.</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {chip("NIFTY 50", "success.main")}
            {chip("SENSEX", "success.main")}
            {chip("BANK NIFTY", "error.main")}
          </Stack>
          <Stack direction="row" spacing={1.5}>
            {[["Portfolio value", "₹1,13,770", "success.main"], ["Watchlist", "8 funds", "primary.main"], ["Active SIPs", "3", "warning.main"]].map(([label, val, color]) => (
              <Box key={label} sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(resolveColor(color), 0.06) }}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="body1" fontWeight={800}>{val}</Typography>
              </Box>
            ))}
          </Stack>
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" fontWeight={800} sx={{ color: "text.secondary" }}>Top movers</Typography>
            {MOVER_ROWS.slice(0, 3).map((r) => <Row key={r.name} {...r} />)}
          </Box>
        </Stack>
      );

    case "funds":
      return (
        <Stack spacing={2}>
          <Box sx={{ px: 2, py: 1.25, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary"><SearchIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.75 }} />Search funds by name…</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {chip("All")}
            {chip("Equity")}
            {chip("Debt")}
            {chip("Hybrid")}
            {chip("Index")}
          </Stack>
          <Box>
            {MOVER_ROWS.map((r) => <Row key={r.name} {...r} />)}
          </Box>
        </Stack>
      );

    case "scheme":
      return (
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">Axis Mutual Fund</Typography>
            <Typography variant="subtitle1" fontWeight={800}>Axis Bluechip Fund — Growth</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {chip("Equity")}
              {chip("Large Cap")}
            </Stack>
          </Box>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">Current NAV</Typography>
              <Typography variant="h5" fontWeight={800}>₹241.31</Typography>
            </Box>
            <ReturnBadge value={1.24} variant="body1" />
          </Stack>
          <Stack direction="row" spacing={1}>
            {["1D", "1W", "1M", "3M", "1Y", "3Y", "5Y"].map((r) => chip(r, "text.secondary"))}
          </Stack>
          <MiniNavChart />
        </Stack>
      );

    case "nav":
      return (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={800}>NAV Performance</Typography>
          <Stack direction="row" spacing={1}>
            {["1D", "1W", "1M", "6M", "1Y", "3Y", "5Y", "Max"].map((r) => chip(r, "text.secondary"))}
          </Stack>
          <MiniNavChart />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="caption" color="text.secondary">1Y return</Typography>
              <Typography variant="body1" fontWeight={800}>+18.4%</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">CAGR (inception)</Typography>
              <Typography variant="body1" fontWeight={800}>+12.7%</Typography>
            </Box>
            <ReturnBadge value={18.4} variant="body1" />
          </Stack>
        </Stack>
      );

    case "sip":
      return (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={800}>SIP Calculator</Typography>
          {[["Monthly investment", "₹5,000"], ["Expected return (p.a.)", "12%"], ["Duration", "10 years"]].map(([label, val]) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Box sx={{ mt: 0.5, px: 1.5, py: 1.25, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <Typography variant="body1" fontWeight={700}>{val}</Typography>
              </Box>
            </Box>
          ))}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.08) }}>
            <Typography variant="caption" color="text.secondary">Future value</Typography>
            <Typography variant="h6" fontWeight={800} sx={{ color: "success.main" }}>₹11,62,236</Typography>
            <Typography variant="caption" color="text.secondary">Invested ₹6,00,000 · Gain ₹5,62,236</Typography>
          </Box>
        </Stack>
      );

    case "portfolio":
      return (
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">My Virtual Portfolio</Typography>
            <Typography variant="h5" fontWeight={800}>₹1,13,770</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {chip("+12.4% today", "success.main")}
            {chip("Invested ₹1,02,000")}
            {chip("3 active SIPs", "primary.main")}
          </Stack>
          {[
            { name: "Axis Bluechip Fund", status: "Active", color: "success.main" },
            { name: "HDFC Mid-Cap Opp.", status: "Active", color: "success.main" },
            { name: "ICICI Pru Liquid", status: "Paused", color: "text.secondary" },
          ].map((sip) => (
            <Stack key={sip.name} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600}>{sip.name}</Typography>
              {chip(sip.status, sip.color)}
            </Stack>
          ))}
        </Stack>
      );

    case "watchlist":
      return (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={800}>My Watchlist</Typography>
          <Box>
            {MOVER_ROWS.map((r) => (
              <Stack key={r.name} direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
                <StarIcon sx={{ fontSize: 18, color: "warning.main" }} />
                <Row {...r} />
              </Stack>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">+ Add more funds to track</Typography>
        </Stack>
      );

    case "performance":
      return (
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={800}>Portfolio Performance</Typography>
          <Stack direction="row" spacing={1}>
            {chip("Invested ₹1,02,000")}
            {chip("Current ₹1,13,770", "success.main")}
            {chip("Gain +₹11,770", "success.main")}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end", height: 120, mt: 1 }}>
            {[34, 42, 38, 52, 58, 64, 55, 72, 78, 84].map((h, i) => (
              <Box key={i} sx={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", background: "linear-gradient(180deg, #16A34A 0%, #16A34A 70%, rgba(22,163,74,0.35) 100%)" }} />
            ))}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Mar</Typography>
            <Typography variant="caption" color="text.secondary">Jun</Typography>
            <Typography variant="caption" color="text.secondary">Sep</Typography>
            <Typography variant="caption" color="text.secondary">Dec</Typography>
          </Stack>
        </Stack>
      );
  }
}

export default function Screenshots() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PREVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [index]);

  const active = PREVIEWS[index];

  return (
    <Box component="section" id="screenshots" className="anchor-section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <SectionHeading
          eyebrow="Application Previews"
          title="See the platform before you sign up"
          subtitle="A quick look at the key screens you&apos;ll use every day — from dashboard to portfolio performance."
        />

        {/* Browser chrome */}
        <Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, py: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 99, bgcolor: "#FF5F57" }} />
              <Box sx={{ width: 12, height: 12, borderRadius: 99, bgcolor: "#FEBC2E" }} />
              <Box sx={{ width: 12, height: 12, borderRadius: 99, bgcolor: "#28C840" }} />
            </Box>
            <Box sx={{ flex: 1, mx: 1, px: 1.5, py: 0.75, borderRadius: 99, bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", display: "block" }}>
                fundfolio.app — {active.label.toLowerCase().replace(/\s+/g, "-")}
              </Typography>
            </Box>
            <Typography variant="caption" fontWeight={800} color="primary.main">
              {index + 1}/{PREVIEWS.length}
            </Typography>
          </Box>

          {/* Preview body */}
          <Box sx={{ minHeight: { xs: 380, md: 360 }, p: { xs: 2.5, md: 3.5 }, bgcolor: "background.paper" }}>
            <Preview id={active.id} />
          </Box>
        </Paper>

        {/* Controls */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 3 }}>
          <IconButton
            onClick={() => setIndex((prev) => (prev - 1 + PREVIEWS.length) % PREVIEWS.length)}
            aria-label="Previous screenshot"
            sx={{ border: `1px solid ${theme.palette.divider}` }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Stack direction="row" spacing={1}>
            {PREVIEWS.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => setIndex(i)}
                role="button"
                aria-label={p.label}
                sx={{
                  width: i === index ? 24 : 10,
                  height: 10,
                  borderRadius: 99,
                  cursor: "pointer",
                  bgcolor: i === index ? "primary.main" : alpha(theme.palette.text.secondary, 0.25),
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </Stack>
          <IconButton
            onClick={() => setIndex((prev) => (prev + 1) % PREVIEWS.length)}
            aria-label="Next screenshot"
            sx={{ border: `1px solid ${theme.palette.divider}` }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

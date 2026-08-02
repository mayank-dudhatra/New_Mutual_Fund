// src/app/page.tsx
"use client";

import { Button, Container, Typography, Box, Paper, Grid, useTheme, alpha } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import SearchIcon from "@mui/icons-material/Search";
import CalculateIcon from "@mui/icons-material/Calculate";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const STATS = [
  { value: "1,000s", label: "Funds to explore" },
  { value: "6+", label: "Return calculators" },
  { value: "Live NAV", label: "Daily updates" },
  { value: "Free", label: "Virtual SIP tracking" },
];

const FEATURES = [
  {
    icon: SearchIcon,
    title: "Explore every fund",
    description: "Deep-dive into NAV history, returns and performance for thousands of mutual funds.",
  },
  {
    icon: CalculateIcon,
    title: "Powerful calculators",
    description: "SIP, Step-up SIP, SWP, Lump Sum and rolling-return calculators with real fund data.",
  },
  {
    icon: TrackChangesIcon,
    title: "Build your watchlist",
    description: "Track the funds you care about and spot movers at a glance.",
  },
  {
    icon: TrendingUpIcon,
    title: "Virtual portfolio",
    description: "Simulate SIPs and watch your investments grow without risking a rupee.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  // If the user is already logged in, send them to their dashboard.
  if (user) {
    router.push("/home");
    return null;
  }

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #EDEAFF 0%, #F5F7FA 100%)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 3,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
              color: "#fff",
              boxShadow: "0 16px 40px rgba(108, 99, 255, 0.35)",
            }}
          >
            <CandlestickChartIcon sx={{ fontSize: 40 }} />
          </Box>

          <Typography variant="h2" component="h1" fontWeight={800} sx={{ mb: 2 }}>
            Analyze, track and grow with{" "}
            <Box component="span" sx={{ color: "primary.main" }}>Mutual Funds</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 640, mx: "auto", fontWeight: 400 }}>
            Explore thousands of funds, run powerful return calculators, build a watchlist and
            simulate SIPs — all in one place.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" size="large" component={Link} href="/login" sx={{ px: 4 }}>
              Login
            </Button>
            <Button variant="outlined" size="large" component={Link} href="/register" sx={{ px: 4 }}>
              Get Started Free
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 6 }}>
            {STATS.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    bgcolor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, textAlign: "center" }}>
          Everything you need to invest smarter
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, textAlign: "center" }}>
          Designed for investors who like to understand their money.
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: "100%",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.1)", transform: "translateY(-4px)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2.5,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

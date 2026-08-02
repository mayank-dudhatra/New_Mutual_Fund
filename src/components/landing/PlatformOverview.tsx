// src/components/landing/PlatformOverview.tsx
"use client";

import { Box, Container, Grid, Paper, Stack, Typography, Button, alpha, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InsightsIcon from "@mui/icons-material/Insights";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SectionHeading from "./SectionHeading";

const OVERVIEW_ITEMS = [
  { icon: SearchIcon, title: "Fund discovery", text: "Search and browse thousands of mutual fund schemes with full details." },
  { icon: InsightsIcon, title: "Performance analysis", text: "NAV history, multi-period returns and rolling-return insights." },
  { icon: CalculateIcon, title: "Investment calculators", text: "Six calculators for SIP, lump sum, SWP and step-up strategies." },
  { icon: AccountBalanceWalletIcon, title: "Virtual portfolio", text: "Simulate SIPs end-to-end without investing a single rupee." },
  { icon: StarIcon, title: "Watchlist management", text: "Save funds and track their latest moves at a glance." },
];

const TOOLKIT_ROWS = [
  { label: "Explore 28,000+ schemes", color: "#6C63FF" },
  { label: "Interactive NAV charts", color: "#16A34A" },
  { label: "6 planning calculators", color: "#F59E0B" },
  { label: "Virtual SIPs with backdating", color: "#3B82F6" },
  { label: "Private watchlist & portfolio", color: "#EC4899" },
];

export default function PlatformOverview() {
  const theme = useTheme();

  return (
    <Box component="section" id="overview" className="anchor-section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Platform Overview"
          title="One platform for the entire mutual fund journey"
          subtitle="FundFolio bundles discovery, deep analysis, planning tools and risk-free virtual investing into a single experience — so you can understand your money before you ever put it to work."
        />

        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch">
          {/* Left: capability list */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "grid", gap: 1.5, height: "100%", alignContent: "center" }}>
              {OVERVIEW_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Stack
                    key={item.title}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      "&:hover": { boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)", transform: "translateY(-2px)" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: "primary.main",
                      }}
                    >
                      <Icon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.text}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Box>
          </Grid>

          {/* Right: toolkit card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                height: "100%",
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 24px rgba(108, 99, 255, 0.30)",
                }}
              >
                <WorkspacePremiumIcon />
              </Box>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                Your complete investing toolkit
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Everything a modern investor needs, in one place.
              </Typography>

              <Box sx={{ display: "grid", gap: 1.25, mb: 2.5 }}>
                {TOOLKIT_ROWS.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(item.color, 0.06),
                      border: `1px solid ${alpha(item.color, 0.2)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: 99,
                        bgcolor: item.color,
                        boxShadow: `0 0 0 4px ${alpha(item.color, 0.15)}`,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: "auto", pt: 2.5, borderTop: `1px solid ${theme.palette.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Every tool is free to use.
                  </Typography>
                  <Typography variant="body2" fontWeight={800}>
                    No KYC · No risk · No spam
                  </Typography>
                </Box>
                <Button component="a" href="#features" endIcon={<ArrowForwardIcon />} size="small" sx={{ textTransform: "none" }}>
                  Explore features
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

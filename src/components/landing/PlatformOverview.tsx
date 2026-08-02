// src/components/landing/PlatformOverview.tsx
"use client";

import { Box, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InsightsIcon from "@mui/icons-material/Insights";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
import SectionHeading from "./SectionHeading";

const OVERVIEW_ITEMS = [
  { icon: SearchIcon, title: "Fund discovery", text: "Search and browse thousands of mutual fund schemes with full details." },
  { icon: InsightsIcon, title: "Performance analysis", text: "NAV history, multi-period returns and rolling-return insights." },
  { icon: CalculateIcon, title: "Investment calculators", text: "Six calculators for SIP, lump sum, SWP and step-up strategies." },
  { icon: AccountBalanceWalletIcon, title: "Virtual portfolio", text: "Simulate SIPs end-to-end without investing a single rupee." },
  { icon: StarIcon, title: "Watchlist management", text: "Save funds and track their latest moves at a glance." },
];

export default function PlatformOverview() {
  const theme = useTheme();

  return (
    <Box component="section" id="overview" className="anchor-section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
          {/* Copy */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading
              align="left"
              eyebrow="Platform Overview"
              title="One platform for the entire mutual fund journey"
              subtitle="FundFolio bundles discovery, deep analysis, planning tools and risk-free virtual investing into a single experience — so you can understand your money before you ever put it to work."
            />
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {OVERVIEW_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Stack
                    key={item.title}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      p: 1.75,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: "primary.main",
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
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

          {/* Visual */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2.5 }}>
                Your complete investing toolkit
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {[
                  { label: "Explore 28,000+ schemes", color: "#6C63FF" },
                  { label: "Interactive NAV charts", color: "#16A34A" },
                  { label: "6 planning calculators", color: "#F59E0B" },
                  { label: "Virtual SIPs with backdating", color: "#3B82F6" },
                  { label: "Private watchlist & portfolio", color: "#EC4899" },
                ].map((item) => (
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
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2.5 }}>
                Every tool is free to use after a 30-second sign-up.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

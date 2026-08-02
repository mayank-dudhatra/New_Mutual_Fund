// src/components/landing/KeyFeatures.tsx
"use client";

import { Box, Container, Grid, Paper, Typography, alpha, useTheme, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InsightsIcon from "@mui/icons-material/Insights";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SectionHeading from "./SectionHeading";

const FEATURES = [
  {
    icon: SearchIcon,
    title: "Fund Discovery",
    description: "Find the right fund across the entire Indian mutual fund universe.",
    points: ["Search by fund name", "Browse available schemes", "View detailed fund information"],
  },
  {
    icon: InsightsIcon,
    title: "Fund Analysis",
    description: "Understand how any fund has actually performed over time.",
    points: ["Historical NAV charts", "Returns across periods", "Rolling return analysis"],
  },
  {
    icon: CalculateIcon,
    title: "Investment Calculators",
    description: "Plan every investment strategy before committing a rupee.",
    points: ["SIP & lump sum", "SWP & step-up SWP", "Step-up SIP & rolling returns"],
  },
  {
    icon: AccountBalanceWalletIcon,
    title: "Virtual Portfolio",
    description: "Simulate investments end-to-end with zero financial risk.",
    points: ["Create, pause & resume SIPs", "Cancel & redeem anytime", "Track returns as they accrue"],
  },
  {
    icon: StarIcon,
    title: "Watchlist",
    description: "Save funds for future tracking and never miss a move.",
    points: ["Add or remove funds", "Follow latest NAV daily", "Spot movers at a glance"],
  },
];

export default function KeyFeatures() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="features"
      className="anchor-section"
      sx={{
        py: { xs: 5, md: 8 },
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Key Features"
          title="Everything you need to invest smarter"
          subtitle="Five core building blocks power the entire platform — from discovery all the way to virtual investing."
        />

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 14px 36px rgba(15, 23, 42, 0.10)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
                      color: "#fff",
                      boxShadow: "0 10px 24px rgba(108, 99, 255, 0.30)",
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: "grid", gap: 0.75 }}>
                    {feature.points.map((point) => (
                      <Stack key={point} direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography variant="body2">{point}</Typography>
                      </Stack>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

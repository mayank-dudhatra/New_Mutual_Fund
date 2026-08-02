// src/components/landing/HowItWorks.tsx
"use client";

import { Box, Container, Paper, Typography, alpha, useTheme } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import InsightsIcon from "@mui/icons-material/Insights";
import CalculateIcon from "@mui/icons-material/Calculate";
import SavingsIcon from "@mui/icons-material/Savings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    icon: PersonAddIcon,
    title: "Create an Account",
    text: "Sign up free in under a minute. Your watchlist and virtual portfolio live here.",
  },
  {
    icon: SearchIcon,
    title: "Browse Mutual Funds",
    text: "Search and browse thousands of schemes from the complete AMFI universe.",
  },
  {
    icon: InsightsIcon,
    title: "Analyze Historical Performance",
    text: "Open any fund to explore NAV charts, returns and rolling returns.",
  },
  {
    icon: CalculateIcon,
    title: "Use Investment Calculators",
    text: "Model SIPs, lump sums, SWPs and step-up strategies with real fund data.",
  },
  {
    icon: SavingsIcon,
    title: "Create a Virtual SIP",
    text: "Start a risk-free SIP — with backdated processing for a full track record.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track Portfolio Growth",
    text: "Watch your invested, current and gained amounts update as NAVs move.",
  },
  {
    icon: AssessmentIcon,
    title: "Review Investment Performance",
    text: "Pause, resume, redeem or cancel anytime and review your performance history.",
  },
];

export default function HowItWorks() {
  const theme = useTheme();

  return (
    <Box component="section" id="how-it-works" className="anchor-section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="How It Works"
          title="From first visit to first virtual SIP in seven steps"
          subtitle="A simple journey designed so anyone — from first-timers to experienced investors — can get value immediately."
        />

        <Box sx={{ position: "relative", py: 2 }}>
          {/* Vertical connector line */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: 23, md: "50%" },
              top: 0,
              bottom: 0,
              width: 2,
              transform: "translateX(-50%)",
              bgcolor: alpha(theme.palette.primary.main, 0.25),
            }}
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const onLeft = i % 2 === 0;
            return (
              <Box
                key={step.title}
                sx={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: onLeft ? "flex-start" : "flex-end",
                  mb: 3,
                  pl: { xs: "60px", md: 0 },
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    width: { xs: "100%", md: "calc(50% - 52px)" },
                    p: 2.5,
                    borderRadius: 3,
                    display: "flex",
                    gap: 2,
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.10)", transform: "translateY(-2px)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
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
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.text}
                    </Typography>
                  </Box>
                </Paper>

                {/* Number dot on the line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: 23, md: "50%" },
                    top: 26,
                    transform: "translate(-50%, -50%)",
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    boxShadow: "0 0 0 4px #fff, 0 6px 16px rgba(108, 99, 255, 0.35)",
                  }}
                >
                  {i + 1}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

// src/components/landing/CalculatorsOverview.tsx
"use client";

import { Box, Container, Grid, Paper, Typography, alpha, useTheme } from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SectionHeading from "./SectionHeading";

const CALCULATORS = [
  {
    icon: SavingsIcon,
    name: "SIP Calculator",
    purpose: "Estimate the future value of regular monthly investments based on an expected annual return.",
    outputs: ["Maturity value after the tenure", "Total invested vs. wealth gained"],
  },
  {
    icon: PaymentsIcon,
    name: "Lump Sum Calculator",
    purpose: "Project the growth of a one-time investment over your chosen investment horizon.",
    outputs: ["Future value of your corpus", "Total wealth gained"],
  },
  {
    icon: CalendarMonthIcon,
    name: "SWP Calculator",
    purpose: "Plan fixed monthly withdrawals from your corpus while it keeps working for you.",
    outputs: ["Complete withdrawal schedule", "Residual value at the end"],
  },
  {
    icon: TrendingUpIcon,
    name: "Step-up SIP Calculator",
    purpose: "Model SIPs whose amount rises every year to outpace inflation.",
    outputs: ["Future value with annual step-ups", "Year-wise investment schedule"],
  },
  {
    icon: StackedLineChartIcon,
    name: "Step-up SWP Calculator",
    purpose: "Withdrawals that grow each year, built for long inflation-adjusted income.",
    outputs: ["Escalating withdrawal schedule", "Corpus remaining at the end"],
  },
  {
    icon: ShowChartIcon,
    name: "Rolling Return Calculator",
    purpose: "Compare fund consistency across every overlapping period of a chosen window.",
    outputs: ["Range of rolling returns", "Best, worst and average performance"],
  },
];

export default function CalculatorsOverview() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="calculators"
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
          eyebrow="Investment Calculators"
          title="Six calculators for every investment style"
          subtitle="Run real numbers against real fund data — before you commit a single rupee anywhere."
        />

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon;
            return (
              <Grid key={calc.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 14px 36px rgba(15, 23, 42, 0.10)",
                      transform: "translateY(-4px)",
                    },
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
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
                    {calc.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {calc.purpose}
                  </Typography>
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.06),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    }}
                  >
                    <Typography variant="caption" fontWeight={800} sx={{ color: "success.main", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Expected output
                    </Typography>
                    {calc.outputs.map((output) => (
                      <Typography key={output} variant="body2" sx={{ mt: 0.5 }}>
                        • {output}
                      </Typography>
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

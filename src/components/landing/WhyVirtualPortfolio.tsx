// src/components/landing/WhyVirtualPortfolio.tsx
"use client";

import { Box, Container, Grid, Paper, Typography, Button, Stack, alpha, useTheme, LinearProgress } from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReturnBadge from "../ReturnBadge";
import SectionHeading from "./SectionHeading";

const REASONS = [
  { title: "No real money involved", text: "Every rupee is virtual — nothing is ever charged or at risk." },
  { title: "Practice investing safely", text: "Build confidence with a real interface and zero financial risk." },
  { title: "Simulate SIP investments", text: "Create SIPs exactly like you would on a real investment app." },
  { title: "Backdated SIP processing", text: "Start SIPs from a past date to build an instant historical track record." },
  { title: "Historical performance tracking", text: "Watch investments accrue against real NAV history." },
  { title: "Learn before investing real money", text: "Understand timing, costs and compounding before going live." },
];

const SIP_ROWS = [
  { name: "Axis Bluechip Fund", invested: 60000, current: 67340, active: true },
  { name: "HDFC Mid-Cap Opportunities", invested: 24000, current: 28510, active: true },
  { name: "ICICI Prudential Liquid", invested: 18000, current: 17920, active: false },
];

export default function WhyVirtualPortfolio() {
  const theme = useTheme();

  return (
    <Box component="section" id="why-virtual" className="anchor-section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
          {/* Copy + reasons */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading
              align="left"
              eyebrow="Why Virtual Portfolio"
              title="Invest like you mean it — without risking a rupee"
              subtitle="Our most-loved feature turns your device into a risk-free training ground for real-world investing."
            />
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {REASONS.map((reason) => (
                <Stack key={reason.title} direction="row" spacing={1.5} alignItems="flex-start">
                  <CheckCircleIcon sx={{ fontSize: 22, color: "success.main", mt: 0.25, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {reason.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reason.text}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 3 }}
            >
              Start a free virtual portfolio
            </Button>
          </Grid>

          {/* Visual: mini virtual portfolio */}
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
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    My Virtual Portfolio
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    ₹1,13,770
                  </Typography>
                </Box>
                <ReturnBadge value={12.4} variant="body1" />
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
                <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                  <Typography variant="caption" color="text.secondary">
                    Invested
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    ₹1,02,000
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.06) }}>
                  <Typography variant="caption" color="text.secondary">
                    Gain
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ color: "success.main" }}>
                    +₹11,770
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ display: "grid", gap: 1.75 }}>
                {SIP_ROWS.map((sip) => {
                  const pct = Math.min((sip.current / sip.invested - 1) * 100, 999);
                  return (
                    <Box key={sip.name}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                          {sip.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            ₹{sip.invested.toLocaleString("en-IN")}
                          </Typography>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: 99,
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              bgcolor: sip.active ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.text.secondary, 0.12),
                              color: sip.active ? "success.main" : "text.secondary",
                            }}
                          >
                            {sip.active ? "ACTIVE" : "PAUSED"}
                          </Box>
                        </Stack>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(88 + pct, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 99,
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

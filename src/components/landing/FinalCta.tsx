// src/components/landing/FinalCta.tsx
"use client";

import { Box, Container, Typography, Button, alpha, useTheme } from "@mui/material";
import Link from "next/link";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function FinalCta() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06), borderTop: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 }, textAlign: "center" }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            mx: "auto",
            mb: 2,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
            color: "#fff",
            boxShadow: "0 16px 40px rgba(108, 99, 255, 0.35)",
          }}
        >
          <CandlestickChartIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          Start exploring India&apos;s mutual funds today
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520, mx: "auto" }}>
          Create a free account, build your watchlist, simulate SIPs and explore the full fund
          universe — no KYC, no risk, no spam.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button variant="contained" size="large" component={Link} href="/register" endIcon={<ArrowForwardIcon />} sx={{ px: 4 }}>
            Create Account
          </Button>
          <Button variant="outlined" size="large" component={Link} href="/login" sx={{ px: 4 }}>
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

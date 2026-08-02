// src/components/landing/LandingFooter.tsx
"use client";

import { Box, Container, Grid, Typography, Stack, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import GitHubIcon from "@mui/icons-material/GitHub";

const GITHUB_URL = "https://github.com/mayank-dudhatra/New_Mutual_Fund";

const FOOTER_COLUMNS: { title: string; items: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Home", href: "/" },
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: GITHUB_URL, external: true },
      { label: "GitHub Repository", href: GITHUB_URL, external: true },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "support@fundfolio.app", href: "mailto:support@fundfolio.app", external: true },
      { label: "Contact Page", href: "mailto:support@fundfolio.app", external: true },
    ],
  },
];

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: "#0B1220", color: "rgba(255,255,255,0.75)", pt: { xs: 5, md: 7 }, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
                  color: "#fff",
                }}
              >
                <CandlestickChartIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box sx={{ lineHeight: 1.1 }}>
                <Typography fontWeight={800} sx={{ color: "#fff", fontSize: "1.05rem" }}>
                  FundFolio
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                  Mutual Fund Explorer
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)", maxWidth: 280 }}>
              Analyze Indian mutual funds and track virtual investments — a complete, risk-free
              learning platform for every investor.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
              <MuiLink
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }}
              >
                <GitHubIcon />
              </MuiLink>
            </Box>
          </Grid>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <Grid key={column.title} size={{ xs: 6, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#fff", mb: 1.5, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                {column.title}
              </Typography>
              <Stack spacing={1}>
                {column.items.map((item) => (
                  <Link key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, pt: 2.5, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
            © {year} FundFolio. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
            For education and research only. Not investment advice.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

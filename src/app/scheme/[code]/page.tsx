// app/scheme/[code]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Box,
  Skeleton,
  useTheme,
} from "@mui/material";
import NavChart from "@/components/NavChart";
import ReturnsTable from "@/components/ReturnsTable";
import SIPCalculator from "@/components/SIPCalculator";

export default function SchemeDetailPage() {
  const { code } = useParams();
  const [scheme, setScheme] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (code) {
      setLoading(true);
      fetch(`/api/scheme/${code}`)
        .then((res) => res.json())
        .then((data) => {
          setScheme(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [code]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Box sx={{ height: 320, bgcolor: "grey.50", borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!scheme) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Fund not found
        </Typography>
      </Container>
    );
  }

  const { meta, navHistory } = scheme;
  const oneYearNav = navHistory.slice(0, 365).reverse();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            lineHeight: 1.2,
            mb: 0.5,
            wordBreak: "break-word",
          }}
        >
          {meta.schemeName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {meta.fundHouse} • {meta.category}
        </Typography>
      </Box>

      <Divider sx={{ my: 3, borderColor: "divider" }} />

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Main Chart - Full width on mobile, 2/3 on desktop */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                NAV Performance (1 Year)
              </Typography>
              <Box sx={{ height: { xs: 280, sm: 320, md: 340 } }}>
                <NavChart data={oneYearNav} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Returns Table - Full width on mobile, 1/3 on desktop */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Returns
              </Typography>
              <Box sx={{ minHeight: 160 }}>
                <ReturnsTable code={meta.schemeCode} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* SIP Calculator - Always full width */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              mt: { xs: 2, md: 3 },
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                SIP Calculator
              </Typography>
              <SIPCalculator code={meta.schemeCode} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
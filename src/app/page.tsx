// src/app/page.tsx
"use client";

import { Button, Container, Typography, Box, Paper } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // If the user is already logged in, redirect them to the funds page
  if (user) {
    router.push("/funds");
    return null; // Render nothing while redirecting
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
        <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
          Welcome to Mutual Fund Explorer
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Analyze, track, and calculate returns on thousands of mutual funds with powerful tools at your fingertips.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/login"
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/register"
          >
            Get Started
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
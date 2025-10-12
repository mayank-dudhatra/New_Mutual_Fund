// src/app/home/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { Container, Typography, Paper, Box, CircularProgress } from "@mui/material";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          This is your dashboard. From here you can navigate to view all funds or manage your watchlist.
        </Typography>
      </Paper>
    </Container>
  );
}
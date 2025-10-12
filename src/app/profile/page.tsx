// src/app/profile/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { Container, Typography, Paper, Box } from "@mui/material";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        {user ? (
          <Box>
            <Typography variant="h6">Name: {user.name}</Typography>
            <Typography variant="h6">Email: {user.email}</Typography>
            <Typography variant="h6">User ID: {user.id}</Typography>
          </Box>
        ) : (
          <Typography>Loading user data...</Typography>
        )}
      </Paper>
    </Container>
  );
}
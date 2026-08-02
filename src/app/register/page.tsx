// src/app/register/page.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper, Typography, TextField, Button, Box, useTheme, alpha } from "@mui/material";
import Link from "next/link";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        setError(data.error || "Something went wrong.");
    } else {
        router.push("/login");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #EDEAFF 0%, #F5F7FA 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3.5, sm: 5 }, borderRadius: 4, boxShadow: "0 16px 48px rgba(15, 23, 42, 0.1)" }}
        >
          <Box sx={{ textAlign: "center", mb: 3.5 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                mb: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
                color: "#fff",
                boxShadow: "0 10px 28px rgba(108, 99, 255, 0.35)",
              }}
            >
              <CandlestickChartIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h5" component="h1" fontWeight={800}>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join FundFolio and start investing smarter
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{ startAdornment: <PersonIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{ startAdornment: <EmailIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ startAdornment: <LockIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 1, p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.08) }}
              >
                {error}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Link href="/login" passHref>
              <Button fullWidth variant="outlined" size="large">
                Already have an account? Sign In
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// src/app/register/page.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>Register</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField margin="normal" required fullWidth id="name" label="Full Name" name="name" autoComplete="name" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
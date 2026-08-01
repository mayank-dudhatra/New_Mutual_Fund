// src/components/AddSipForm.tsx
"use client";

import { useState } from "react";
import { TextField, Button, Box, Paper, Typography, InputAdornment, Alert, CircularProgress, MenuItem, Grid } from "@mui/material";
import dayjs from "dayjs";

export default function AddSipForm({ onSipAdded }: { onSipAdded: (sip: any) => void }) {
  const [schemeCode, setSchemeCode] = useState('');
  const [sipAmount, setSipAmount] = useState('1000');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [duration, setDuration] = useState('12'); // Default to 12 months
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fundCheckRes = await fetch(`/api/scheme/${schemeCode}`);
      if (!fundCheckRes.ok) {
        throw new Error("Invalid Scheme Code. Please check and try again.");
      }
      const fundData = await fundCheckRes.json();
      
      const sipRes = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeCode,
          schemeName: fundData.meta.schemeName,
          sipAmount,
          startDate,
          durationMonths: duration,
        }),
      });

      const sipData = await sipRes.json();
      if (!sipRes.ok) {
        throw new Error(sipData.error || "Failed to add SIP.");
      }

      onSipAdded(sipData.sip);
      setSchemeCode('');
      setSipAmount('1000');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>Add a New Virtual SIP</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Scheme Code" required fullWidth value={schemeCode} onChange={(e) => setSchemeCode(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Monthly SIP Amount" type="number" required fullWidth value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Start Date" type="date" required fullWidth value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select label="Duration" fullWidth value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <MenuItem value="12">1 Year</MenuItem>
                    <MenuItem value="36">3 Years</MenuItem>
                    <MenuItem value="60">5 Years</MenuItem>
                    <MenuItem value="0">Until Cancelled</MenuItem>
                </TextField>
            </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }} startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}>
          {loading ? 'Adding...' : 'Add SIP to Portfolio'}
        </Button>
      </Box>
    </Paper>
  );
}
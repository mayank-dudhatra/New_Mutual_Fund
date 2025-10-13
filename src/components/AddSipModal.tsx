// src/components/AddSipModal.tsx
"use client";

import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, InputAdornment, Alert, CircularProgress, MenuItem, Grid, Modal, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

interface AddSipModalProps {
    open: boolean;
    onClose: () => void;
    defaultSchemeCode?: string;
    defaultSchemeName?: string;
}

export default function AddSipModal({ open, onClose, defaultSchemeCode = '', defaultSchemeName = '' }: AddSipModalProps) {
  const [schemeCode, setSchemeCode] = useState(defaultSchemeCode);
  const [schemeName, setSchemeName] = useState(defaultSchemeName);
  const [sipAmount, setSipAmount] = useState('1000');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [duration, setDuration] = useState('0'); // Default to "Until Cancelled"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Update state if the default props change
  useEffect(() => {
    setSchemeCode(defaultSchemeCode);
    setSchemeName(defaultSchemeName);
  }, [defaultSchemeCode, defaultSchemeName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalSchemeName = schemeName;
      // If the form was opened without a default name, we need to fetch it to validate the code.
      if (!finalSchemeName) {
        const fundCheckRes = await fetch(`/api/scheme/${schemeCode}`);
        if (!fundCheckRes.ok) throw new Error("Invalid Scheme Code.");
        const fundData = await fundCheckRes.json();
        finalSchemeName = fundData.meta.schemeName;
      }
      
      const sipRes = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeCode, schemeName: finalSchemeName, sipAmount, startDate, durationMonths: duration }),
      });

      const sipData = await sipRes.json();
      if (!sipRes.ok) throw new Error(sipData.error || "Failed to add SIP.");
      
      onClose(); // Close the modal
      router.push('/virtual-portfolio'); // Navigate to the portfolio page

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={style}>
        <Typography variant="h6" gutterBottom>Start a New Virtual SIP</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <TextField label="Scheme Code" required fullWidth value={schemeCode} onChange={(e) => setSchemeCode(e.target.value)} disabled={!!defaultSchemeCode} />
              </Grid>
              <Grid item xs={12}>
                  <TextField label="Monthly SIP Amount" type="number" required fullWidth value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField label="Start Date" type="date" required fullWidth value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField select label="Duration" fullWidth value={duration} onChange={(e) => setDuration(e.target.value)}>
                      <MenuItem value="0">Until Cancelled</MenuItem>
                      <MenuItem value="12">1 Year</MenuItem>
                      <MenuItem value="36">3 Years</MenuItem>
                      <MenuItem value="60">5 Years</MenuItem>
                  </TextField>
              </Grid>
          </Grid>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }} startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}>
            {loading ? 'Starting SIP...' : 'Start Virtual SIP'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
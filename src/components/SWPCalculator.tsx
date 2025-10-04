// src/components/SWPCalculator.tsx
"use client";

import { useState } from "react";
import {
  Box, Button, Divider, Grid, InputAdornment, Paper, Slider,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, alpha, useTheme
} from "@mui/material";
import CalculateIcon from '@mui/icons-material/Calculate';
import { calculateSWP, SWPResult } from "@/lib/swpCalculator";

// Helper to format currency
const formatCurrency = (val: number) => `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

// --- Sub-components for better structure ---
const InputSlider = ({ label, value, onChange, min, max, step, adornment }: any) => (
  <Box>
    <Typography gutterBottom>{label}</Typography>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={8}>
        <Slider value={value} onChange={(_, val) => onChange(val)} min={min} max={max} step={step} />
      </Grid>
      <Grid item xs={4}>
        <TextField
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          type="number"
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start">{adornment}</InputAdornment> }}
        />
      </Grid>
    </Grid>
  </Box>
);

const ResultCard = ({ title, value, color }: { title: string, value: string, color: string }) => {
    const theme = useTheme();
    const finalColor = theme.palette[color as keyof typeof theme.palette]?.main || theme.palette.text.primary;
    return (
        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2, backgroundColor: alpha(finalColor, 0.1) }}>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" fontWeight="700" sx={{ color: finalColor }}>{value}</Typography>
        </Paper>
    );
};

// --- Main Calculator Component ---
export default function SWPCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(8000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [durationInYears, setDurationInYears] = useState(10);
  const [result, setResult] = useState<SWPResult | null>(null);

  const handleCalculate = () => {
    const res = calculateSWP({
      totalInvestment,
      monthlyWithdrawal,
      annualReturnRate,
      durationInYears,
    });
    setResult(res);
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, border: `1px solid #e0e0e0` }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        SWP Calculator
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Plan your Systematic Withdrawals from a lump sum investment.
      </Typography>

      <Grid container spacing={4}>
        {/* --- Inputs --- */}
        <Grid item xs={12} md={5}>
          <Stack spacing={4}>
            <InputSlider
              label="Total Investment"
              value={totalInvestment}
              onChange={setTotalInvestment}
              min={50000} max={50000000} step={50000}
              adornment="₹"
            />
            <InputSlider
              label="Monthly Withdrawal"
              value={monthlyWithdrawal}
              onChange={setMonthlyWithdrawal}
              min={1000} max={100000} step={1000}
              adornment="₹"
            />
            <InputSlider
              label="Expected Annual Return"
              value={annualReturnRate}
              onChange={setAnnualReturnRate}
              min={1} max={30} step={1}
              adornment="%"
            />
            <InputSlider
              label="Time Period (Years)"
              value={durationInYears}
              onChange={setDurationInYears}
              min={1} max={50} step={1}
              adornment="Yrs"
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<CalculateIcon />}
              onClick={handleCalculate}
            >
              Calculate
            </Button>
          </Stack>
        </Grid>

        {/* --- Results --- */}
        <Grid item xs={12} md={7}>
          {result && (
            <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}><ResultCard title="Total Investment" value={formatCurrency(result.totalInvestment)} color="info" /></Grid>
                    <Grid item xs={12} sm={4}><ResultCard title="Total Withdrawal" value={formatCurrency(result.totalWithdrawal)} color="warning" /></Grid>
                    <Grid item xs={12} sm={4}><ResultCard title="Final Value" value={formatCurrency(result.finalValue)} color="success" /></Grid>
                </Grid>

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Yearly Projection
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Year</TableCell>
                      <TableCell align="right">Opening Balance</TableCell>
                      <TableCell align="right">Interest Earned</TableCell>
                      <TableCell align="right">Withdrawal</TableCell>
                      <TableCell align="right">Closing Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.breakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell align="right">{formatCurrency(row.openingBalance)}</TableCell>
                        <TableCell align="right" sx={{color: 'success.main'}}>+ {formatCurrency(row.interestEarned)}</TableCell>
                        <TableCell align="right" sx={{color: 'error.main'}}>- {formatCurrency(row.totalWithdrawal)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.closingBalance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
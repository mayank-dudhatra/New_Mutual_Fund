// src/app/virtual-portfolio/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { VirtualSip, SipTransaction } from "@/models/VirtualPortfolio";
import { formatCurrency } from "@/lib/utils";

interface NavPerformance {
  currentNav: number | null;
  prevNav: number | null;
}

interface Cashflow {
  amount: number;
  date: dayjs.Dayjs;
}

function calculateXIRR(cashflows: Cashflow[]): number {
  if (cashflows.length < 2) return 0;
  const maxIterations = 100;
  const tolerance = 1e-7;
  let guess = 0.1;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;
    const firstDate = cashflows[0].date;

    for (const cf of cashflows) {
      const days = cf.date.diff(firstDate, "day");
      const exponent = days / 365.0;
      npv += cf.amount / Math.pow(1 + guess, exponent);
      if (guess > -1) {
        derivative += (-exponent * cf.amount) / Math.pow(1 + guess, exponent + 1);
      }
    }

    if (Math.abs(npv) < tolerance) return guess;
    if (derivative === 0) break;
    guess = guess - npv / derivative;
  }
  return 0;
}

export default function SipDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const theme = useTheme();

  const [sip, setSip] = useState<VirtualSip | null>(null);
  const [transactions, setTransactions] = useState<SipTransaction[]>([]);
  const [performance, setPerformance] = useState<NavPerformance>({ currentNav: null, prevNav: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/portfolio/${id}`);
        if (!res.ok) throw new Error("Failed to load SIP.");
        const data = await res.json();
        if (!mounted) return;
        setSip(data.sip);
        setTransactions(data.transactions || []);

        if (data.sip) {
          const perfRes = await fetch("/api/portfolio/performance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schemeCodes: [data.sip.schemeCode] }),
          });
          if (perfRes.ok && mounted) {
            const perfData = await perfRes.json();
            setPerformance(perfData[data.sip.schemeCode] || { currentNav: null, prevNav: null });
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const currentNav = performance.currentNav;

  const currentValue = sip?.redeemed
    ? sip.redeemedValue || 0
    : sip ? sip.totalUnits * (currentNav || 0) : 0;

  const totalInvested = sip?.totalInvested || 0;
  const pnl = currentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;
  const progress = sip && sip.durationMonths > 0 ? (sip.completedInstallments / sip.durationMonths) * 100 : 0;
  const remainingInstallments = sip && sip.durationMonths > 0
    ? Math.max(0, sip.durationMonths - sip.completedInstallments)
    : null;

  const statusColors: Record<VirtualSip["status"], "success" | "warning" | "info" | "error"> = {
    active: "success",
    paused: "warning",
    completed: "info",
    cancelled: "error",
  };

  const growthData = useMemo(() => {
    const data: { date: string; investment: number; value: number }[] = [];
    let cumulativeInvestment = 0;
    let cumulativeUnits = 0;
    for (const t of transactions) {
      cumulativeInvestment += t.amount;
      cumulativeUnits += t.units;
      data.push({
        date: t.transactionDate,
        investment: parseFloat(cumulativeInvestment.toFixed(2)),
        value: parseFloat((cumulativeUnits * t.nav).toFixed(2)),
      });
    }
    if (data.length > 0 && currentNav) {
      data.push({
        date: dayjs().format("YYYY-MM-DD"),
        investment: cumulativeInvestment,
        value: parseFloat((cumulativeUnits * currentNav).toFixed(2)),
      });
    }
    return data;
  }, [transactions, currentNav]);

  const xirr = useMemo(() => {
    if (!sip || transactions.length === 0) return 0;
    const cashflows: Cashflow[] = transactions.map((t) => ({
      amount: -t.amount,
      date: dayjs(t.transactionDate, "YYYY-MM-DD"),
    }));
    cashflows.push({ amount: currentValue, date: dayjs() });
    return calculateXIRR(cashflows) * 100;
  }, [sip, transactions, currentValue]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !sip) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography color="error">{error || "SIP not found."}</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push("/virtual-portfolio")}>Back to Portfolio</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => router.push("/virtual-portfolio")}>
          Portfolio
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {sip.schemeName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formatCurrency(sip.sipAmount)} / month • Started {dayjs(sip.startDate).format("DD MMM YYYY")}
          </Typography>
        </Box>
        <Chip label={sip.status} color={statusColors[sip.status]} sx={{ textTransform: "capitalize" }} />
      </Box>

      {/* Summary Metrics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="caption" color="text.secondary">Invested</Typography>
            <Typography fontWeight={600}>{formatCurrency(totalInvested)}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="caption" color="text.secondary">Current Value</Typography>
            <Typography variant="h6" fontWeight={700}>{formatCurrency(currentValue)}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="caption" color="text.secondary">Profit / Loss</Typography>
            <Typography fontWeight={600} color={pnl >= 0 ? "success.main" : "error.main"}>
              {formatCurrency(pnl)}
            </Typography>
            <Typography variant="caption" color={pnl >= 0 ? "success.main" : "error.main"}>
              ({pnlPercent.toFixed(2)}%)
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center", height: "100%" }}>
            <Typography variant="caption" color="text.secondary">XIRR (Annualized)</Typography>
            <Typography fontWeight={600} color={xirr >= 0 ? "success.main" : "error.main"}>
              {xirr.toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Progress */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>SIP Progress</Typography>
          <Typography variant="caption" color="text.secondary">
            {sip.completedInstallments} installments completed
            {sip.durationMonths > 0 ? ` of ${sip.durationMonths}` : ""}
            {" • "}
            {remainingInstallments === null ? "ongoing (Until Cancelled)" : `${remainingInstallments} remaining`}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={Math.min(100, progress)} sx={{ height: 8, borderRadius: 4 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">Next installment: {dayjs(sip.nextSipDate).format("DD MMM YYYY")}</Typography>
          <Typography variant="caption" color="text.secondary">Total units: {sip.totalUnits.toFixed(4)}</Typography>
        </Box>
      </Paper>

      {/* Growth Chart */}
      {growthData.length > 1 && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Investment Growth</Typography>
          <Box sx={{ height: { xs: 280, md: 360 }, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  tickMargin={10}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(tick: string) => dayjs(tick).format("MMM YY")}
                />
                <YAxis
                  tickFormatter={(val: number) => (val >= 1e5 ? `₹${(val / 1e5).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`)}
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  width={70}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload || payload.length === 0) return null;
                    return (
                      <Paper
                        elevation={6}
                        sx={{
                          p: 1.5,
                          backgroundColor: alpha(theme.palette.background.paper, 0.95),
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(label).format("DD MMM, YYYY")}
                        </Typography>
                        {payload.map((entry: any) => (
                          <Typography key={entry.dataKey} variant="body2" fontWeight={600}>
                            {entry.name}: {formatCurrency(entry.value)}
                          </Typography>
                        ))}
                      </Paper>
                    );
                  }}
                />
                <Legend />
                <Line type="stepAfter" dataKey="investment" name="Invested" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="value" name="Market Value" stroke={theme.palette.success.main} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}

      {/* Transaction History */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>Installment History</Typography>
          <Typography variant="caption" color="text.secondary">
            {transactions.length} installment(s) recorded using historical NAV.
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Installment Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>NAV</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Units Purchased</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((t, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{dayjs(t.transactionDate).format("DD MMM YYYY")}</TableCell>
                    <TableCell align="right">{formatCurrency(t.nav)}</TableCell>
                    <TableCell align="right">{formatCurrency(t.amount)}</TableCell>
                    <TableCell align="right">{t.units.toFixed(4)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" sx={{ p: 4, fontStyle: "italic" }}>
                      No installments yet. The first installment will be processed on {dayjs(sip.nextSipDate).format("DD MMM YYYY")}.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

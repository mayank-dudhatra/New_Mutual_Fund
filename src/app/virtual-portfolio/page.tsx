// src/app/virtual-portfolio/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Paper, Button, ToggleButtonGroup, ToggleButton, useTheme, alpha } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddSipModal from "@/components/AddSipModal";
import { formatCurrency } from "@/lib/utils";
import PortfolioSipRow from "@/components/PortfolioSipRow";
import { usePortfolioStore } from "@/store/portfolioStore";
import StatCard from "@/components/StatCard";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HistoryIcon from "@mui/icons-material/History";

type View = 'holdings' | 'history';

export default function VirtualPortfolioPage() {
  const theme = useTheme();
  const sips = usePortfolioStore((s) => s.sips);
  const performance = usePortfolioStore((s) => s.performance);
  const status = usePortfolioStore((s) => s.status);
  const fetchPortfolio = usePortfolioStore((s) => s.fetchPortfolio);
  const removeSip = usePortfolioStore((s) => s.removeSip);

  const [isSipModalOpen, setSipModalOpen] = useState(false);
  const [view, setView] = useState<View>('holdings');

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const handleSipDeleted = (deletedSipId: string) => {
    removeSip(deletedSipId);
  };

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: View | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const holdings = useMemo(
    () => sips.filter(sip => (sip.status === 'active' || sip.status === 'paused') && !sip.redeemed),
    [sips]
  );
  const history = useMemo(
    () => sips.filter(sip => sip.status === 'completed' || sip.status === 'cancelled' || sip.redeemed),
    [sips]
  );

  const holdingsSummary = useMemo(() => holdings.reduce((acc, sip) => {
    const perf = performance[sip.schemeCode];
    if (perf && perf.currentNav) {
        const currentValue = sip.totalUnits * perf.currentNav;
        acc.totalInvested += sip.totalInvested;
        acc.totalCurrentValue += currentValue;
    }
    return acc;
  }, { totalInvested: 0, totalCurrentValue: 0 }), [holdings, performance]);

  const historySummary = useMemo(() => history.reduce((acc, sip) => {
      acc.totalInvested += sip.totalInvested;
      const perf = performance[sip.schemeCode];
      const finalValue = sip.redeemedValue || (perf?.currentNav ? perf.currentNav * sip.totalUnits : 0) || 0;
      acc.totalFinalValue += finalValue;
      return acc;
  }, { totalInvested: 0, totalFinalValue: 0 }), [history, performance]);

  const totalPnlHistory = historySummary.totalFinalValue - historySummary.totalInvested;
  const holdingsPnl = holdingsSummary.totalCurrentValue - holdingsSummary.totalInvested;
  const holdingsPnlPercent = holdingsSummary.totalInvested > 0 ? (holdingsPnl / holdingsSummary.totalInvested) * 100 : null;

  const loading = status === 'loading';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AddSipModal open={isSipModalOpen} onClose={() => { setSipModalOpen(false); fetchPortfolio(true); }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>My Virtual Portfolio</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Simulate SIPs and track how your money grows over time
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSipModalOpen(true)}>Start a SIP</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : (
        <Box>
          <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} sx={{ mb: 3 }}>
            <ToggleButton value="holdings">Holdings ({holdings.length})</ToggleButton>
            <ToggleButton value="history">Completed & Cancelled ({history.length})</ToggleButton>
          </ToggleButtonGroup>

          {view === 'holdings' && (
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard label="Invested Value" value={formatCurrency(holdingsSummary.totalInvested)} icon={<PaidIcon sx={{ fontSize: 18 }} />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard label="Current Value" value={formatCurrency(holdingsSummary.totalCurrentValue)} icon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard label="Total P&L" value={formatCurrency(holdingsPnl)} delta={holdingsPnlPercent} deltaLabel="since start" icon={<TrendingUpIcon sx={{ fontSize: 18 }} />} valueColor={holdingsPnl >= 0 ? theme.palette.success.main : theme.palette.error.main} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard label="Active SIPs" value={String(holdings.length)} icon={<HistoryIcon sx={{ fontSize: 18 }} />} />
              </Grid>
            </Grid>
          )}

          {view === 'history' && (
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatCard label="Total Invested" value={formatCurrency(historySummary.totalInvested)} icon={<PaidIcon sx={{ fontSize: 18 }} />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatCard label="Total Profit/Loss" value={formatCurrency(totalPnlHistory)} delta={historySummary.totalInvested > 0 ? (totalPnlHistory / historySummary.totalInvested) * 100 : null} deltaLabel="of invested amount" icon={<TrendingUpIcon sx={{ fontSize: 18 }} />} valueColor={totalPnlHistory >= 0 ? theme.palette.success.main : theme.palette.error.main} />
              </Grid>
            </Grid>
          )}

          <Box mt={1}>
            {(view === 'holdings' ? holdings : history).map(sip => (
              <PortfolioSipRow key={sip._id.toString()} sip={sip} performance={performance[sip.schemeCode]} onSipDeleted={handleSipDeleted} onSipUpdated={() => fetchPortfolio(true)} />
            ))}
            {sips.length === 0 && !loading && (
              <Paper
                variant="outlined"
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                }}
              >
                <Typography color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  Your portfolio is empty. Click &quot;Start a SIP&quot; to add your first virtual investment.
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSipModalOpen(true)}>
                  Start a SIP
                </Button>
              </Paper>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

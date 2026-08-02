// src/app/virtual-portfolio/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Paper, Divider, Button, ToggleButtonGroup, ToggleButton, Chip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddSipModal from "@/components/AddSipModal";
import { formatCurrency } from "@/lib/utils";
import PortfolioSipRow from "@/components/PortfolioSipRow";
import { usePortfolioStore } from "@/store/portfolioStore";

type View = 'holdings' | 'history';

export default function VirtualPortfolioPage() {
  const sips = usePortfolioStore((s) => s.sips);
  const performance = usePortfolioStore((s) => s.performance);
  const status = usePortfolioStore((s) => s.status);
  const fetchPortfolio = usePortfolioStore((s) => s.fetchPortfolio);
  const removeSip = usePortfolioStore((s) => s.removeSip);

  const [isSipModalOpen, setSipModalOpen] = useState(false);
  const [view, setView] = useState<View>('holdings');

  // Reuse cached data if fresh; otherwise fetch once. Subsequent navigations
  // to this page reuse the shared store instead of refetching everything.
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

  const loading = status === 'loading';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AddSipModal open={isSipModalOpen} onClose={() => { setSipModalOpen(false); fetchPortfolio(true); }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>My Virtual Portfolio</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSipModalOpen(true)}>Start a SIP</Button>
      </Box>

      {/* FIX: The entire conditional block is now correctly wrapped in parentheses */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : (
        <Box>
            <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} sx={{ mb: 2 }}>
                <ToggleButton value="holdings">Holdings ({holdings.length})</ToggleButton>
                <ToggleButton value="history">Completed & Cancelled ({history.length})</ToggleButton>
            </ToggleButtonGroup>

            {view === 'holdings' && (
                <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 3 }} textAlign="center"><Typography variant="caption" color="text.secondary">Invested Value</Typography><Typography fontWeight={600}>{formatCurrency(holdingsSummary.totalInvested)}</Typography></Grid>
                    <Grid size={{ xs: 6, md: 3 }} textAlign="center"><Typography variant="caption" color="text.secondary">Current Value</Typography><Typography variant="h6" fontWeight={600}>{formatCurrency(holdingsSummary.totalCurrentValue)}</Typography></Grid>
                    <Grid size={{ xs: 12, md: 6 }} textAlign="center"><Typography variant="caption" color="text.secondary">Total P&L</Typography><Typography fontWeight={600} color={holdingsSummary.totalCurrentValue - holdingsSummary.totalInvested >= 0 ? 'success.main' : 'error.main'}>{formatCurrency(holdingsSummary.totalCurrentValue - holdingsSummary.totalInvested)}</Typography></Grid>
                  </Grid>
                </Paper>
            )}

            {view === 'history' && (
                 <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid size={6} textAlign="center"><Typography variant="caption" color="text.secondary">Total Invested</Typography><Typography fontWeight={600}>{formatCurrency(historySummary.totalInvested)}</Typography></Grid>
                    <Grid size={6} textAlign="center"><Typography variant="caption" color="text.secondary">Total Profit/Loss</Typography><Typography fontWeight={600} color={totalPnlHistory >= 0 ? 'success.main' : 'error.main'}>{formatCurrency(totalPnlHistory)}</Typography></Grid>
                  </Grid>
                </Paper>
            )}

            <Box mt={2}>
                {(view === 'holdings' ? holdings : history).map(sip => (
                    <PortfolioSipRow key={sip._id.toString()} sip={sip} performance={performance[sip.schemeCode]} onSipDeleted={handleSipDeleted} onSipUpdated={() => fetchPortfolio(true)} />
                ))}
                {sips.length === 0 && !loading && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', p: 6, fontStyle: 'italic' }}>
                        Your portfolio is empty. Click &quot;Start a SIP&quot; to add your first virtual investment.
                    </Typography>
                )}
            </Box>
        </Box>
      )}
    </Container>
  );
}
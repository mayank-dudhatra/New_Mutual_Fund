// src/app/virtual-portfolio/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Paper, Divider, Button, ToggleButtonGroup, ToggleButton, Chip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { VirtualSip } from "@/models/VirtualPortfolio";
import AddSipModal from "@/components/AddSipModal";
import { formatCurrency } from "@/lib/utils";
import PortfolioSipRow from "@/components/PortfolioSipRow";

type View = 'holdings' | 'history';

export default function VirtualPortfolioPage() {
  const [sips, setSips] = useState<VirtualSip[]>([]);
  const [performance, setPerformance] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSipModalOpen, setSipModalOpen] = useState(false);
  const [view, setView] = useState<View>('holdings');

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const sipsResponse = await fetch('/api/portfolio');
      const sipsData = await sipsResponse.json();
      if (!sipsResponse.ok) throw new Error("Failed to fetch portfolio.");
      
      const fetchedSips: VirtualSip[] = sipsData.sips || [];
      setSips(fetchedSips);

      if (fetchedSips.length > 0) {
        const schemeCodes = fetchedSips.map(s => s.schemeCode);
        const perfResponse = await fetch('/api/portfolio/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schemeCodes }),
        });
        const perfData = await perfResponse.json();
        if (perfResponse.ok) setPerformance(perfData);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const handleSipDeleted = (deletedSipId: string) => {
    setSips(prevSips => prevSips.filter(sip => sip._id.toString() !== deletedSipId));
  };
  
  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: View | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const holdings = sips.filter(sip => (sip.status === 'active' || sip.status === 'paused') && !sip.redeemed);
  const history = sips.filter(sip => sip.status === 'completed' || sip.status === 'cancelled' || sip.redeemed);

  const holdingsSummary = holdings.reduce((acc, sip) => {
    const perf = performance[sip.schemeCode];
    if (perf && perf.currentNav) {
        const currentValue = sip.totalUnits * perf.currentNav;
        acc.totalInvested += sip.totalInvested;
        acc.totalCurrentValue += currentValue;
    }
    return acc;
  }, { totalInvested: 0, totalCurrentValue: 0 });

  const historySummary = history.reduce((acc, sip) => {
      acc.totalInvested += sip.totalInvested;
      const finalValue = sip.redeemedValue || (performance[sip.schemeCode]?.currentNav * sip.totalUnits) || 0;
      acc.totalFinalValue += finalValue;
      return acc;
  }, { totalInvested: 0, totalFinalValue: 0 });
  
  const totalPnlHistory = historySummary.totalFinalValue - historySummary.totalInvested;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AddSipModal open={isSipModalOpen} onClose={() => { setSipModalOpen(false); fetchPortfolio(); }} />

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
                    <Grid item xs={6} md={3} textAlign="center"><Typography variant="caption" color="text.secondary">Invested Value</Typography><Typography fontWeight={600}>{formatCurrency(holdingsSummary.totalInvested)}</Typography></Grid>
                    <Grid item xs={6} md={3} textAlign="center"><Typography variant="caption" color="text.secondary">Current Value</Typography><Typography variant="h6" fontWeight={600}>{formatCurrency(holdingsSummary.totalCurrentValue)}</Typography></Grid>
                    <Grid item xs={12} md={6} textAlign="center"><Typography variant="caption" color="text.secondary">Total P&L</Typography><Typography fontWeight={600} color={holdingsSummary.totalCurrentValue - holdingsSummary.totalInvested >= 0 ? 'success.main' : 'error.main'}>{formatCurrency(holdingsSummary.totalCurrentValue - holdingsSummary.totalInvested)}</Typography></Grid>
                  </Grid>
                </Paper>
            )}

            {view === 'history' && (
                 <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} textAlign="center"><Typography variant="caption" color="text.secondary">Total Invested</Typography><Typography fontWeight={600}>{formatCurrency(historySummary.totalInvested)}</Typography></Grid>
                    <Grid item xs={6} textAlign="center"><Typography variant="caption" color="text.secondary">Total Profit/Loss</Typography><Typography fontWeight={600} color={totalPnlHistory >= 0 ? 'success.main' : 'error.main'}>{formatCurrency(totalPnlHistory)}</Typography></Grid>
                  </Grid>
                </Paper>
            )}

            <Box mt={2}>
                {(view === 'holdings' ? holdings : history).map(sip => (
                    <PortfolioSipRow key={sip._id.toString()} sip={sip} performance={performance[sip.schemeCode]} onSipDeleted={handleSipDeleted} onSipUpdated={fetchPortfolio} />
                ))}
                {sips.length === 0 && !loading && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', p: 6, fontStyle: 'italic' }}>
                        Your portfolio is empty. Click "Start a SIP" to add your first virtual investment.
                    </Typography>
                )}
            </Box>
        </Box>
      )}
    </Container>
  );
}
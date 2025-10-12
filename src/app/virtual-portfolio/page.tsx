// src/app/virtual-portfolio/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Divider } from "@mui/material";
import { VirtualSip } from "@/models/VirtualPortfolio";
import AddSipForm from "@/components/AddSipForm";
import VirtualSipCard from "@/components/VirtualSipCard";

export default function VirtualPortfolioPage() {
  const [sips, setSips] = useState<VirtualSip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSips = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error("Failed to fetch your portfolio.");
      const data = await response.json();
      setSips(data.sips || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSips();
  }, []);

  const handleSipDeleted = (deletedSipId: string) => {
    setSips(prevSips => prevSips.filter(sip => sip._id.toString() !== deletedSipId));
  };
  
  const activeSips = sips.filter(sip => sip.status === 'active' || sip.status === 'paused');
  const historySips = sips.filter(sip => sip.status === 'completed' || sip.status === 'cancelled');

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>{error}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Virtual Portfolio
      </Typography>

      <AddSipForm onSipAdded={fetchSips} />
      
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 6 }}>
        Active & Paused SIPs
      </Typography>
      
      {activeSips.length > 0 ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {activeSips.map((sip) => (
            <Grid item xs={12} md={6} lg={4} key={sip._id.toString()}>
              <VirtualSipCard sip={sip} onSipDeleted={handleSipDeleted} onSipUpdated={fetchSips} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', p: 6, fontStyle: 'italic' }}>
          You have no active or paused virtual SIPs.
        </Typography>
      )}

      <Divider sx={{ my: 6 }} />

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Completed & Cancelled History
      </Typography>
      
      {historySips.length > 0 ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {historySips.map((sip) => (
            <Grid item xs={12} md={6} lg={4} key={sip._id.toString()}>
              <VirtualSipCard sip={sip} onSipDeleted={handleSipDeleted} onSipUpdated={fetchSips} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', p: 6, fontStyle: 'italic' }}>
          Your SIP history is empty.
        </Typography>
      )}
    </Container>
  );
}
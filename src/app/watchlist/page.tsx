// src/app/watchlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, CircularProgress } from "@mui/material";
import { WatchlistItem } from "@/models/Watchlist";
import WatchlistRow from "@/components/WatchlistRow";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const response = await fetch('/api/watchlist');
        if (!response.ok) {
          throw new Error("Failed to fetch watchlist.");
        }
        const data = await response.json();
        setWatchlist(data.watchlist);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>{error}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Watchlist
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '40%' }}>Fund Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>1D</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>1M</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>3M</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>6M</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>1Y</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {watchlist.length > 0 ? (
                watchlist.map((item) => (
                  <WatchlistRow key={item.schemeCode} item={item} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ p: 6 }}>
                      Your watchlist is empty. Add funds from their detail pages.
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
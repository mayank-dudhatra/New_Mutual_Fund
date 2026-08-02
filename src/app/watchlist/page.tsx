// src/app/watchlist/page.tsx
"use client";

import { Container, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, CircularProgress } from "@mui/material";
import { WatchlistItem } from "@/models/Watchlist";
import WatchlistRow from "@/components/WatchlistRow";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function WatchlistPage() {
  const { data, isLoading: loading, error } = useWatchlist();
  const watchlist: WatchlistItem[] = data?.watchlist ?? [];

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>{(error as Error).message}</Typography>;
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
// src/app/watchlist/page.tsx
"use client";

import { Container, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, CircularProgress, Button, useTheme, alpha } from "@mui/material";
import { WatchlistItem } from "@/models/Watchlist";
import WatchlistRow from "@/components/WatchlistRow";
import { useWatchlist } from "@/hooks/useWatchlist";
import Link from "next/link";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function WatchlistPage() {
  const theme = useTheme();
  const { data, isLoading: loading, error } = useWatchlist();
  const watchlist: WatchlistItem[] = data?.watchlist ?? [];

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 10 }}>{(error as Error).message}</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            My Watchlist
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {watchlist.length > 0 ? `${watchlist.length} fund${watchlist.length > 1 ? "s" : ""} being tracked` : "Funds you follow will appear here"}
          </Typography>
        </Box>
        <Button variant="contained" component={Link} href="/funds" startIcon={<StarBorderIcon />}>
          Add Funds
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '40%' }}>Fund Name</TableCell>
                <TableCell align="right">1D</TableCell>
                <TableCell align="right">1M</TableCell>
                <TableCell align="right">3M</TableCell>
                <TableCell align="right">6M</TableCell>
                <TableCell align="right">1Y</TableCell>
                <TableCell align="right">Actions</TableCell>
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
                    <Box sx={{ p: 6, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          mx: "auto",
                          mb: 2,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                        }}
                      >
                        <StarBorderIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Your watchlist is empty. Add funds from their detail pages.
                      </Typography>
                      <Button component={Link} href="/funds" variant="outlined">
                        Explore Funds
                      </Button>
                    </Box>
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

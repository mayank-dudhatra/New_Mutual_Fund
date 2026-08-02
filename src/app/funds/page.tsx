// src/app/funds/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  TextField,
  Pagination,
  Paper,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FundListItem from "@/components/FundListItem";
import SyncFunds from "@/components/SyncFunds";
import { useFunds } from "@/hooks/useFunds";

export default function FundsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFunds(page);

  const allFunds = useMemo(() => data?.funds ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 50);

  const filteredFunds = useMemo(
    () =>
      allFunds.filter((fund) =>
        fund.schemeName.toLowerCase().includes(search.toLowerCase())
      ),
    [allFunds, search]
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Mutual Fund Explorer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {isLoading ? "Loading funds…" : `Showing ${allFunds.length} of ${total.toLocaleString()} funds`}
          </Typography>
        </Box>
        <SyncFunds />
      </Box>

      <TextField
        placeholder="Search funds by name…"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: { sm: 460 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '50%' }}>Name</TableCell>
                  <TableCell align="right">NAV</TableCell>
                  <TableCell align="right">1Y</TableCell>
                  <TableCell align="right">3Y</TableCell>
                  <TableCell align="right">CAGR (Inception)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFunds.length > 0 ? (
                  filteredFunds.map((fund) => (
                    <FundListItem fund={fund} key={fund.schemeCode} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary" sx={{ p: 6 }}>
                        No funds to display.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {totalPages > 1 && !search && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" />
        </Box>
      )}
    </Container>
  );
}

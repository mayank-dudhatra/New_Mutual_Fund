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
  Chip,
  Stack,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FundListItem from "@/components/FundListItem";
import { useFunds } from "@/hooks/useFunds";
import { FUND_CATEGORIES, getFundCategory, FundCategory } from "@/lib/fundCategory";

export default function FundsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FundCategory | "All">("All");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFunds(page);

  const allFunds = useMemo(() => data?.funds ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 50);
  const latestNavDate = useMemo(() => allFunds[0]?.navDate, [allFunds]);

  const filteredFunds = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allFunds.filter((fund) => {
      const matchesSearch =
        !query || fund.schemeName.toLowerCase().includes(query);
      const matchesCategory =
        category === "All" || getFundCategory(fund.schemeName) === category;
      return matchesSearch && matchesCategory;
    });
  }, [allFunds, search, category]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            {isLoading ? "Loading funds…" : `Showing ${filteredFunds.length} of ${total.toLocaleString()} active funds`}
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ px: 2, py: 1, borderRadius: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box sx={{ width: 9, height: 9, borderRadius: 99, bgcolor: "success.main", boxShadow: "0 0 8px #16A34A", animation: "pulse 1.6s ease-in-out infinite" }} />
          <Box>
            <Typography variant="caption" fontWeight={800} sx={{ color: "success.main", display: "block", lineHeight: 1.2 }}>
              LIVE NAV
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              {latestNavDate ? `as of ${latestNavDate}` : "from AMFI"}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3, alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <TextField
          placeholder="Search funds by name…"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: { sm: 460 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
          <FilterListIcon sx={{ color: "text.secondary", mr: 0.5 }} />
          <Chip
            label="All"
            size="small"
            color={category === "All" ? "primary" : "default"}
            variant={category === "All" ? "filled" : "outlined"}
            onClick={() => setCategory("All")}
          />
          {FUND_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              size="small"
              color={category === cat ? "primary" : "default"}
              variant={category === cat ? "filled" : "outlined"}
              onClick={() => setCategory(cat)}
            />
          ))}
        </Box>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer sx={{ width: "100%" }}>
            <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right" sx={{ width: 110 }}>NAV</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>1D</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>1M</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>6M</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>1Y</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>3Y</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>CAGR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFunds.length > 0 ? (
                  filteredFunds.map((fund) => (
                    <FundListItem fund={fund} key={fund.schemeCode} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ p: 6, textAlign: "center" }}>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                          No funds match your filters.
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSearch("");
                            setCategory("All");
                          }}
                        >
                          Clear filters
                        </Button>
                      </Box>
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

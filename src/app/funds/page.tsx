// app/funds/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Pagination,
  Paper,
  Box,
} from "@mui/material";
import FundCard from "@/components/FundCard";
import { Scheme } from "@/types/scheme";

export default function FundsPage() {
  const [funds, setFunds] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 50;

  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      try {
        const res = await fetch(`/api/mf?page=${page}&limit=${limit}`);
        const data = await res.json();
        setFunds(data.funds || []);
        setTotalPages(Math.ceil((data.total || 0) / limit));
      } catch (error) {
        console.error("Error fetching funds:", error);
        setFunds([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchFunds();
  }, [page]);

  const filteredFunds = funds.filter((fund) =>
    fund.schemeName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Mutual Fund Explorer
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Funds"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4, maxWidth: 600 }}
        slotProps={{
          input: {
            sx: { py: 1.2 },
          },
        }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          <CircularProgress size={40} />
        </Box>
      ) : filteredFunds.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "grey.50",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {search
              ? "No funds match your search."
              : "No funds available at the moment."}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredFunds.map((fund) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fund.schemeCode}>
                <FundCard fund={fund} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </>
      )}
    </Container>
  );
}
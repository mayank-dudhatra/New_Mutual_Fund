// src/components/MoversList.tsx
// Ranked list of funds (gainers/losers) used on the home dashboard.
"use client";

import { Paper, Typography, Box, Divider, useTheme, alpha, Skeleton } from "@mui/material";
import Link from "next/link";
import ReturnBadge from "./ReturnBadge";

export interface MoverItem {
  schemeCode: number;
  schemeName: string;
  nav?: number | null;
  dayChange?: number | null;
  oneMonth?: number | null;
  threeMonths?: number | null;
  oneYear?: number | null;
}

interface MoversListProps {
  title: string;
  items: MoverItem[];
  period?: "day" | "multi";
  loading?: boolean;
  emptyText?: string;
  accent?: "success" | "error" | "primary";
}

export default function MoversList({
  title,
  items,
  period = "day",
  loading = false,
  emptyText = "No funds to show yet.",
  accent = "primary",
}: MoversListProps) {
  const theme = useTheme();
  const accentColor = theme.palette[accent].main;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(accentColor, 0.06),
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(accentColor, 0.12),
            color: accentColor,
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          {items.length}
        </Box>
      </Box>

      <Box>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ px: 2.5, py: 1.5 }}>
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            ))
          : items.length === 0
          ? (
              <Typography color="text.secondary" sx={{ p: 3, fontSize: "0.875rem", textAlign: "center" }}>
                {emptyText}
              </Typography>
            )
          : items.map((item, idx) => (
              <Box key={item.schemeCode}>
                {idx > 0 && <Divider />}
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.75,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:hover": { bgcolor: "rgba(108, 99, 255, 0.05)" },
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={idx < 3 ? accentColor : "text.secondary"}
                    sx={{ width: 20, fontVariantNumeric: "tabular-nums" }}
                  >
                    {idx + 1}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/scheme/${item.schemeCode}`} style={{ textDecoration: "none" }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {item.schemeName}
                      </Typography>
                    </Link>
                    {item.nav != null && (
                      <Typography variant="caption" color="text.secondary">
                        NAV {item.nav.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                  {period === "day" ? (
                    <ReturnBadge value={item.dayChange} />
                  ) : (
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <ReturnBadge value={item.oneMonth} />
                      <ReturnBadge value={item.threeMonths} />
                      <ReturnBadge value={item.oneYear} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
      </Box>
    </Paper>
  );
}

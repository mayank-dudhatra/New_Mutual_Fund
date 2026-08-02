// src/components/StatCard.tsx
// Compact market-style stat card: label + big value + optional delta.
"use client";

import { Box, Paper, Typography, useTheme, alpha } from "@mui/material";
import ReturnBadge from "./ReturnBadge";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number | null;
  deltaLabel?: string;
  icon?: React.ReactNode;
  valueColor?: string;
}

export default function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon,
  valueColor,
}: StatCardProps) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1.5,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {icon && (
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
      <Typography
        variant="h5"
        component="div"
        fontWeight={700}
        sx={{ color: valueColor ?? "text.primary", fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Typography>
      {(delta != null || deltaLabel) && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {delta != null && <ReturnBadge value={delta} />}
          {deltaLabel && (
            <Typography variant="caption" color="text.secondary">
              {deltaLabel}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}

// src/components/ReturnBadge.tsx
// Colored percentage with up/down arrow (market green/red).
"use client";

import { Box, Typography, useTheme, TypographyProps } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";

interface ReturnBadgeProps {
  value?: number | null;
  decimals?: number;
  showIcon?: boolean;
  variant?: TypographyProps["variant"];
  fontWeight?: number;
  suffix?: string;
}

export default function ReturnBadge({
  value,
  decimals = 2,
  showIcon = true,
  variant = "inherit",
  fontWeight = 600,
  suffix = "%",
}: ReturnBadgeProps) {
  const theme = useTheme();

  if (value == null || isNaN(value)) {
    return (
      <Typography variant={variant} color="text.secondary" component="span">
        —
      </Typography>
    );
  }

  const isUp = value > 0;
  const isDown = value < 0;
  const color = isDown ? theme.palette.error.main : theme.palette.success.main;
  const Icon = isUp ? TrendingUpIcon : isDown ? TrendingDownIcon : RemoveIcon;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        color,
        fontWeight,
      }}
    >
      {showIcon && <Icon sx={{ fontSize: "1.05em" }} />}
      <Typography
        component="span"
        variant={variant}
        fontWeight={fontWeight}
        color="inherit"
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value > 0 ? "+" : ""}
        {value.toFixed(decimals)}
        {suffix}
      </Typography>
    </Box>
  );
}

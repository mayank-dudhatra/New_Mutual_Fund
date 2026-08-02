// src/components/TickerTape.tsx
// Scrolling market ticker of fund names + colored 1D change.
"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import Link from "next/link";
import ReturnBadge from "./ReturnBadge";

export interface TickerItem {
  schemeCode: number;
  schemeName: string;
  dayChange: number | null;
  nav?: number | null;
}

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export default function TickerTape({ items }: { items: TickerItem[] }) {
  const theme = useTheme();

  if (items.length === 0) return null;

  const list = [...items, ...items]; // duplicate for seamless loop

  return (
    <Box
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        py: 1.25,
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          px: 3,
          animation: `${scroll} 45s linear infinite`,
          "&:hover": { animationPlayState: "paused" },
        }}
      >
        {list.map((item, i) => (
          <Link
            key={`${item.schemeCode}-${i}`}
            href={`/scheme/${item.schemeCode}`}
            style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Typography
              component="span"
              variant="body2"
              fontWeight={600}
              sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", verticalAlign: "middle" }}
            >
              {item.schemeName}
            </Typography>
            {item.nav != null && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.nav.toFixed(2)}
              </Typography>
            )}
            <ReturnBadge value={item.dayChange} variant="body2" />
          </Link>
        ))}
      </Box>
    </Box>
  );
}

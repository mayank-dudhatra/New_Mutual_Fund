// src/components/FundListItem.tsx
"use client";

import { useMemo } from "react";
import {
  Typography,
  Box,
  useTheme,
  alpha,
  Avatar,
  TableRow,
  TableCell,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import { Scheme } from "@/types/scheme";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useSchemeDetails } from "@/hooks/useSchemeDetails";
import ReturnBadge from "./ReturnBadge";
import { getFundCategory } from "@/lib/fundCategory";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const CATEGORY_COLORS: Record<string, string> = {
  Equity: "#6C63FF",
  Debt: "#3B82F6",
  Hybrid: "#F59E0B",
  Index: "#8B5CF6",
};

export default function FundListItem({ fund }: { fund: Scheme }) {
  const theme = useTheme();
  const { data, isLoading: loading } = useSchemeDetails(fund.schemeCode);
  const navHistory = data?.navHistory;

  const details = useMemo(() => {
    if (!navHistory || navHistory.length <= 1) return null;

    const sortedHistory = navHistory
      .map((d) => ({
        nav: d.nav,
        parsedDate: dayjs(d.date, "DD-MM-YYYY"),
      }))
      .sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    const latestEntry = sortedHistory[sortedHistory.length - 1];
    const previousEntry = sortedHistory[sortedHistory.length - 2];
    const latestNav = latestEntry.nav;
    const latestDate = latestEntry.parsedDate;

    const changeOver = (amount: number, unit: "day" | "month" | "year") => {
      const targetDate = latestDate.subtract(amount, unit);
      const startEntry = sortedHistory.find((entry) =>
        entry.parsedDate.isSameOrAfter(targetDate)
      );
      if (!startEntry || startEntry.parsedDate.isSame(latestDate, "day")) return null;
      return ((latestNav - startEntry.nav) / startEntry.nav) * 100;
    };

    const inceptionDate = sortedHistory[0].parsedDate;
    const yearsSinceInception = latestDate.diff(inceptionDate, 'year', true);

    return {
      latestNav,
      oneDay:
        previousEntry.nav > 0 ? ((latestNav - previousEntry.nav) / previousEntry.nav) * 100 : null,
      oneMonth: changeOver(1, "month"),
      sixMonths: changeOver(6, "month"),
      oneYear: changeOver(1, "year"),
      threeYears: changeOver(3, "year"),
      cagr: yearsSinceInception > 0 ? (Math.pow(latestNav / sortedHistory[0].nav, 1 / yearsSinceInception) - 1) * 100 : null,
    };
  }, [navHistory]);

  const category = getFundCategory(fund.schemeName);
  const categoryColor = CATEGORY_COLORS[category] ?? theme.palette.grey[600];

  const cells = [
    <TableCell key="nav" align="right">
      <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: "tabular-nums" }}>
        {details?.latestNav ? `₹${details.latestNav.toFixed(2)}` : 'N/A'}
      </Typography>
    </TableCell>,
    <TableCell key="1d" align="right"><ReturnBadge value={details?.oneDay} /></TableCell>,
    <TableCell key="1m" align="right"><ReturnBadge value={details?.oneMonth} /></TableCell>,
    <TableCell key="6m" align="right"><ReturnBadge value={details?.sixMonths} /></TableCell>,
    <TableCell key="1y" align="right"><ReturnBadge value={details?.oneYear} /></TableCell>,
    <TableCell key="3y" align="right"><ReturnBadge value={details?.threeYears} /></TableCell>,
    <TableCell key="cagr" align="right"><ReturnBadge value={details?.cagr} /></TableCell>,
  ];

  return (
    <TableRow
      hover
      sx={{
        "& > td": { borderBottom: `1px solid ${theme.palette.divider}` },
        "&:last-child > td": { borderBottom: 0 },
        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
      }}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(categoryColor, 0.12),
              color: categoryColor,
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {fund.schemeName.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Link href={`/scheme/${fund.schemeCode}`} passHref style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {fund.schemeName}
              </Typography>
            </Link>
            <Typography variant="caption" color={categoryColor} sx={{ fontWeight: 600 }}>
              {category}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {loading
        ? Array.from({ length: 7 }).map((_, i) => (
            <TableCell key={i} align="right"><Skeleton variant="text" width={48} /></TableCell>
          ))
        : cells}
    </TableRow>
  );
}

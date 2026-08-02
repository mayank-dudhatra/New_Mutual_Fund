// src/components/WatchlistRow.tsx
"use client";

import { useMemo } from 'react';
import { TableRow, TableCell, Typography, Skeleton, useTheme, IconButton, Box, alpha, Avatar } from '@mui/material';
import Link from 'next/link';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import DeleteIcon from '@mui/icons-material/Delete';
import { WatchlistItem } from '@/models/Watchlist';
import { useSchemeDetails } from '@/hooks/useSchemeDetails';
import { useQueryClient } from '@tanstack/react-query';
import { WATCHLIST_KEY } from '@/hooks/useWatchlist';
import ReturnBadge from './ReturnBadge';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export default function WatchlistRow({ item }: { item: WatchlistItem }) {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { data, isLoading: loading } = useSchemeDetails(item.schemeCode);
    const navHistory = data?.navHistory;

    const returns = useMemo(() => {
        if (!navHistory || navHistory.length <= 1) return null;

        const history = navHistory.map((d) => ({
            nav: d.nav,
            date: dayjs(d.date, "DD-MM-YYYY"),
        })).sort((a, b) => b.date.unix() - a.date.unix()); // Sort newest to oldest

        const latestEntry = history[0];

        const calculateChange = (duration: number, unit: 'day' | 'month' | 'year') => {
            const targetDate = latestEntry.date.subtract(duration, unit);
            const startEntry = history.find((entry) => entry.date.isSameOrBefore(targetDate));
            if (!startEntry) return null;
            return ((latestEntry.nav - startEntry.nav) / startEntry.nav) * 100;
        };

        return {
            '1D': ((latestEntry.nav - history[1].nav) / history[1].nav) * 100,
            '1M': calculateChange(1, 'month'),
            '3M': calculateChange(3, 'month'),
            '6M': calculateChange(6, 'month'),
            '1Y': calculateChange(1, 'year'),
        };
    }, [navHistory]);

    const handleRemove = async () => {
        const row = document.getElementById(`watchlist-row-${item.schemeCode}`);
        if (row) row.style.display = 'none';

        await fetch(`/api/watchlist/${item.schemeCode}`, {
            method: 'DELETE',
        });

        queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    };

    return (
        <TableRow id={`watchlist-row-${item.schemeCode}`} hover>
            <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 34,
                            height: 34,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                        }}
                    >
                        {item.schemeName.charAt(0)}
                    </Avatar>
                    <Link href={`/scheme/${item.schemeCode}`} style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                            sx={{ "&:hover": { color: "primary.main" } }}
                        >
                            {item.schemeName}
                        </Typography>
                    </Link>
                </Box>
            </TableCell>
            {loading ? (
                <>
                    {[...Array(6)].map((_, i) => <TableCell key={i} align="right"><Skeleton variant="text" width={50} /></TableCell>)}
                </>
            ) : (
                <>
                    <TableCell align="right"><ReturnBadge value={returns?.['1D']} /></TableCell>
                    <TableCell align="right"><ReturnBadge value={returns?.['1M']} /></TableCell>
                    <TableCell align="right"><ReturnBadge value={returns?.['3M']} /></TableCell>
                    <TableCell align="right"><ReturnBadge value={returns?.['6M']} /></TableCell>
                    <TableCell align="right"><ReturnBadge value={returns?.['1Y']} /></TableCell>
                    <TableCell align="right">
                        <IconButton size="small" onClick={handleRemove} aria-label="Remove from watchlist" sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}

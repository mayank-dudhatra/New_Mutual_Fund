// // src/components/WatchlistRow.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { TableRow, TableCell, Typography, Skeleton, useTheme, IconButton } from '@mui/material';
// import Link from 'next/link';
// import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { WatchlistItem } from '@/models/Watchlist';

// dayjs.extend(customParseFormat);

// const ReturnValue = ({ value }: { value: number | null }) => {
//     const theme = useTheme();
//     if (value === null || isNaN(value)) {
//         return <Typography variant="body2" color="text.secondary">N/A</Typography>;
//     }
//     const color = value > 0 ? theme.palette.success.main : theme.palette.error.main;
//     return <Typography variant="body2" fontWeight={600} sx={{ color }}>{value.toFixed(2)}%</Typography>;
// };

// export default function WatchlistRow({ item }: { item: WatchlistItem }) {
//     const [returns, setReturns] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchReturns() {
//             try {
//                 const res = await fetch(`/api/scheme/${item.schemeCode}`);
//                 const data = await res.json();
//                 const navHistory = data.navHistory;

//                 if (navHistory && navHistory.length > 1) {
//                     const sortedHistory = navHistory.map((d: any) => ({
//                         nav: parseFloat(d.nav),
//                         date: dayjs(d.date, "DD-MM-YYYY"),
//                     })).sort((a: any, b: any) => a.date.unix() - b.date.unix());

//                     const latestEntry = sortedHistory[sortedHistory.length - 1];

//                     const calculateChange = (duration: number, unit: 'day' | 'month') => {
//                         const targetDate = latestEntry.date.subtract(duration, unit);
//                         const startEntry = sortedHistory.find((entry: any) => entry.date.isSameOrAfter(targetDate));
//                         if (!startEntry) return null;
//                         return ((latestEntry.nav - startEntry.nav) / startEntry.nav) * 100;
//                     };

//                     setReturns({
//                         '1D': calculateChange(1, 'day'),
//                         '1M': calculateChange(1, 'month'),
//                         '3M': calculateChange(3, 'month'),
//                         '6M': calculateChange(6, 'month'),
//                         '1Y': calculateChange(1, 'year'),
//                     });
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch returns for watchlist item");
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchReturns();
//     }, [item.schemeCode]);
    
//     const handleRemove = async () => {
//         // Optimistically remove from UI
//         const row = document.getElementById(`watchlist-row-${item.schemeCode}`);
//         if (row) row.style.display = 'none';

//         await fetch(`/api/watchlist/${item.schemeCode}`, {
//             method: 'DELETE',
//         });
//         // Optionally, you can add a toast notification for success
//     };

//     return (
//         <TableRow id={`watchlist-row-${item.schemeCode}`} hover>
//             <TableCell>
//                 <Link href={`/scheme/${item.schemeCode}`} style={{ textDecoration: 'none' }}>
//                     <Typography variant="body2" fontWeight={600} color="primary.main">{item.schemeName}</Typography>
//                 </Link>
//             </TableCell>
//             {loading ? (
//                 <>
//                     {[...Array(6)].map((_, i) => <TableCell key={i} align="right"><Skeleton variant="text" width={50} /></TableCell>)}
//                 </>
//             ) : (
//                 <>
//                     <TableCell align="right"><ReturnValue value={returns?.['1D']} /></TableCell>
//                     <TableCell align="right"><ReturnValue value={returns?.['1M']} /></TableCell>
//                     <TableCell align="right"><ReturnValue value={returns?.['3M']} /></TableCell>
//                     <TableCell align="right"><ReturnValue value={returns?.['6M']} /></TableCell>
//                     <TableCell align="right"><ReturnValue value={returns?.['1Y']} /></TableCell>
//                     <TableCell align="right">
//                         <IconButton size="small" onClick={handleRemove} aria-label="Remove from watchlist">
//                             <DeleteIcon fontSize="small" />
//                         </IconButton>
//                     </TableCell>
//                 </>
//             )}
//         </TableRow>
//     );
// }






// src/components/WatchlistRow.tsx
"use client";

import { useState, useEffect } from 'react';
import { TableRow, TableCell, Typography, Skeleton, useTheme, IconButton } from '@mui/material';
import Link from 'next/link';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // <-- FIX #1: IMPORT THE PLUGIN
import DeleteIcon from '@mui/icons-material/Delete';
import { WatchlistItem } from '@/models/Watchlist';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore); // <-- FIX #2: USE THE PLUGIN

const ReturnValue = ({ value }: { value: number | null }) => {
    const theme = useTheme();
    if (value === null || isNaN(value)) {
        return <Typography variant="body2" color="text.secondary">N/A</Typography>;
    }
    const color = value >= 0 ? theme.palette.success.main : theme.palette.error.main;
    const prefix = value > 0 ? '+' : '';
    return <Typography variant="body2" fontWeight={600} sx={{ color }}>{prefix}{value.toFixed(2)}%</Typography>;
};

export default function WatchlistRow({ item }: { item: WatchlistItem }) {
    const [returns, setReturns] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReturns() {
            setLoading(true);
            try {
                const res = await fetch(`/api/scheme/${item.schemeCode}`);
                const data = await res.json();
                const navHistory = data.navHistory;

                if (navHistory && navHistory.length > 1) {
                    const history = navHistory.map((d: any) => ({
                        nav: parseFloat(d.nav),
                        date: dayjs(d.date, "DD-MM-YYYY"),
                    })).sort((a: any, b: any) => b.date.unix() - a.date.unix()); // Sort newest to oldest

                    const latestEntry = history[0];
                    
                    const calculateChange = (duration: number, unit: 'day' | 'month' | 'year') => {
                        const targetDate = latestEntry.date.subtract(duration, unit);
                        
                        // FIX #3: Find the first entry ON OR BEFORE the target date
                        const startEntry = history.find((entry: any) => entry.date.isSameOrBefore(targetDate));

                        if (!startEntry) return null;

                        return ((latestEntry.nav - startEntry.nav) / startEntry.nav) * 100;
                    };

                    setReturns({
                        '1D': ((latestEntry.nav - history[1].nav) / history[1].nav) * 100,
                        '1M': calculateChange(1, 'month'),
                        '3M': calculateChange(3, 'month'),
                        '6M': calculateChange(6, 'month'),
                        '1Y': calculateChange(1, 'year'),
                    });
                }
            } catch (error) {
                console.error("Failed to fetch returns for watchlist item", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReturns();
    }, [item.schemeCode]);
    
    const handleRemove = async () => {
        const row = document.getElementById(`watchlist-row-${item.schemeCode}`);
        if (row) row.style.display = 'none';

        await fetch(`/api/watchlist/${item.schemeCode}`, {
            method: 'DELETE',
        });
    };

    return (
        <TableRow id={`watchlist-row-${item.schemeCode}`} hover>
            <TableCell>
                <Link href={`/scheme/${item.schemeCode}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" fontWeight={600} color="primary.main">{item.schemeName}</Typography>
                </Link>
            </TableCell>
            {loading ? (
                <>
                    {[...Array(6)].map((_, i) => <TableCell key={i} align="right"><Skeleton variant="text" width={50} /></TableCell>)}
                </>
            ) : (
                <>
                    <TableCell align="right"><ReturnValue value={returns?.['1D']} /></TableCell>
                    <TableCell align="right"><ReturnValue value={returns?.['1M']} /></TableCell>
                    <TableCell align="right"><ReturnValue value={returns?.['3M']} /></TableCell>
                    <TableCell align="right"><ReturnValue value={returns?.['6M']} /></TableCell>
                    <TableCell align="right"><ReturnValue value={returns?.['1Y']} /></TableCell>
                    <TableCell align="right">
                        <IconButton size="small" onClick={handleRemove} aria-label="Remove from watchlist">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}
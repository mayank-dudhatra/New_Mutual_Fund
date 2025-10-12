// src/components/VirtualSipCard.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, useTheme, CardActions, Button, Divider, LinearProgress, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { VirtualSip } from '@/models/VirtualPortfolio';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function VirtualSipCard({ sip, onSipDeleted, onSipUpdated }: { sip: VirtualSip, onSipDeleted: (id: string) => void, onSipUpdated: () => void }) {
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        async function fetchCurrentValue() {
            setLoading(true);
            if (sip.redeemed && typeof sip.redeemedValue === 'number') {
                setCurrentValue(sip.redeemedValue);
                setLoading(false);
                return;
            }
            if (sip.totalUnits === 0) {
                setCurrentValue(0);
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`https://api.mfapi.in/mf/${sip.schemeCode}`);
                const data = await res.json();
                const latestNav = parseFloat(data.data[0].nav);
                setCurrentValue(sip.totalUnits * latestNav);
            } catch (err) {
                console.error("Failed to fetch current value:", err);
                setCurrentValue(null);
            } finally {
                setLoading(false);
            }
        }
        fetchCurrentValue();
    }, [sip]);

    const handleAction = async (action: 'pause' | 'resume' | 'cancel' | 'redeem') => {
        const confirmMessage = {
            pause: "Are you sure you want to pause this SIP?",
            resume: "Are you sure you want to resume this SIP?",
            cancel: "Are you sure you want to permanently stop future installments?",
            redeem: "Are you sure you want to sell/redeem all units for this investment?",
        };
        if (!window.confirm(confirmMessage[action])) return;
        setActionLoading(true);
        try {
            await fetch(`/api/portfolio/${sip._id}/${action}`, { method: 'POST' });
            onSipUpdated();
        } catch (error) {
            console.error(`Failed to ${action} SIP`, error);
        } finally {
            setActionLoading(false);
        }
    };
    
    const handleDelete = async () => {
         if (!window.confirm("Are you sure you want to permanently delete this record? This cannot be undone.")) return;
         await fetch(`/api/portfolio/${sip._id}`, { method: 'DELETE' });
         onSipDeleted(sip._id.toString());
    };

    const gain = currentValue !== null ? currentValue - sip.totalInvested : 0;
    const gainColor = gain >= 0 ? theme.palette.success.main : theme.palette.error.main;
    const returnPercentage = sip.totalInvested > 0 ? (gain / sip.totalInvested) * 100 : 0;
    const progress = sip.durationMonths > 0 ? (sip.completedInstallments / sip.durationMonths) * 100 : 0;
    const statusColors: Record<VirtualSip['status'], 'success' | 'warning' | 'info' | 'error'> = {
        active: 'success',
        paused: 'warning',
        completed: 'info',
        cancelled: 'error'
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: actionLoading ? 0.7 : 1, borderRadius: 3 }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1}}>
                    <Link href={`/scheme/${sip.schemeCode}`} style={{textDecoration: 'none', color: 'inherit'}}>
                        <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 0.5 }}>{sip.schemeName}</Typography>
                    </Link>
                    <Chip label={sip.status} color={statusColors[sip.status]} size="small" sx={{ textTransform: 'capitalize' }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {formatCurrency(sip.sipAmount)} / month since {dayjs(sip.startDate).format('DD MMM YYYY')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Total Units: {sip.totalUnits.toFixed(4)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box> :
                 currentValue !== null ? (
                    <Box>
                         {sip.redeemed ? (
                            <Box textAlign="center">
                                <Typography variant="caption" color="text.secondary">Redeemed On</Typography>
                                <Typography fontWeight={600}>{dayjs(sip.redeemedOn).format('DD MMM YYYY')}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{mt: 1}}>Final Value</Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: gainColor }}>{formatCurrency(sip.redeemedValue || 0)}</Typography>
                            </Box>
                         ) : (
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                                <Box><Typography variant="caption" color="text.secondary">Invested</Typography><Typography fontWeight={600}>{formatCurrency(sip.totalInvested)}</Typography></Box>
                                <Box><Typography variant="caption" color="text.secondary">Current Value</Typography><Typography fontWeight={600}>{formatCurrency(currentValue)}</Typography></Box>
                                <Box><Typography variant="caption" color="text.secondary">Gain/Loss</Typography><Typography fontWeight={600} sx={{ color: gainColor }}>{formatCurrency(gain)}</Typography></Box>
                                <Box><Typography variant="caption" color="text.secondary">Abs. Return</Typography><Typography fontWeight={600} sx={{ color: gainColor }}>{returnPercentage.toFixed(2)}%</Typography></Box>
                            </Box>
                         )}
                        {sip.durationMonths > 0 && !sip.redeemed && (
                            <Box sx={{ mt: 2.5 }}>
                                <Typography variant="caption" color="text.secondary">Progress: {sip.completedInstallments} / {sip.durationMonths} months</Typography>
                                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mt: 0.5 }} />
                            </Box>
                        )}
                    </Box>
                ) : <Typography color="error">Could not load performance data.</Typography>}
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px:2, pb: 1.5 }}>
                <Box>
                    {sip.status === 'active' && <Button size="small" onClick={() => handleAction('pause')} disabled={actionLoading}>Pause</Button>}
                    {sip.status === 'paused' && <Button size="small" onClick={() => handleAction('resume')} disabled={actionLoading}>Resume</Button>}
                    {(sip.status === 'active' || sip.status === 'paused') && <Button size="small" onClick={() => handleAction('cancel')} disabled={actionLoading}>Cancel</Button>}
                    {/* FIX: Show Redeem button for 'cancelled' status as well */}
                    {(sip.status === 'completed' || sip.status === 'cancelled') && !sip.redeemed && sip.totalUnits > 0 && <Button size="small" color="success" onClick={() => handleAction('redeem')} disabled={actionLoading}>Redeem</Button>}
                </Box>
                <Button size="small" color="error" onClick={handleDelete} disabled={actionLoading}>Delete</Button>
            </CardActions>
        </Card>
    );
}
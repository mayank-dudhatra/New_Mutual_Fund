// src/components/PortfolioSipRow.tsx
"use client";

import { useState } from 'react';
import { Typography, Box, Paper, Grid, IconButton, Menu, MenuItem, LinearProgress, Chip, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import dayjs from 'dayjs';
import { VirtualSip } from '@/models/VirtualPortfolio';
import { formatCurrency } from '@/lib/utils';
import ReturnBadge from './ReturnBadge';

export default function PortfolioSipRow({ sip, performance, onSipDeleted, onSipUpdated }: { sip: VirtualSip, performance: any, onSipDeleted: (id: string) => void, onSipUpdated: () => void }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (!performance) {
        return <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 3 }}><Typography>Loading performance...</Typography></Paper>;
    }

    // --- All Calculations (unchanged) ---
    const currentValue = sip.redeemed ? (sip.redeemedValue || 0) : (sip.totalUnits * (performance.currentNav || 0));
    const pnl = currentValue - sip.totalInvested;
    const pnlPercent = sip.totalInvested > 0 ? (pnl / sip.totalInvested) * 100 : 0;
    const dayChangeNav = performance.currentNav && performance.prevNav ? performance.currentNav - performance.prevNav : 0;
    const dayChangeValue = dayChangeNav * sip.totalUnits;
    const dayChangePercent = performance.prevNav > 0 ? (dayChangeNav / performance.prevNav) * 100 : 0;
    const progress = sip.durationMonths > 0 ? (sip.completedInstallments / sip.durationMonths) * 100 : 0;
    const statusColors: Record<VirtualSip['status'], 'success' | 'warning' | 'info' | 'error'> = {
        active: 'success', paused: 'warning', completed: 'info', cancelled: 'error'
    };

    // --- Handlers (unchanged) ---
    const handleAction = async (action: 'pause' | 'resume' | 'cancel' | 'redeem' | 'delete') => {
        setAnchorEl(null);
        let confirmMessage = `Are you sure you want to ${action} this SIP?`;
        if (action === 'delete') confirmMessage = "Are you sure? This action is permanent.";

        if (!window.confirm(confirmMessage)) return;

        if (action === 'delete') {
            await fetch(`/api/portfolio/${sip._id}`, { method: 'DELETE' });
            onSipDeleted(sip._id.toString());
        } else {
            await fetch(`/api/portfolio/${sip._id}/${action}`, { method: 'POST' });
            onSipUpdated();
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 2, borderRadius: 3, transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 8px 24px rgba(15, 23, 42, 0.07)" } }}>
            <Grid container alignItems="center" spacing={1.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Link href={`/scheme/${sip.schemeCode}`} passHref style={{ textDecoration: 'none' }}>
                        <Typography fontWeight={700} color="text.primary" sx={{ '&:hover': { color: 'primary.main' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sip.schemeName}
                        </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary" component="div">
                        Units: {sip.totalUnits.toFixed(4)} • NAV: {formatCurrency(performance.currentNav)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                        Started: {dayjs(sip.startDate).format('DD MMM YYYY')}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 2 }} textAlign={{ xs: 'left', md: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Invested</Typography>
                    <Typography fontWeight={600} sx={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(sip.totalInvested)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }} textAlign={{ xs: 'left', md: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Current Value</Typography>
                    <Typography fontWeight={600} sx={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(currentValue)}</Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 2 }} textAlign={{ xs: 'left', md: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Total P&L</Typography>
                    <Typography fontWeight={600} color={pnl >= 0 ? 'success.main' : 'error.main'} sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(pnl)}
                    </Typography>
                    <ReturnBadge value={pnlPercent} variant="caption" />
                </Grid>
                <Grid size={{ xs: 6, md: 1 }} textAlign={{ xs: 'left', md: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Day Chg.</Typography>
                    <Typography fontWeight={600} color={dayChangeValue >= 0 ? 'success.main' : 'error.main'} sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(dayChangeValue)}
                    </Typography>
                    <ReturnBadge value={dayChangePercent} variant="caption" />
                </Grid>

                <Grid size={{ xs: 12, md: 1 }} textAlign="right">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "space-between", md: "flex-end" }, gap: 1 }}>
                        <Chip label={sip.status} color={statusColors[sip.status]} size="small" sx={{ textTransform: 'capitalize' }} />
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ color: "text.secondary" }}>
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem component={Link} href={`/virtual-portfolio/${sip._id}`} onClick={() => setAnchorEl(null)}>View Details</MenuItem>
                        {sip.status === 'active' && <MenuItem onClick={() => handleAction('pause')}>Pause</MenuItem>}
                        {sip.status === 'paused' && <MenuItem onClick={() => handleAction('resume')}>Resume</MenuItem>}
                        {(sip.status === 'active' || sip.status === 'paused') && <MenuItem onClick={() => handleAction('cancel')}>Cancel SIP</MenuItem>}
                        {(sip.status === 'completed' || sip.status === 'cancelled') && !sip.redeemed && sip.totalUnits > 0 && <MenuItem onClick={() => handleAction('redeem')}>Redeem</MenuItem>}
                        <Divider />
                        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>Delete Record</MenuItem>
                    </Menu>
                </Grid>

                {sip.durationMonths > 0 && !sip.redeemed && (
                    <Grid size={12}>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Progress: {sip.completedInstallments} / {sip.durationMonths} months
                            </Typography>
                            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
}

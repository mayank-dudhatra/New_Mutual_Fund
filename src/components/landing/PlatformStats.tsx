// src/components/landing/PlatformStats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Paper, Skeleton, alpha, useTheme } from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DatabaseIcon from "@mui/icons-material/Storage";
import StarIcon from "@mui/icons-material/Star";
import { useFunds } from "@/hooks/useFunds";
import SectionHeading from "./SectionHeading";

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function AnimatedCounter({
  target,
  start,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  target: number;
  start: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  const display = value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
      {prefix}
      {display}
      {suffix}
    </Typography>
  );
}

export default function PlatformStats() {
  const theme = useTheme();
  const { data, isLoading } = useFunds(1);
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const totalFunds = data?.total ?? 0;

  const stats = [
    {
      icon: SavingsIcon,
      label: "Total Mutual Funds",
      node: isLoading ? <Skeleton width={80} /> : <AnimatedCounter target={totalFunds} start={inView} suffix="+" />,
    },
    {
      icon: CalculateIcon,
      label: "Investment Calculators",
      node: <AnimatedCounter target={6} start={inView} suffix="+" />,
    },
    {
      icon: AccountBalanceWalletIcon,
      label: "Virtual SIP Controls",
      node: <AnimatedCounter target={5} start={inView} suffix="+" />,
    },
    {
      icon: DatabaseIcon,
      label: "Historical NAV Records",
      node: <AnimatedCounter target={2.4} start={inView} decimals={1} suffix="M+" />,
    },
    {
      icon: StarIcon,
      label: "Watchlist Tracking",
      node: <AnimatedCounter target={5000} start={inView} suffix="+" />,
    },
  ];

  return (
    <Box
      component="section"
      id="stats"
      className="anchor-section"
      sx={{
        py: { xs: 5, md: 8 },
        background: "linear-gradient(180deg, #F1EFFE 0%, #F5F7FA 100%)",
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg" ref={ref}>
        <SectionHeading
          eyebrow="Platform Statistics"
          title="A platform built to scale"
          subtitle="Real numbers behind the explorer — funds, calculators and records you can actually use."
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, justifyContent: "center" }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Paper
                key={stat.label}
                variant="outlined"
                sx={{
                  flex: "1 1 180px",
                  maxWidth: 240,
                  minWidth: 180,
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    mx: "auto",
                    mb: 1.5,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  }}
                >
                  <Icon />
                </Box>
                {stat.node}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

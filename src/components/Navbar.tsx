// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  CircularProgress,
  Button,
  ListItemIcon,
  useTheme,
  alpha,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: HomeIcon },
  { label: "Funds", href: "/funds", icon: SearchIcon },
  { label: "Watchlist", href: "/watchlist", icon: StarIcon },
  { label: "Portfolio", href: "/virtual-portfolio", icon: AccountBalanceWalletIcon },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    router.push("/profile");
  };

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ px: { xs: 2, md: 3 }, gap: 1 }}>
        {/* Brand */}
        <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.25 }}>
          <Link href={user ? "/home" : "/"} style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6C63FF 0%, #5549E0 100%)",
                color: "#fff",
              }}
            >
              <CandlestickChartIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box sx={{ lineHeight: 1.1 }}>
              <Typography component="span" fontWeight={800} sx={{ display: "block", fontSize: "1.05rem" }}>
                FundFolio
              </Typography>
              <Typography component="span" variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Mutual Fund Explorer
              </Typography>
            </Box>
          </Link>
        </Typography>

        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : user ? (
          <>
            {/* Nav links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    startIcon={<Icon sx={{ fontSize: 18 }} />}
                    sx={{
                      color: active ? "primary.main" : "text.secondary",
                      bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 1.75,
                      "&:hover": { bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : "action.hover", color: "text.primary" },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Avatar menu */}
            <IconButton onClick={handleMenu} size="small" sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "primary.main",
                  fontSize: "0.95rem",
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1.25 }}>
                <Typography fontWeight={700}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfile}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => router.push("/watchlist")}>
                <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
                Watchlist
              </MenuItem>
              <MenuItem onClick={() => router.push("/virtual-portfolio")}>
                <ListItemIcon><AccountBalanceWalletIcon fontSize="small" /></ListItemIcon>
                Virtual Portfolio
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <ListItemIcon sx={{ color: "error.main" }}><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} href="/login" variant="outlined" size="small">
              Sign In
            </Button>
            <Button component={Link} href="/register" variant="contained" size="small">
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

// src/theme/theme.ts
// Light fintech theme (Groww/Screener style) applied across the whole app.
// Up to the palette/typography/component-level styling only — no logic.
import { createTheme } from "@mui/material/styles";

const BRAND = "#6C63FF";
const BRAND_DARK = "#5549E0";
const GREEN = "#16A34A";
const RED = "#EF4444";
const SURFACE = "#FFFFFF";
const BACKGROUND = "#F5F7FA";
const DIVIDER = "#E6EAF0";
const TEXT_PRIMARY = "#0F172A";
const TEXT_SECONDARY = "#64748B";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: BRAND, light: "#8B83FF", dark: BRAND_DARK, contrastText: "#FFFFFF" },
    secondary: { main: "#8B5CF6", light: "#A78BFA", dark: "#7C3AED", contrastText: "#FFFFFF" },
    success: { main: GREEN, light: "#DCFCE7", dark: "#15803D", contrastText: "#FFFFFF" },
    error: { main: RED, light: "#FEE2E2", dark: "#DC2626", contrastText: "#FFFFFF" },
    warning: { main: "#F59E0B", light: "#FEF3C7", dark: "#D97706", contrastText: "#FFFFFF" },
    info: { main: "#3B82F6", light: "#DBEAFE", dark: "#2563EB", contrastText: "#FFFFFF" },
    background: { default: BACKGROUND, paper: SURFACE },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY, disabled: "#94A3B8" },
    divider: DIVIDER,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
    caption: { fontWeight: 500 },
    allVariants: { fontVariantNumeric: "tabular-nums" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BACKGROUND,
          color: TEXT_PRIMARY,
        },
        "*::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#CBD5E1",
          borderRadius: 8,
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${DIVIDER}`,
        },
        rounded: { borderRadius: 14 },
        elevation1: { boxShadow: "0 2px 10px rgba(15, 23, 42, 0.05)" },
        elevation2: { boxShadow: "0 4px 16px rgba(15, 23, 42, 0.07)" },
        elevation3: { boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" },
        elevation4: { boxShadow: "0 12px 32px rgba(15, 23, 42, 0.1)" },
        outlined: { borderColor: DIVIDER },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(10px)",
          color: TEXT_PRIMARY,
          boxShadow: "none",
          borderBottom: `1px solid ${DIVIDER}`,
          backgroundImage: "none",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: 64 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 18px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)" },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
          boxShadow: "0 6px 16px rgba(108, 99, 255, 0.25)",
          "&:hover": { boxShadow: "0 8px 22px rgba(108, 99, 255, 0.35)" },
        },
        containedSuccess: {
          background: GREEN,
          boxShadow: "0 6px 16px rgba(22, 163, 74, 0.22)",
        },
        outlined: {
          borderColor: DIVIDER,
          "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.04)", borderColor: BRAND },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: SURFACE,
            "& fieldset": { borderColor: DIVIDER },
            "&:hover fieldset": { borderColor: "#CBD5E1" },
            "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 2 },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: "0.72rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: TEXT_SECONDARY,
          backgroundColor: "#FAFBFD",
          borderBottom: `1px solid ${DIVIDER}`,
        },
        root: {
          borderBottom: `1px solid ${DIVIDER}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "rgba(108, 99, 255, 0.05)" },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: { borderRadius: 14 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        sizeSmall: { height: 24 },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "#EEF1F6",
          padding: 3,
          borderRadius: 10,
          "& .MuiToggleButtonGroup-grouped": { borderRadius: 8, border: "none", margin: 0 },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          border: "none",
          color: TEXT_SECONDARY,
          borderRadius: 8,
          padding: "4px 14px",
          "&.Mui-selected": {
            backgroundColor: SURFACE,
            color: BRAND,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
            "&:hover": { backgroundColor: SURFACE },
          },
          "&:hover": { backgroundColor: "transparent", color: TEXT_PRIMARY },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 8, backgroundColor: "#EEF1F6" },
        bar: { borderRadius: 8 },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { textDecoration: "none" },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: "#E9EDF3", borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 12, border: `1px solid ${DIVIDER}`, boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 8, backgroundColor: "#1E293B", fontSize: "0.75rem" },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            fontWeight: 600,
            borderRadius: 8,
            "&.Mui-selected": { backgroundColor: BRAND, color: "#fff" },
          },
        },
      },
    },
  },
});

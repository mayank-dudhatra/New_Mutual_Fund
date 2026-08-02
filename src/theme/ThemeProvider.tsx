// src/theme/ThemeProvider.tsx
// Client wrapper for the MUI theme. The theme object from createTheme
// contains function-valued properties (e.g. theme.breakpoints.up) which
// cannot be serialized across the server/client RSC boundary, so the
// theme must be applied inside a client component.
"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

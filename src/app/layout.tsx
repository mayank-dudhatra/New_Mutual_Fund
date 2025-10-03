import "./globals.css";
import { Inter } from "next/font/google";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mutual Fund Explorer",
  description: "Mutual Fund Explorer with SIP Calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />

        {/* Navigation Panel */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Mutual Fund Explorer
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component={Link} href="/funds">
                Funds
              </Button>

              {/* Example: You can add more routes */}
              <Button color="inherit" component={Link} href="/scheme/118834">
                Sample Scheme
              </Button>

              <Button color="inherit" component={Link} href="/">
                Home
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <main>{children}</main>
      </body>
    </html>
  );
}

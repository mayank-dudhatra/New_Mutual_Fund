// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/context/AuthContext"; // Import the new provider

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
        <AuthProvider> {/* Wrap the application */}
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
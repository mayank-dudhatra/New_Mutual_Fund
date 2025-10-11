// src/components/SyncFunds.tsx
"use client";

import { useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";

export default function SyncFunds() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/sync-funds");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "An unknown error occurred.");
      }
      setMessage(data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleSync}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? "Syncing..." : "Sync Active Funds"}
      </Button>
      {message && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </div>
  );
}
// src/app/profile/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { Container, Typography, Paper, Box, Avatar, Chip, Divider, useTheme, alpha } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";

export default function ProfilePage() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "primary.main",
              fontSize: "2rem",
              border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? <PersonIcon />}
          </Avatar>
          <Typography variant="h5" component="h1" fontWeight={800}>
            {user ? user.name : "Loading user data..."}
          </Typography>
          <Chip label="Member" size="small" sx={{ mt: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 600 }} />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {user ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
                <PersonIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Name</Typography>
                <Typography variant="body1" fontWeight={600}>{user.name}</Typography>
              </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
                <EmailIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1" fontWeight={600}>{user.email}</Typography>
              </Box>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
                <BadgeIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">User ID</Typography>
                <Typography variant="body1" fontWeight={600}>{user.id ?? "—"}</Typography>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Typography>Loading user data...</Typography>
        )}
      </Paper>
    </Container>
  );
}

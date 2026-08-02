// src/components/landing/Technology.tsx
"use client";

import { Box, Container, Paper, Typography, alpha, useTheme, Stack } from "@mui/material";
import WebIcon from "@mui/icons-material/Web";
import BoltIcon from "@mui/icons-material/Bolt";
import StorageIcon from "@mui/icons-material/Storage";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";
import LockIcon from "@mui/icons-material/Lock";
import SyncIcon from "@mui/icons-material/Sync";
import HiveIcon from "@mui/icons-material/Hive";
import SectionHeading from "./SectionHeading";

const TECHNOLOGIES = [
  { label: "Next.js", icon: WebIcon },
  { label: "React", icon: BoltIcon },
  { label: "MongoDB", icon: StorageIcon },
  { label: "TypeScript", icon: CodeIcon },
  { label: "Material UI", icon: PaletteIcon },
  { label: "JWT Authentication", icon: LockIcon },
  { label: "TanStack Query", icon: SyncIcon },
  { label: "Zustand", icon: HiveIcon },
];

export default function Technology() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="technology"
      className="anchor-section"
      sx={{
        py: { xs: 5, md: 8 },
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Technology"
          title="Modern stack, built for speed"
          subtitle="The platform is powered by the same tools used across modern fintech products."
        />

        <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap justifyContent="center">
          {TECHNOLOGIES.map((tech) => {
            const Icon = tech.icon;
            return (
              <Paper
                key={tech.label}
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "background.paper",
                }}
              >
                <Icon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" fontWeight={700}>
                  {tech.label}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}

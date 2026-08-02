// src/components/landing/SectionHeading.tsx
"use client";

import { Box, Typography } from "@mui/material";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Box
      className="anchor-section"
      sx={{
        mb: 5,
        textAlign: align,
        maxWidth: 720,
        mx: centered ? "auto" : 0,
      }}
    >
      {eyebrow && (
        <Typography
          variant="caption"
          fontWeight={800}
          sx={{
            color: "primary.main",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ mt: eyebrow ? 1 : 0, mb: subtitle ? 1 : 0, letterSpacing: "-0.01em" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

// src/components/landing/FaqSection.tsx
"use client";

import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SectionHeading from "./SectionHeading";

const FAQS = [
  {
    q: "Is this a real investment platform?",
    a: "No. FundFolio is an analysis and learning tool. It does not buy or sell mutual funds on your behalf and is not a broker, AMC, or SEBI-registered intermediary.",
  },
  {
    q: "Does this platform invest my money?",
    a: "Never. All investments on the platform are virtual. We do not collect, move, or manage real money, so there is zero financial risk while you explore and practice.",
  },
  {
    q: "Where does the mutual fund data come from?",
    a: "Fund NAVs are sourced from publicly available AMFI data and synced into our database, giving you historical NAV series for thousands of schemes.",
  },
  {
    q: "Is registration required?",
    a: "Browsing funds and public analytics work without an account. Register free to save a watchlist, create a virtual portfolio and keep your history.",
  },
  {
    q: "Can I practice SIP investing?",
    a: "Yes. Create virtual SIPs, then pause, resume, cancel or redeem them — and let backdated SIP processing build an instant historical track record. No real money is involved.",
  },
  {
    q: "Are historical returns available?",
    a: "Yes. Every scheme shows interactive NAV charts, multi-period returns, CAGR, rolling returns and more, all computed from its full NAV history.",
  },
  {
    q: "Is my portfolio private?",
    a: "Your watchlist and virtual portfolio are tied to your account with JWT authentication and are only ever visible to you.",
  },
];

export default function FaqSection() {
  const theme = useTheme();

  return (
    <Box component="section" id="faq" className="anchor-section" sx={{ py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know before creating a free account."
        />

        <Box sx={{ display: "grid", gap: 1.5 }}>
          {FAQS.map((faq, i) => (
            <Accordion
              key={faq.q}
              defaultExpanded={i === 0}
              disableGutters
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2.5,
                "&:before": { display: "none" },
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <HelpOutlineIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {faq.q}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

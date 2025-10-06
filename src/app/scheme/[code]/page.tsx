// // app/scheme/[code]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Divider,
//   Box,
//   Skeleton,
//   useTheme,
// } from "@mui/material";
// import NavChart from "@/components/NavChart";
// import ReturnsTable from "@/components/ReturnsTable";
// import SIPCalculator from "@/components/SIPCalculator";

// export default function SchemeDetailPage() {
//   const { code } = useParams();
//   const [scheme, setScheme] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const theme = useTheme();

//   useEffect(() => {
//     if (code) {
//       setLoading(true);
//       fetch(`/api/scheme/${code}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setScheme(data);
//           setLoading(false);
//         })
//         .catch(() => setLoading(false));
//     }
//   }, [code]);

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Skeleton variant="text" width="60%" height={40} />
//         <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
//         <Divider sx={{ my: 2 }} />
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={8}>
//             <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
//               <CardContent>
//                 <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
//                 <Box sx={{ height: 320, bgcolor: "grey.50", borderRadius: 1 }} />
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
//               <CardContent>
//                 <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
//                 <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12}>
//             <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
//               <CardContent>
//                 <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
//                 <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>
//     );
//   }

//   if (!scheme) {
//     return (
//       <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
//         <Typography variant="h6" color="error">
//           Fund not found
//         </Typography>
//       </Container>
//     );
//   }

//   const { meta, navHistory } = scheme;
//   const oneYearNav = navHistory.slice(0, 365).reverse();

//   return (
//     <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
//       {/* Header */}
//       <Box sx={{ mb: 3 }}>
//         <Typography
//           variant="h4"
//           fontWeight={700}
//           sx={{
//             lineHeight: 1.2,
//             mb: 0.5,
//             wordBreak: "break-word",
//           }}
//         >
//           {meta.schemeName}
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary">
//           {meta.fundHouse} • {meta.category}
//         </Typography>
//       </Box>

//       <Divider sx={{ my: 3, borderColor: "divider" }} />

//       <Grid container spacing={{ xs: 2, md: 3 }}>
//         {/* Main Chart - Full width on mobile, 2/3 on desktop */}
//         <Grid item xs={12} md={8}>
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border: `1px solid ${theme.palette.divider}`,
//               height: "100%",
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" fontWeight={600} gutterBottom>
//                 NAV Performance (1 Year)
//               </Typography>
//               <Box sx={{ height: { xs: 280, sm: 320, md: 340 } }}>
//                 <NavChart data={oneYearNav} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Returns Table - Full width on mobile, 1/3 on desktop */}
//         <Grid item xs={12} md={4}>
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border: `1px solid ${theme.palette.divider}`,
//               height: "100%",
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" fontWeight={600} gutterBottom>
//                 Returns
//               </Typography>
//               <Box sx={{ minHeight: 160 }}>
//                 <ReturnsTable code={meta.schemeCode} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* SIP Calculator - Always full width */}
//         <Grid item xs={12}>
//           <Card
//             elevation={0}
//             sx={{
//               borderRadius: 3,
//               border: `1px solid ${theme.palette.divider}`,
//               mt: { xs: 2, md: 3 },
//             }}
//           >
//             <CardContent>
//               <SIPCalculator code={meta.schemeCode} />
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }


// src/app/scheme/[code]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Skeleton,
  useTheme,
} from "@mui/material";

// Import all the custom components
import InteractiveNavChart from "@/components/InteractiveNavChart";
import ReturnsTable from "@/components/ReturnsTable";
import SIPCalculator from "@/components/SIPCalculator";
import HistoricalReturnsGrid from "@/components/HistoricalReturnsGrid";
import SchemeHeader from "@/components/SchemeHeader";
import LumpSumCalculator from "@/components/LumpSumCalculator"; // 1. Import the new component

export default function SchemeDetailPage() {
  const { code } = useParams();
  const [scheme, setScheme] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (code) {
      setLoading(true);
      fetch(`/api/scheme/${code}`)
        .then((res) => res.json())
        .then((data) => {
          setScheme(data);
          setLoading(false);
        })
        .catch(() => {
            console.error("Failed to fetch scheme details");
            setLoading(false)
        });
    }
  }, [code]);

  if (loading) {
      // Your existing Skeleton/loading component
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}> <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 3 }} /> </Grid>
          <Grid item xs={12} md={4}> <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 3 }} /> </Grid>
          <Grid item xs={12}> <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mt: 3 }} /> </Grid>
          <Grid item xs={12}> <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mt: 3 }} /> </Grid>
        </Grid>
      </Container>
    );
  }

  if (!scheme) {
      // Your existing error component
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error"> Fund not found or failed to load. </Typography>
      </Container>
    );
  }

  const { meta, navHistory } = scheme;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      
      <Box sx={{ mb: 4 }}>
        <SchemeHeader meta={meta} navHistory={navHistory} />
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: "100%" }}>
            <CardContent sx={{ pb: '32px !important' }}>
              <InteractiveNavChart data={navHistory} schemeName={meta.schemeName} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom> Point-to-Point Returns </Typography>
            <ReturnsTable code={String(meta.schemeCode)} />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 2 }}> Historical Monthly Returns </Typography>
          <HistoricalReturnsGrid code={String(meta.schemeCode)} />
        </Grid>
        
        {/* 2. Add the Calculators in a new Grid container */}
        <Grid item container xs={12} spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} lg={6}>
                <SIPCalculator code={String(meta.schemeCode)} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <LumpSumCalculator code={String(meta.schemeCode)} />
            </Grid>
        </Grid>
        
      </Grid>
    </Container>
  );
}
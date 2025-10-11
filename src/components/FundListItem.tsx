// // src/components/FundListItem.tsx
// "use client";

// import {
//   Typography,
//   Box,
//   useTheme,
//   alpha,
//   Avatar,
//   TableRow,
//   TableCell,
// } from "@mui/material";
// import Link from "next/link";
// import { Scheme } from "@/types/scheme";

// // Helper to get a color based on return value
// const getReturnColor = (returnValue: string, theme: any) => {
//   const num = parseFloat(returnValue);
//   if (isNaN(num)) return theme.palette.text.secondary;
//   return num > 0 ? theme.palette.success.main : theme.palette.error.main;
// };

// // A small component for displaying return values
// const ReturnValue = ({ value }: { value: string }) => {
//   const theme = useTheme();
//   const color = getReturnColor(value, theme);
//   return (
//     <Typography variant="body2" fontWeight={600} sx={{ color }}>
//       {value}%
//     </Typography>
//   );
// };

// // The component now renders a TableRow
// export default function FundListItem({ fund }: { fund: Scheme }) {
//   const theme = useTheme();

//   // --- PLACEHOLDER DATA ---
//   const latestNav = (Math.random() * 200 + 20).toFixed(2);
//   const oneYearReturn = (Math.random() * 60 - 10).toFixed(2);
//   const threeYearReturn = (Math.random() * 25 + 5).toFixed(2);
//   const cagr = (parseFloat(threeYearReturn) - 2).toFixed(2);
//   // --- END PLACEHOLDER ---

//   let category = "Equity";
//   const lowerCaseName = fund.schemeName.toLowerCase();
//   if (lowerCaseName.includes("debt") || lowerCaseName.includes("income")) category = "Debt";
//   if (lowerCaseName.includes("hybrid")) category = "Hybrid";
//   if (lowerCaseName.includes("index") || lowerCaseName.includes("nifty")) category = "Index";

//   return (
//     <TableRow
//       hover
//       sx={{
//         "& > td": {
//           borderBottom: `1px solid ${theme.palette.divider}`,
//         },
//         "&:last-child > td": {
//           borderBottom: 0,
//         },
//         "&:hover": {
//           backgroundColor: alpha(theme.palette.primary.main, 0.04),
//         },
//       }}
//     >
//       {/* Name and Category Cell */}
//       <TableCell>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Avatar
//             sx={{
//               bgcolor: alpha(theme.palette.primary.main, 0.1),
//               color: "primary.main",
//               fontWeight: 600,
//               fontSize: '0.875rem',
//             }}
//           >
//             {fund.schemeName.charAt(0)}
//           </Avatar>
//           <Box>
//             <Link href={`/scheme/${fund.schemeCode}`} passHref style={{ textDecoration: 'none' }}>
//               <Typography
//                 variant="body2"
//                 fontWeight={600}
//                 color="text.primary"
//                 sx={{
//                   "&:hover": {
//                     color: "primary.main",
//                     textDecoration: 'underline',
//                   },
//                 }}
//               >
//                 {fund.schemeName}
//               </Typography>
//             </Link>
//             <Typography variant="caption" color="text.secondary">
//               {category}
//             </Typography>
//           </Box>
//         </Box>
//       </TableCell>

//       {/* NAV Cell */}
//       <TableCell align="right">
//         <Typography variant="body2" fontWeight={500}>
//           ₹{latestNav}
//         </Typography>
//       </TableCell>

//       {/* 1Y Return Cell */}
//       <TableCell align="right">
//         <ReturnValue value={oneYearReturn} />
//       </TableCell>

//       {/* 3Y Return Cell */}
//       <TableCell align="right">
//         <ReturnValue value={threeYearReturn} />
//       </TableCell>

//       {/* CAGR Cell */}
//       <TableCell align="right">
//         <ReturnValue value={cagr} />
//       </TableCell>
//     </TableRow>
//   );
// }




// src/components/FundListItem.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  useTheme,
  alpha,
  Avatar,
  TableRow,
  TableCell,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import { Scheme } from "@/types/scheme";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);


// Helper to get a color based on return value
const getReturnColor = (returnValue: number | null, theme: any) => {
  if (returnValue === null || isNaN(returnValue)) return theme.palette.text.secondary;
  return returnValue > 0 ? theme.palette.success.main : theme.palette.error.main;
};

// A small component for displaying return values
const ReturnValue = ({ value }: { value: number | null }) => {
  const theme = useTheme();
  const color = getReturnColor(value, theme);

  if (value === null || isNaN(value)) {
    return (
      <Typography variant="body2" color="text.secondary">
        N/A
      </Typography>
    );
  }

  return (
    <Typography variant="body2" fontWeight={600} sx={{ color }}>
      {value.toFixed(2)}%
    </Typography>
  );
};

export default function FundListItem({ fund }: { fund: Scheme }) {
  const theme = useTheme();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/scheme/${fund.schemeCode}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        const navHistory = data.navHistory;

        if (navHistory && navHistory.length > 1) {
          const sortedHistory = navHistory
            .map((d: any) => ({
              nav: parseFloat(d.nav),
              parsedDate: dayjs(d.date, "DD-MM-YYYY"),
            }))
            .sort((a: any, b: any) => a.parsedDate.unix() - b.parsedDate.unix());

          const latestEntry = sortedHistory[sortedHistory.length - 1];
          const latestNav = latestEntry.nav;
          const latestDate = latestEntry.parsedDate;

          const calculateReturn = (years: number) => {
            const targetDate = latestDate.subtract(years, 'year');
            const startEntry = sortedHistory.find((entry: any) =>
              entry.parsedDate.isSameOrAfter(targetDate)
            );

            if (!startEntry || startEntry.parsedDate.isSame(latestDate, 'day')) return null;

            const yearsDiff = latestDate.diff(startEntry.parsedDate, 'year', true);
            if (yearsDiff <= 0) return null;

            // CAGR formula for annualized return
            return (Math.pow(latestNav / startEntry.nav, 1 / yearsDiff) - 1) * 100;
          };

          const inceptionDate = sortedHistory[0].parsedDate;
          const yearsSinceInception = latestDate.diff(inceptionDate, 'year', true);

          setDetails({
            latestNav: latestNav,
            oneYearReturn: calculateReturn(1),
            threeYearReturn: calculateReturn(3),
            cagr: yearsSinceInception > 0 ? (Math.pow(latestNav / sortedHistory[0].nav, 1 / yearsSinceInception) - 1) * 100 : null,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch details for ${fund.schemeCode}`, error);
        setDetails(null); // Ensure details are null on error
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [fund.schemeCode]);

  let category = "Equity";
  const lowerCaseName = fund.schemeName.toLowerCase();
  if (lowerCaseName.includes("debt") || lowerCaseName.includes("income")) category = "Debt";
  if (lowerCaseName.includes("hybrid")) category = "Hybrid";
  if (lowerCaseName.includes("index") || lowerCaseName.includes("nifty")) category = "Index";

  return (
    <TableRow
      hover
      sx={{
        "& > td": { borderBottom: `1px solid ${theme.palette.divider}` },
        "&:last-child > td": { borderBottom: 0 },
        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
      }}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 600, fontSize: '0.875rem' }}>
            {fund.schemeName.charAt(0)}
          </Avatar>
          <Box>
            <Link href={`/scheme/${fund.schemeCode}`} passHref style={{ textDecoration: 'none' }}>
              <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ "&:hover": { color: "primary.main", textDecoration: 'underline' } }}>
                {fund.schemeName}
              </Typography>
            </Link>
            <Typography variant="caption" color="text.secondary">
              {category}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {loading ? (
        <>
          <TableCell align="right"><Skeleton variant="text" width={50} /></TableCell>
          <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
          <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
          <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
        </>
      ) : (
        <>
          <TableCell align="right">
            <Typography variant="body2" fontWeight={500}>
              {details?.latestNav ? `₹${details.latestNav.toFixed(2)}` : 'N/A'}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <ReturnValue value={details?.oneYearReturn} />
          </TableCell>
          <TableCell align="right">
            <ReturnValue value={details?.threeYearReturn} />
          </TableCell>
          <TableCell align="right">
            <ReturnValue value={details?.cagr} />
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
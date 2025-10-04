// import { NextResponse } from "next/server";
// import { 
//     parseISO, 
//     differenceInDays, 
//     addMonths, 
//     isAfter, 
//     isBefore, 
//     format 
// } from "date-fns";

// // The 'calculateSIP' logic is implemented here for demonstration and accuracy, 
// // replacing the external dependency.

// interface NavData {
//     date: string;
//     nav: number;
//     parsedDate?: Date;
// }

// /**
//  * Calculates the SIP returns and generates growth data over time.
//  * NOTE: Assumes navHistory is ordered LATEST to OLDEST (as returned by MF API).
//  */
// function calculateSIP(
//     navHistory: NavData[], 
//     amount: number, 
//     frequency: string, // Currently only 'monthly' is supported
//     from: string, 
//     to: string
// ) {
//     // 1. Prepare NAV history (normalize dates and order OLDEST to LATEST)
//     const processedHistory = navHistory
//         .map(d => ({
//             ...d,
//             parsedDate: parseISO(d.date)
//         }))
//         .reverse(); // Now ordered OLDEST to LATEST

//     if (processedHistory.length === 0) {
//         return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
//     }

//     // 2. Set investment parameters
//     const startMonth = parseISO(from);
//     const endMonth = parseISO(to);
    
//     let totalInvested = 0;
//     let totalUnits = 0;
//     const growthOverTime = [];
    
//     let currentDate = startMonth;
//     const latestAvailableNav = processedHistory[processedHistory.length - 1].nav;

//     // 3. Loop through months from start to end
//     while (isBefore(currentDate, endMonth) || currentDate.toDateString() === endMonth.toDateString()) {
//         const targetDateStr = format(currentDate, 'yyyy-MM-dd');
        
//         // Find the NAV on or immediately *after* the investment date (to simulate real purchase)
//         const navEntry = processedHistory.find(d => d.parsedDate && (d.date === targetDateStr || isAfter(d.parsedDate, parseISO(targetDateStr))));

//         if (navEntry) {
//             const nav = navEntry.nav;
//             const unitsBought = amount / nav;
            
//             totalUnits += unitsBought;
//             totalInvested += amount;
//         } else {
//             // If no NAV is found on or after the target date, skip this installment.
//             // This usually happens if the target date is beyond the history available.
//         }
        
//         // Calculate current value for the graph using the LATEST NAV for valuation
//         let currentValue = totalUnits * latestAvailableNav;

//         growthOverTime.push({
//             date: format(currentDate, 'yyyy-MM-dd'),
//             value: Math.round(currentValue),
//         });

//         // Move to the next month
//         currentDate = addMonths(currentDate, 1);
        
//         // Prevent infinite loops if dates are bad
//         if (growthOverTime.length > 500) break; 
//     }

//     // 4. Final Calculation
//     const finalValue = totalUnits * latestAvailableNav;
//     const finalInvested = totalInvested;

//     let absoluteReturn = 0;
//     let annualizedReturn = 0;

//     if (finalInvested > 0) {
//         absoluteReturn = (finalValue - finalInvested) / finalInvested;

//         // Annualized return (CAGR) calculation
//         const days = differenceInDays(endMonth, startMonth);
//         if (days >= 365) {
//             // XIRR approximation for SIP: (Final Value / Total Invested)^(365 / Days) - 1
//             annualizedReturn = (Math.pow(finalValue / finalInvested, 365 / days) - 1) * 100;
//         } else {
//             // Use Simple Return for periods less than a year
//             annualizedReturn = absoluteReturn * 100;
//         }
//     }
    
//     return {
//         totalInvested: finalInvested,
//         currentValue: finalValue,
//         totalUnits: totalUnits,
//         absoluteReturn: absoluteReturn,
//         annualizedReturn: annualizedReturn,
//         growthOverTime: growthOverTime,
//     };
// }


// export async function POST(req: Request) {
//     try {
//         // 1. Parse request body
//         const { amount, frequency, from, to } = await req.json();

//         // 2. Extract scheme code
//         const codeMatch = req.url.match(/\/scheme\/(\d+)\/sip/);
//         const code = codeMatch ? codeMatch[1] : null;

//         if (!code) {
//             return NextResponse.json(
//                 { error: "Missing scheme code" },
//                 { status: 400 }
//             );
//         }

//         // 3. Fetch NAV history
//         // NOTE: Keeping the MF API URL as provided in your original context.
//         const res = await fetch(`https://api.mfapi.in/mf/${code}`);
//         if (!res.ok) {
//             return NextResponse.json(
//                 { error: "Failed to fetch scheme data" },
//                 { status: 500 }
//             );
//         }

//         const data = await res.json();

//         if (!data.data || data.data.length === 0) {
//             return NextResponse.json(
//                 { error: "NAV history not found" },
//                 { status: 404 }
//             );
//         }

//         const navHistory: NavData[] = data.data.map((entry: any) => ({
//             date: entry.date,
//             nav: parseFloat(entry.nav),
//         }));

//         // 4. Calculate SIP results
//         const result = calculateSIP(navHistory, amount, frequency, from, to);

//         // 5. Return structured response
//         return NextResponse.json({
//             totalInvested: result.totalInvested || 0,
//             currentValue: result.currentValue || 0,
//             totalUnits: result.totalUnits || 0,
//             absoluteReturn: result.absoluteReturn || 0,
//             annualizedReturn: result.annualizedReturn || 0,
//             growthOverTime: result.growthOverTime || [],
//         });
//     } catch (error) {
//         console.error("Error in SIP calculation:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

// src/app/api/scheme/[code]/sip/route.ts
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

// --- TYPE DEFINITIONS ---
interface NavData {
    date: string;
    nav: number;
    parsedDate: dayjs.Dayjs;
}

// --- XIRR CALCULATION (Industry Standard for SIPs) ---
// This function finds the rate of return that makes the net present value of all cash flows equal to zero.
function calculateXIRR(investments: { amount: number, date: dayjs.Dayjs }[], finalValue: number, finalDate: dayjs.Dayjs): number {
    const cashflows = investments.map(i => ({ amount: -i.amount, date: i.date }));
    cashflows.push({ amount: finalValue, date: finalDate });

    // Newton-Raphson method for finding the root (XIRR)
    let guess = 0.1; // Initial guess for the rate
    const maxIterations = 100;
    const tolerance = 1e-7;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;
        const firstDate = cashflows[0].date;

        for (const cf of cashflows) {
            const days = cf.date.diff(firstDate, 'day');
            const exponent = days / 365.0;
            npv += cf.amount / Math.pow(1 + guess, exponent);
            derivative += -exponent * cf.amount / Math.pow(1 + guess, exponent + 1);
        }

        if (Math.abs(npv) < tolerance) {
            return guess;
        }

        if (derivative === 0) {
            break; // Avoid division by zero
        }
        
        guess = guess - npv / derivative;
    }
    
    // Fallback if the calculation doesn't converge
    return 0;
}

/**
 * Calculates accurate SIP returns using real-world logic.
 */
function calculateProfessionalSIP(
    navHistory: NavData[], 
    amount: number, 
    from: string, 
    to: string
) {
    const processedHistory = navHistory.sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    if (processedHistory.length < 1) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
    }

    const startDate = dayjs(from);
    const endDate = dayjs(to);
    
    let totalInvested = 0;
    let totalUnits = 0;
    const growthOverTime: { date: string, value: number }[] = [];
    const investments: { amount: number, date: dayjs.Dayjs }[] = [];
    
    const latestAvailableNav = processedHistory[processedHistory.length - 1].nav;
    const latestNavDate = processedHistory[processedHistory.length - 1].parsedDate;

    let investmentDate = startDate;

    while (investmentDate.isBefore(endDate)) {
        // CORRECTED LOGIC: Find the first NAV on or after the SIP date
        const navEntry = processedHistory.find(d => !d.parsedDate.isBefore(investmentDate, 'day'));

        if (navEntry) {
            totalUnits += amount / navEntry.nav;
            totalInvested += amount;
            investments.push({ amount, date: navEntry.parsedDate });

            // CORRECTED GROWTH CHART: Show value based on the NAV at that point in time
            const currentValueForDate = totalUnits * navEntry.nav;
            growthOverTime.push({
                date: investmentDate.format('YYYY-MM-DD'),
                value: Math.round(currentValueForDate),
            });
        }
        
        investmentDate = investmentDate.add(1, 'month');
    }

    if (totalInvested === 0) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
    }

    const finalValue = totalUnits * latestAvailableNav;
    const absoluteReturn = (finalValue - totalInvested) / totalInvested;
    
    // Calculate accurate annualized return using XIRR
    const annualizedReturn = calculateXIRR(investments, finalValue, latestNavDate);
    
    return {
        totalInvested,
        currentValue: finalValue,
        absoluteReturn,
        annualizedReturn, // This is now XIRR
        growthOverTime,
    };
}


export async function POST(req: Request) {
    try {
        const { amount, from, to } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/sip/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });
        if (!amount || !from || !to) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data from provider." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found for this fund." }, { status: 404 });

        const navHistory: NavData[] = data.data.map((entry: any) => ({
            date: entry.date,
            nav: parseFloat(entry.nav),
            parsedDate: dayjs(entry.date, "DD-MM-YYYY")
        })).filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0);

        const result = calculateProfessionalSIP(navHistory, amount, from, to);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in SIP calculation:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}
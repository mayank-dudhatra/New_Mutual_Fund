import { NextResponse } from "next/server";
import { 
    parseISO, 
    differenceInDays, 
    addMonths, 
    isAfter, 
    isBefore, 
    format 
} from "date-fns";

// The 'calculateSIP' logic is implemented here for demonstration and accuracy, 
// replacing the external dependency.

interface NavData {
    date: string;
    nav: number;
    parsedDate?: Date;
}

/**
 * Calculates the SIP returns and generates growth data over time.
 * NOTE: Assumes navHistory is ordered LATEST to OLDEST (as returned by MF API).
 */
function calculateSIP(
    navHistory: NavData[], 
    amount: number, 
    frequency: string, // Currently only 'monthly' is supported
    from: string, 
    to: string
) {
    // 1. Prepare NAV history (normalize dates and order OLDEST to LATEST)
    const processedHistory = navHistory
        .map(d => ({
            ...d,
            parsedDate: parseISO(d.date)
        }))
        .reverse(); // Now ordered OLDEST to LATEST

    if (processedHistory.length === 0) {
        return { totalInvested: 0, currentValue: 0, absoluteReturn: 0, annualizedReturn: 0, growthOverTime: [] };
    }

    // 2. Set investment parameters
    const startMonth = parseISO(from);
    const endMonth = parseISO(to);
    
    let totalInvested = 0;
    let totalUnits = 0;
    const growthOverTime = [];
    
    let currentDate = startMonth;
    const latestAvailableNav = processedHistory[processedHistory.length - 1].nav;

    // 3. Loop through months from start to end
    while (isBefore(currentDate, endMonth) || currentDate.toDateString() === endMonth.toDateString()) {
        const targetDateStr = format(currentDate, 'yyyy-MM-dd');
        
        // Find the NAV on or immediately *after* the investment date (to simulate real purchase)
        const navEntry = processedHistory.find(d => d.parsedDate && (d.date === targetDateStr || isAfter(d.parsedDate, parseISO(targetDateStr))));

        if (navEntry) {
            const nav = navEntry.nav;
            const unitsBought = amount / nav;
            
            totalUnits += unitsBought;
            totalInvested += amount;
        } else {
            // If no NAV is found on or after the target date, skip this installment.
            // This usually happens if the target date is beyond the history available.
        }
        
        // Calculate current value for the graph using the LATEST NAV for valuation
        let currentValue = totalUnits * latestAvailableNav;

        growthOverTime.push({
            date: format(currentDate, 'yyyy-MM-dd'),
            value: Math.round(currentValue),
        });

        // Move to the next month
        currentDate = addMonths(currentDate, 1);
        
        // Prevent infinite loops if dates are bad
        if (growthOverTime.length > 500) break; 
    }

    // 4. Final Calculation
    const finalValue = totalUnits * latestAvailableNav;
    const finalInvested = totalInvested;

    let absoluteReturn = 0;
    let annualizedReturn = 0;

    if (finalInvested > 0) {
        absoluteReturn = (finalValue - finalInvested) / finalInvested;

        // Annualized return (CAGR) calculation
        const days = differenceInDays(endMonth, startMonth);
        if (days >= 365) {
            // XIRR approximation for SIP: (Final Value / Total Invested)^(365 / Days) - 1
            annualizedReturn = (Math.pow(finalValue / finalInvested, 365 / days) - 1) * 100;
        } else {
            // Use Simple Return for periods less than a year
            annualizedReturn = absoluteReturn * 100;
        }
    }
    
    return {
        totalInvested: finalInvested,
        currentValue: finalValue,
        totalUnits: totalUnits,
        absoluteReturn: absoluteReturn,
        annualizedReturn: annualizedReturn,
        growthOverTime: growthOverTime,
    };
}


export async function POST(req: Request) {
    try {
        // 1. Parse request body
        const { amount, frequency, from, to } = await req.json();

        // 2. Extract scheme code
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/sip/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) {
            return NextResponse.json(
                { error: "Missing scheme code" },
                { status: 400 }
            );
        }

        // 3. Fetch NAV history
        // NOTE: Keeping the MF API URL as provided in your original context.
        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch scheme data" },
                { status: 500 }
            );
        }

        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            return NextResponse.json(
                { error: "NAV history not found" },
                { status: 404 }
            );
        }

        const navHistory: NavData[] = data.data.map((entry: any) => ({
            date: entry.date,
            nav: parseFloat(entry.nav),
        }));

        // 4. Calculate SIP results
        const result = calculateSIP(navHistory, amount, frequency, from, to);

        // 5. Return structured response
        return NextResponse.json({
            totalInvested: result.totalInvested || 0,
            currentValue: result.currentValue || 0,
            totalUnits: result.totalUnits || 0,
            absoluteReturn: result.absoluteReturn || 0,
            annualizedReturn: result.annualizedReturn || 0,
            growthOverTime: result.growthOverTime || [],
        });
    } catch (error) {
        console.error("Error in SIP calculation:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

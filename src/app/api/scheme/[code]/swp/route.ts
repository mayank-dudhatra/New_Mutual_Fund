// src/app/api/scheme/[code]/swp/route.ts
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

interface NavData {
    date: string;
    nav: number;
    parsedDate: dayjs.Dayjs;
}

/**
 * Calculates historical SWP performance against actual NAV data.
 */
function calculateHistoricalSWP(
    navHistory: NavData[],
    initialInvestment: number,
    monthlyWithdrawal: number,
    from: string,
    to: string
) {
    const processedHistory = navHistory.sort((a, b) => a.parsedDate.unix() - b.parsedDate.unix());

    if (processedHistory.length < 1) {
        return { totalInvested: 0, totalWithdrawn: 0, finalValue: 0, growthOverTime: [], corpusRanOut: false };
    }

    const startDate = dayjs(from);
    const endDate = dayjs(to);

    // Find the NAV for the initial investment
    const startNavEntry = processedHistory.find(d => !d.parsedDate.isBefore(startDate, 'day'));
    if (!startNavEntry) {
        // Cannot start the investment if no NAV is found
        return { totalInvested: 0, totalWithdrawn: 0, finalValue: 0, growthOverTime: [], corpusRanOut: false };
    }

    let currentUnits = initialInvestment / startNavEntry.nav;
    let totalWithdrawn = 0;
    const growthOverTime: { date: string, value: number }[] = [];
    
    // Add the starting point to the chart
    growthOverTime.push({ date: startDate.format('YYYY-MM-DD'), value: initialInvestment });

    let withdrawalDate = startDate.add(1, 'month');
    let corpusRanOut = false;

    while (withdrawalDate.isBefore(endDate)) {
        // Find the NAV for the withdrawal date
        const navEntry = processedHistory.find(d => !d.parsedDate.isBefore(withdrawalDate, 'day'));

        if (navEntry) {
            const unitsToSell = monthlyWithdrawal / navEntry.nav;

            if (currentUnits < unitsToSell) {
                // Not enough units to sustain the withdrawal, corpus is depleted
                totalWithdrawn += currentUnits * navEntry.nav; // Withdraw the remaining balance
                currentUnits = 0;
                corpusRanOut = true;
            } else {
                currentUnits -= unitsToSell;
                totalWithdrawn += monthlyWithdrawal;
            }
            
            growthOverTime.push({
                date: withdrawalDate.format('YYYY-MM-DD'),
                value: Math.round(currentUnits * navEntry.nav),
            });
        }
        
        if (corpusRanOut) break;
        withdrawalDate = withdrawalDate.add(1, 'month');
    }

    const latestNav = processedHistory[processedHistory.length - 1].nav;
    const finalValue = currentUnits * latestNav;

    return {
        totalInvested: initialInvestment,
        totalWithdrawn,
        finalValue,
        corpusRanOut,
        growthOverTime,
    };
}

export async function POST(req: Request) {
    try {
        const { initialInvestment, monthlyWithdrawal, from, to } = await req.json();
        const codeMatch = req.url.match(/\/scheme\/(\d+)\/swp/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) return NextResponse.json({ error: "Missing scheme code." }, { status: 400 });

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        if (!res.ok) return NextResponse.json({ error: "Failed to fetch scheme data." }, { status: 502 });

        const data = await res.json();
        if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No NAV history found." }, { status: 404 });

        const navHistory: NavData[] = data.data
            .map((entry: any) => ({
                date: entry.date,
                nav: parseFloat(entry.nav),
                parsedDate: dayjs(entry.date, "DD-MM-YYYY")
            }))
            .filter((d: NavData) => d.parsedDate.isValid() && d.nav > 0);

        const result = calculateHistoricalSWP(navHistory, initialInvestment, monthlyWithdrawal, from, to);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in SWP calculation:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}
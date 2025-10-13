// src/app/api/portfolio/performance/route.ts
import { NextResponse } from "next/server";

// This endpoint accepts a list of scheme codes and returns their latest and previous NAVs.
export async function POST(request: Request) {
  try {
    const { schemeCodes } = await request.json();
    if (!schemeCodes || !Array.isArray(schemeCodes)) {
      return NextResponse.json({ error: "schemeCodes array is required" }, { status: 400 });
    }

    const performanceData: Record<string, { currentNav: number | null; prevNav: number | null }> = {};

    // Fetch data for each scheme code in parallel
    await Promise.all(
      schemeCodes.map(async (code) => {
        try {
          const res = await fetch(`https://api.mfapi.in/mf/${code}`);
          const data = await res.json();
          if (data.data && data.data.length >= 2) {
            performanceData[code] = {
              currentNav: parseFloat(data.data[0].nav),
              prevNav: parseFloat(data.data[1].nav),
            };
          } else {
             performanceData[code] = { currentNav: data.data?.[0]?.nav || null, prevNav: null };
          }
        } catch (e) {
          console.error(`Failed to fetch performance for ${code}`, e);
          performanceData[code] = { currentNav: null, prevNav: null };
        }
      })
    );

    return NextResponse.json(performanceData);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
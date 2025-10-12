// src/app/api/sync-funds/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Scheme } from "@/types/scheme";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mutualfund"); // database name
    const collection = db.collection<Scheme>("funds"); // collection name

    // Fetch all mutual funds
    const response = await fetch("https://api.mfapi.in/mf");
    if (!response.ok) {
      throw new Error("Failed to fetch data from MF API");
    }
    const allFunds = await response.json();

    // **MODIFIED CONDITION:** Filter for funds where either isinGrowth or isinDivReinvestment is not null
    const activeFunds = allFunds.filter(
      (fund: any) => fund.isinGrowth !== null || fund.isinDivReinvestment !== null
    );

    // Optional: Clear the collection before inserting new data
    await collection.deleteMany({});

    // Insert the active funds into the database
    const result = await collection.insertMany(activeFunds);

    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} active funds have been synced to the database.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}


// // src/app/api/sync-funds/route.ts
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { Scheme } from "@/types/scheme";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";

// dayjs.extend(customParseFormat);

// // --- CONFIGURATION ---
// // A fund is considered "active" if its last NAV was updated in the last 7 days.
// const ACTIVE_THRESHOLD_DAYS = 7;

// /**
//  * Checks if a single fund is active by fetching its latest NAV date.
//  * @param fund The scheme to check.
//  * @returns A boolean indicating if the fund is active.
//  */
// async function isFundActive(fund: Scheme): Promise<boolean> {
//   try {
//     const response = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
//     if (!response.ok) {
//       console.warn(`API call failed for fund ${fund.schemeCode}. Skipping.`);
//       return false;
//     }
//     const details = await response.json();
//     const navHistory = details.data;

//     // A fund isn't active if it has no NAV history.
//     if (!navHistory || navHistory.length === 0) {
//       return false;
//     }

//     // The API returns the latest NAV entry at the top of the array (index 0).
//     const latestNavDateStr = navHistory[0]?.date;
//     if (!latestNavDateStr) {
//       return false;
//     }

//     // Correctly parse the date from the API's "DD-MM-YYYY" format.
//     const latestNavDate = dayjs(latestNavDateStr, "DD-MM-YYYY");
//     const today = dayjs(); // Use the current date for comparison.

//     // Check if the latest NAV is within our defined threshold.
//     return today.diff(latestNavDate, 'day') <= ACTIVE_THRESHOLD_DAYS;
//   } catch (error) {
//     console.error(`Error checking fund ${fund.schemeCode}:`, error);
//     return false; // Treat as inactive if there's any error during the check.
//   }
// }

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db("mutual-fund");
//     const collection = db.collection<Scheme>("funds");

//     console.log("Fetching the complete list of funds...");
//     // 1. Fetch the full list of all ~37,000 funds.
//     const initialResponse = await fetch("https://api.mfapi.in/mf");
//     if (!initialResponse.ok) {
//       throw new Error("Failed to fetch the initial fund list from MF API");
//     }
//     const allFunds: any[] = await initialResponse.json();

//     // 2. Perform a quick pre-filter to reduce the number of checks.
//     // This brings the list down from ~37,000 to a more manageable ~8,500.
//     const potentiallyActiveFunds = allFunds.filter(
//       (fund) => fund.isinGrowth !== null || fund.isinDivReinvestment !== null
//     );

//     console.log(`Found ${potentiallyActiveFunds.length} potentially active funds. Verifying NAV dates...`);

//     // 3. Process the smaller list in batches to check for recent NAV updates.
//     const activeFunds: Scheme[] = [];
//     const batchSize = 100; // Process 100 funds in parallel to be efficient but avoid API limits.

//     for (let i = 0; i < potentiallyActiveFunds.length; i += batchSize) {
//       const batch = potentiallyActiveFunds.slice(i, i + batchSize);
      
//       const results = await Promise.all(
//         batch.map(async (fund) => {
//           const isActive = await isFundActive(fund);
//           return isActive ? fund : null;
//         })
//       );

//       const activeInBatch = results.filter((fund): fund is Scheme => fund !== null);
//       activeFunds.push(...activeInBatch);

//       console.log(`Batch ${Math.floor(i / batchSize) + 1} processed. Found ${activeInBatch.length} active funds. Total active so far: ${activeFunds.length}`);
//     }

//     console.log(`Filtering complete. Found ${activeFunds.length} total active funds.`);

//     if (activeFunds.length > 0) {
//       console.log("Clearing existing collection and inserting new active funds...");
//       // 4. Update the database with the new, accurate list.
//       await collection.deleteMany({});
//       const result = await collection.insertMany(activeFunds);
//       console.log("Database sync complete.");

//       return NextResponse.json({
//         success: true,
//         message: `${result.insertedCount} active funds have been synced to the database.`,
//       });
//     } else {
//       return NextResponse.json({
//         success: true,
//         message: "No active funds found to sync.",
//       });
//     }

//   } catch (error: any) {
//     console.error("An error occurred during the sync process:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
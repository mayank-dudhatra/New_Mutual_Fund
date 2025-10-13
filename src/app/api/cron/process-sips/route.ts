// // // src/app/api/cron/process-sips/route.ts
// // import { NextResponse } from "next/server";
// // import clientPromise from "@/lib/mongodb";
// // import { VirtualSip, SipTransaction } from "@/models/VirtualPortfolio";
// // import dayjs from "dayjs";
// // import customParseFormat from "dayjs/plugin/customParseFormat";
// // import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// // dayjs.extend(customParseFormat);
// // dayjs.extend(isSameOrBefore);

// // async function getLatestNav(schemeCode: number): Promise<number | null> {
// //     try {
// //         const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
// //         const data = await res.json();
// //         return parseFloat(data.data[0].nav);
// //     } catch (error) {
// //         console.error(`Failed to fetch NAV for ${schemeCode}`, error);
// //         return null;
// //     }
// // }

// // export async function GET() {
// //     try {
// //         const client = await clientPromise;
// //         const db = client.db("mutualfund");
// //         const portfolioCollection = db.collection<VirtualSip>("virtual_portfolio");
// //         const transactionCollection = db.collection<SipTransaction>("sip_transactions");

// //         const today = dayjs().format('YYYY-MM-DD');

// //         // Find all active SIPs that are due for an installment
// //         const dueSips = await portfolioCollection.find({
// //             status: 'active',
// //             nextSipDate: { $lte: today }
// //         }).toArray();

// //         if (dueSips.length === 0) {
// //             return NextResponse.json({ message: "No SIPs due for processing." });
// //         }

// //         console.log(`Found ${dueSips.length} SIP(s) to process.`);

// //         for (const sip of dueSips) {
// //             const nav = await getLatestNav(sip.schemeCode);
// //             if (nav === null) {
// //                 console.log(`Skipping SIP ${sip._id} due to NAV fetch failure.`);
// //                 continue; // Skip this SIP if we can't get the NAV
// //             }

// //             const units = sip.sipAmount / nav;
            
// //             // 1. Create a transaction record
// //             const newTransaction: Omit<SipTransaction, '_id'> = {
// //                 sipId: sip._id,
// //                 userId: sip.userId,
// //                 schemeCode: sip.schemeCode,
// //                 amount: sip.sipAmount,
// //                 nav,
// //                 units,
// //                 transactionDate: today,
// //             };
// //             await transactionCollection.insertOne(newTransaction as SipTransaction);

// //             // 2. Update the main SIP document
// //             const nextInstallmentDate = dayjs(sip.nextSipDate).add(1, 'month').format('YYYY-MM-DD');
// //             const newCompletedInstallments = sip.completedInstallments + 1;
            
// //             const isCompleted = sip.durationMonths !== 0 && newCompletedInstallments >= sip.durationMonths;

// //             await portfolioCollection.updateOne(
// //                 { _id: sip._id },
// //                 {
// //                     $set: {
// //                         completedInstallments: newCompletedInstallments,
// //                         nextSipDate: nextInstallmentDate,
// //                         status: isCompleted ? 'completed' : 'active',
// //                         totalUnits: sip.totalUnits + units,
// //                         totalInvested: sip.totalInvested + sip.sipAmount,
// //                     }
// //                 }
// //             );
// //             console.log(`Processed installment for SIP ${sip._id}. New status: ${isCompleted ? 'completed' : 'active'}`);
// //         }

// //         return NextResponse.json({ success: true, message: `Processed ${dueSips.length} SIP(s).` });
// //     } catch (error) {
// //         console.error("Cron job error:", error);
// //         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //     }
// // }



// // src/app/api/cron/process-sips/route.ts
// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { VirtualSip, SipTransaction } from "@/models/VirtualPortfolio";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// dayjs.extend(customParseFormat);
// dayjs.extend(isSameOrBefore);

// async function getNavForDate(schemeCode: number, date: string): Promise<number | null> {
//     try {
//         const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
//         const data = await res.json();
//         const navData = data.data;
//         const targetDate = dayjs(date, "YYYY-MM-DD");

//         // Find the NAV for the specific date or the closest one before it
//         const entry = navData.find((d: any) => dayjs(d.date, "DD-MM-YYYY").isSameOrBefore(targetDate));
        
//         return entry ? parseFloat(entry.nav) : null;
//     } catch (error) {
//         console.error(`Failed to fetch NAV for ${schemeCode} on ${date}`, error);
//         return null;
//     }
// }

// export async function GET() {
//     try {
//         const client = await clientPromise;
//         const db = client.db("mutualfund");
//         const portfolioCollection = db.collection<VirtualSip>("virtual_portfolio");
//         const transactionCollection = db.collection<SipTransaction>("sip_transactions");

//         const today = dayjs();

//         const dueSips = await portfolioCollection.find({ status: 'active' }).toArray();

//         if (dueSips.length === 0) {
//             return NextResponse.json({ message: "No active SIPs to process." });
//         }

//         console.log(`Found ${dueSips.length} active SIP(s) to check.`);

//         let processedCount = 0;
//         for (const sip of dueSips) {
//             let { nextSipDate, completedInstallments, totalInvested, totalUnits, status } = sip;
//             let sipDate = dayjs(nextSipDate, "YYYY-MM-DD");
//             let hasChanges = false;

//             // **CRITICAL FIX**: Loop to process all past-due installments for this SIP
//             while (sipDate.isSameOrBefore(today) && status === 'active') {
//                 const nav = await getNavForDate(sip.schemeCode, sipDate.format('YYYY-MM-DD'));
//                 if (nav === null) {
//                     console.log(`Skipping installment for SIP ${sip._id} on ${sipDate.format('YYYY-MM-DD')} due to NAV fetch failure.`);
//                     // Move to the next month to avoid getting stuck
//                     sipDate = sipDate.add(1, 'month');
//                     nextSipDate = sipDate.format('YYYY-MM-DD');
//                     hasChanges = true;
//                     continue;
//                 }
                
//                 hasChanges = true;
//                 const unitsPurchased = sip.sipAmount / nav;

//                 const newTransaction: Omit<SipTransaction, '_id'> = {
//                     sipId: sip._id, userId: sip.userId, schemeCode: sip.schemeCode,
//                     amount: sip.sipAmount, nav, units: unitsPurchased,
//                     transactionDate: sipDate.format('YYYY-MM-DD'),
//                 };
//                 await transactionCollection.insertOne(newTransaction as SipTransaction);

//                 // Update local variables
//                 completedInstallments++;
//                 totalInvested += sip.sipAmount;
//                 totalUnits += unitsPurchased;
//                 sipDate = sipDate.add(1, 'month');
//                 nextSipDate = sipDate.format('YYYY-MM-DD');

//                 // Check if the SIP is now completed
//                 if (sip.durationMonths !== 0 && completedInstallments >= sip.durationMonths) {
//                     status = 'completed';
//                 }
//                 console.log(`Processed installment for SIP ${sip._id} on ${newTransaction.transactionDate}`);
//             }

//             // If any installments were processed, update the database
//             if (hasChanges) {
//                 await portfolioCollection.updateOne(
//                     { _id: sip._id },
//                     {
//                         $set: {
//                             completedInstallments,
//                             nextSipDate,
//                             status,
//                             totalUnits,
//                             totalInvested,
//                         }
//                     }
//                 );
//                 processedCount++;
//             }
//         }

//         return NextResponse.json({ success: true, message: `Checked ${dueSips.length} SIPs. Updated ${processedCount}.` });
//     } catch (error) {
//         console.error("Cron job error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// src/app/api/cron/process-sips/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VirtualSip, SipTransaction } from "@/models/VirtualPortfolio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

async function getNavForDate(schemeCode: number, date: dayjs.Dayjs): Promise<number | null> {
    try {
        const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
        if (!res.ok) return null;
        const data = await res.json();
        
        // Find the closest NAV on or before the target date from the newest-to-oldest sorted API data
        const entry = data.data.find((d: any) => 
            dayjs(d.date, "DD-MM-YYYY").isSameOrBefore(date)
        );
        
        return entry ? parseFloat(entry.nav) : null;
    } catch (error) {
        console.error(`Failed to fetch NAV for ${schemeCode} on ${date.format('YYYY-MM-DD')}`, error);
        return null;
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("mutualfund");
        const portfolioCollection = db.collection<VirtualSip>("virtual_portfolio");
        const transactionCollection = db.collection<SipTransaction>("sip_transactions");

        const today = dayjs();
        const dueSips = await portfolioCollection.find({ status: 'active' }).toArray();

        if (dueSips.length === 0) {
            return NextResponse.json({ message: "No active SIPs to process." });
        }

        let processedCount = 0;
        for (const sip of dueSips) {
            let { nextSipDate, completedInstallments, totalInvested, totalUnits, status } = sip;
            let currentInstallmentDate = dayjs(nextSipDate, "YYYY-MM-DD");
            let hasChanges = false;

            // **CRITICAL FIX**: This loop now processes ALL past-due installments for a SIP at once.
            while (currentInstallmentDate.isSameOrBefore(today) && status === 'active') {
                hasChanges = true;
                const nav = await getNavForDate(sip.schemeCode, currentInstallmentDate);
                
                if (nav === null) {
                    console.log(`Skipping installment for SIP ${sip._id} on ${currentInstallmentDate.format('YYYY-MM-DD')} due to NAV fetch failure.`);
                    // We must advance the date to avoid an infinite loop if an API fails
                    currentInstallmentDate = currentInstallmentDate.add(1, 'month');
                    nextSipDate = currentInstallmentDate.format('YYYY-MM-DD');
                    continue; // Try the next month
                }
                
                const unitsPurchased = sip.sipAmount / nav;

                // Create a record of this transaction
                const newTransaction: Omit<SipTransaction, '_id'> = {
                    sipId: sip._id, userId: sip.userId, schemeCode: sip.schemeCode,
                    amount: sip.sipAmount, nav, units: unitsPurchased,
                    transactionDate: currentInstallmentDate.format('YYYY-MM-DD'),
                };
                await transactionCollection.insertOne(newTransaction as SipTransaction);

                // Update local variables for the loop
                completedInstallments++;
                totalInvested += sip.sipAmount;
                totalUnits += unitsPurchased;
                currentInstallmentDate = currentInstallmentDate.add(1, 'month');
                nextSipDate = currentInstallmentDate.format('YYYY-MM-DD');

                // Check if the SIP has reached its duration
                if (sip.durationMonths !== 0 && completedInstallments >= sip.durationMonths) {
                    status = 'completed';
                }
                 console.log(`Processed installment for SIP ${sip._id} on ${newTransaction.transactionDate}`);
            }

            // If any installments were processed, update the main SIP document in the database
            if (hasChanges) {
                await portfolioCollection.updateOne(
                    { _id: sip._id },
                    { $set: { completedInstallments, nextSipDate, status, totalUnits, totalInvested } }
                );
                processedCount++;
            }
        }

        return NextResponse.json({ success: true, message: `Checked ${dueSips.length} SIPs. Updated ${processedCount}.` });
    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
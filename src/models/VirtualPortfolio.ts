// src/models/VirtualPortfolio.ts
import { ObjectId } from "mongodb";

export interface VirtualSip {
  _id: ObjectId;
  userId: ObjectId;
  schemeCode: number;
  schemeName: string;
  sipAmount: number;
  startDate: string;
  durationMonths: number;
  
  // State tracking fields
  status: 'active' | 'paused' | 'completed' | 'cancelled'; // Added 'paused' and 'cancelled'
  completedInstallments: number;
  nextSipDate: string;

  // Aggregated data for quick display
  totalUnits: number;
  totalInvested: number;

  // New fields for redemption
  redeemed: boolean;
  redeemedOn?: Date;
  redeemedValue?: number;

  createdAt: Date;
}

export interface SipTransaction {
    _id: ObjectId;
    sipId: ObjectId;
    userId: ObjectId;
    schemeCode: number;
    amount: number;
    nav: number;
    units: number;
    transactionDate: string;
}
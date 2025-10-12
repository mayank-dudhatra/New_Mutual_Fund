// src/models/Watchlist.ts
import { ObjectId } from "mongodb";

export interface WatchlistItem {
  _id: ObjectId;
  userId: ObjectId; // Reference to the User's _id
  schemeCode: number;
  schemeName: string;
  createdAt: Date;
}
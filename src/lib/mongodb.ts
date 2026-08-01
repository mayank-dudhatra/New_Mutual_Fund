// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const mongoUri: string = uri;

interface MongoConnection {
  promise: Promise<MongoClient>;
  status: "pending" | "fulfilled" | "rejected";
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoConnection: MongoConnection | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const cached = global._mongoConnection;
  if (cached && cached.status !== "rejected") {
    return cached.promise;
  }

  const client = new MongoClient(mongoUri, {});
  const connection: MongoConnection = { status: "pending", promise: client.connect() };
  connection.promise.then(
    () => { connection.status = "fulfilled"; },
    () => { connection.status = "rejected"; }
  );
  global._mongoConnection = connection;
  return connection.promise;
}

// Thenable export so `await clientPromise` transparently reuses a healthy
// connection and retries on the next request after a transient failure
// instead of caching a rejected promise forever.
const clientPromise = {
  then: (
    onFulfilled?: (value: MongoClient) => unknown,
    onRejected?: (reason?: unknown) => unknown
  ) => getClientPromise().then(onFulfilled, onRejected),
};

export default clientPromise;

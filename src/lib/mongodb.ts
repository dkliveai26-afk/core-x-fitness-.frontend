import { MongoClient, Db } from 'mongodb';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  family: 4, // Force IPv4 to prevent IPv6 DNS resolution stalls in serverless environments
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Retrieves and validates the MongoDB connection URI from environment variables.
 * Checks MONGODB_URI, MONGODB_URL, MONGO_URI, and DATABASE_URL.
 * NEVER defaults to localhost / 127.0.0.1 in production.
 */
function getMongoUri(): string {
  const rawUri =
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (!rawUri || typeof rawUri !== 'string' || rawUri.trim().length === 0) {
    throw new Error(
      'CRITICAL: MongoDB Connection String is missing. Please ensure MONGODB_URI is defined in your Vercel Environment Variables.'
    );
  }

  // Strip accidental wrapping quotes from environment variable managers
  return rawUri.trim().replace(/^["']|["']$/g, '');
}

/**
 * Returns a cached MongoClient promise, reusing connections across serverless invocations.
 * Does NOT eagerly connect on module load.
 */
export function getClientPromise(): Promise<MongoClient> {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  const uri = getMongoUri();
  const client = new MongoClient(uri, options);

  global._mongoClientPromise = client
    .connect()
    .then((connectedClient) => {
      return connectedClient;
    })
    .catch((err) => {
      // Clear global promise on connection failure so subsequent requests can retry
      global._mongoClientPromise = undefined;
      console.error('❌ MongoDB Connection Error:', err.message || err);
      throw err;
    });

  return global._mongoClientPromise;
}

/**
 * Returns the active MongoDB Database instance.
 * Automatically handles connection caching and database selection.
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const clientInstance = await getClientPromise();
  const targetDb = dbName || process.env.MONGODB_DB || undefined;
  return clientInstance.db(targetDb);
}

// Export a proxy/getter for default clientPromise to maintain backward compatibility without eager execution
const lazyClientPromise = {
  then: (onfulfilled?: (value: MongoClient) => any, onrejected?: (reason: any) => any) => {
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch: (onrejected?: (reason: any) => any) => {
    return getClientPromise().catch(onrejected);
  },
};

export default lazyClientPromise as unknown as Promise<MongoClient>;

import { MongoClient, Db } from 'mongodb';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/corexfitness';

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

/**
 * Returns the MongoDB Database instance.
 * Automatically reuses cached connection pool across serverless invocations.
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const clientInstance = await getClientPromise();
  const defaultDb = process.env.MONGODB_DB || 'corexfitness';
  return clientInstance.db(dbName || defaultDb);
}

const clientPromise = getClientPromise();
export default clientPromise;


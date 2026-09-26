import { MongoClient } from 'mongodb';

async function testMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/corexfitness';
  console.log('Testing MongoDB connection to:', uri);
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB connected successfully!');
    const db = client.db('corexfitness');
    const collections = await db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));
    await client.close();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testMongo();

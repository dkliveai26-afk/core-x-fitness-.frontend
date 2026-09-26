import { MongoClient } from 'mongodb';
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

async function updatePassword() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/corexfitness';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('corexfitness');
    const adminsCol = db.collection('admins');

    const newHash = hashPassword('dev.dilkhush@$$$$$');
    const now = new Date().toISOString();

    // Update existing or upsert both admin accounts
    await adminsCol.updateOne(
      { email: 'admin@corexfitness.com' },
      {
        $set: {
          email: 'admin@corexfitness.com',
          passwordHash: newHash,
          name: 'Core X Admin',
          role: 'superadmin',
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    await adminsCol.updateOne(
      { email: 'dilkhushdeveloper@gmail.com' },
      {
        $set: {
          email: 'dilkhushdeveloper@gmail.com',
          passwordHash: newHash,
          name: 'Dilkhush (Lead Admin)',
          role: 'superadmin',
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    console.log('✅ Admin passwords updated in MongoDB successfully for admin@corexfitness.com and dilkhushdeveloper@gmail.com');
  } catch (err) {
    console.error('Error updating password in MongoDB:', err);
  } finally {
    await client.close();
  }
}

updatePassword();

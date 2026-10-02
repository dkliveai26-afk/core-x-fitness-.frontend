const { MongoClient } = require('mongodb');
const { createClerkClient } = require('@clerk/backend');

async function test() {
  const clerk = createClerkClient({ secretKey: 'sk_test_fe4N9jHveG0FJ2ojRtKPNroBMtuk2TaHTQD5UZ9uL2' });
  const user = await clerk.users.getUser('user_3JmKshjl0TjpCfAlb5ILVz8fgiR');
  const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase().trim());
  console.log('User emails:', emails);
  
  const client = new MongoClient('mongodb://127.0.0.1:27017/corexfitness');
  await client.connect();
  const db = client.db();
  
  const filter = {
    $or: [
      { clerkUserId: user.id },
      { email: { $in: emails }, clerkUserId: { $in: [null, undefined, ''] } }
    ]
  };
  
  const docs = await db.collection('bookings').find(filter).sort({ createdAt: -1 }).toArray();
  console.log('Found bookings:', docs.length);
  docs.forEach(d => console.log(' - Plan:', d.planName, 'Status:', d.status, 'Email:', d.email, 'ClerkUserId:', d.clerkUserId));
  await client.close();
}

test().catch(console.error);

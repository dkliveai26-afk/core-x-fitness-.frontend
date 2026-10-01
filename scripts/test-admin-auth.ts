import { authenticateAdmin, MASTER_ADMINS } from '../src/lib/admin-auth';

async function test() {
  const pass = 'dev.dilkhush@$$$$$';
  console.log('Testing password:', pass);
  console.log('1. dilkhushdeveloper:', await authenticateAdmin('dilkhushdeveloper@gmail.com', pass));
  console.log('2. admin@corexfitness:', await authenticateAdmin('admin@corexfitness.com', pass));
  console.log('3. d.klive:', await authenticateAdmin('d.klive.ai26@gmail.com', pass));
  console.log('4. wrong pass:', await authenticateAdmin('dilkhushdeveloper@gmail.com', 'wrongpassword'));
}

test();

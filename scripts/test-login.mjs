async function testLogin() {
  const res = await fetch('http://localhost:3000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@corexfitness.com',
      password: 'dev.dilkhush@$$$$$',
    }),
  });

  console.log('Login Status:', res.status);
  console.log('Set-Cookie Header:', res.headers.get('set-cookie'));
  const json = await res.json();
  console.log('Login Response:', json);
}

testLogin();

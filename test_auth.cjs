const axios = require('axios');

const baseUrl = 'https://avon-smart-portal.vercel.app/api/auth';

async function runTest() {
  const email = `test-${Date.now()}@avon.co.in`;
  const password = 'Password123';
  const name = 'Test User';
  const role = 'employee';

  console.log('Testing Signup...');
  try {
    const signupRes = await axios.post(`${baseUrl}/register`, {
      name,
      email,
      password,
      role
    });
    console.log('Signup Response:', signupRes.data);

    console.log('Testing immediate Login...');
    const loginRes = await axios.post(`${baseUrl}/login`, {
      email,
      password
    });
    console.log('Login Response:', loginRes.data);
    console.log('TEST PASSED!');
  } catch (err) {
    console.error('TEST FAILED:', err.response ? err.response.data : err.message);
  }
}

runTest();

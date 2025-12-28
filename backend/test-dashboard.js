const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000';

async function runTest() {
    try {
        console.log('--- Starting Dashboard Verification ---');

        // 1. Login
        const email = `dashboard${Date.now()}@example.com`;
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Dashboard User',
                email: email,
                password: 'password123',
            });
        } catch (e) { }

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: 'password123',
        });
        const token = loginRes.data.access_token;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Login successful.');

        // 2. Get Statistics
        const statsRes = await axios.get(`${API_URL}/dashboard/statistics`, authHeaders);
        console.log('Statistics:', statsRes.data);
        if (typeof statsRes.data.totalPatents !== 'number') throw new Error('Invalid statistics format');

        // 3. Get Trends
        const trendsRes = await axios.get(`${API_URL}/dashboard/trends`, authHeaders);
        console.log('Trends:', trendsRes.data);
        if (!Array.isArray(trendsRes.data)) throw new Error('Invalid trends format');

        console.log('✅ DASHBOARD VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    }
}

runTest();

const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000';

async function runTest() {
    try {
        console.log('--- Starting KIPRIS Sync Verification ---');

        // 1. Login or Register
        const email = `kipris${Date.now()}@example.com`;
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Kipris User',
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

        // 2. Create Patent with Mockable Number
        const uniqueId = Date.now();
        const createRes = await axios.post(`${API_URL}/patents`, {
            applicationNumber: `KIPRIS-${uniqueId}`, // Mock logic might treat this specifically if needed, but our generic mock returns generic data
            title: 'Original Title',
            applicationDate: new Date().toISOString(),
            status: 'APPLIED'
        }, authHeaders);
        const patentId = createRes.data.id;
        console.log(`Patent Created: ID=${patentId}, Title=${createRes.data.title}`);

        // 3. Trigger Sync
        console.log('\n3. Triggering Sync...');
        const syncRes = await axios.post(`${API_URL}/patents/${patentId}/sync`, {}, authHeaders);
        console.log('Sync Response:', syncRes.data);

        // 4. Verify Update
        console.log('\n4. Verifying Update...');
        if (syncRes.data.title !== 'Mock Invention Title from KIPRIS') {
            throw new Error(`Title mismatch! Expected 'Mock Invention Title from KIPRIS' but got '${syncRes.data.title}'`);
        }
        if (syncRes.data.status !== 'REGISTERED') {
            throw new Error(`Status mismatch! Expected 'REGISTERED' but got '${syncRes.data.status}'`);
        }

        console.log('✅ KIPRIS SYNC VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    }
}

runTest();

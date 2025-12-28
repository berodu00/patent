const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
    try {
        console.log('--- Starting Cost Management Verification ---');

        // 1. Login
        const uniqueId = Date.now();
        const email = `costuser${uniqueId}@example.com`;
        console.log(`\n1. Registering/Logging in as: ${email}`);

        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Cost Manager',
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

        // 2. Create Patent
        console.log('\n2. Creating Patent...');
        const createRes = await axios.post(`${API_URL}/patents`, {
            applicationNumber: `COST-${uniqueId}`,
            title: 'Costly Invention',
            applicationDate: new Date().toISOString(),
            status: 'APPLIED'
        }, authHeaders);
        const patentId = createRes.data.id;
        console.log(`Patent Created: ID=${patentId}`);

        // 3. Add Cost Item
        console.log('\n3. Adding Cost Item...');
        const costRes = await axios.post(`${API_URL}/patents/${patentId}/costs`, {
            type: 'APPLICATION_FEE',
            amount: 50000.00,
            dueDate: '2025-12-31',
            status: 'UNPAID',
            note: 'Initial Fee'
        }, authHeaders);
        const costId = costRes.data.id;
        console.log(`Cost Added: ID=${costId}, Amount=${costRes.data.amount}`);

        // 4. Get Cost Items
        console.log('\n4. Listing Cost Items...');
        const listRes = await axios.get(`${API_URL}/patents/${patentId}/costs`, authHeaders);
        console.log(`Found ${listRes.data.length} cost items.`);
        if (listRes.data.length !== 1) throw new Error('Count mismatch!');
        if (parseFloat(listRes.data[0].amount) !== 50000.00) throw new Error('Amount mismatch!');

        // 5. Remove Cost Item
        console.log('\n5. Removing Cost Item...');
        await axios.delete(`${API_URL}/patents/costs/${costId}`, authHeaders);
        console.log('Deletion successful.');

        // 6. Verify Deletion
        const listRes2 = await axios.get(`${API_URL}/patents/${patentId}/costs`, authHeaders);
        if (listRes2.data.length !== 0) throw new Error('Should be empty after delete!');
        console.log('Deletion verified.');

        console.log('\n✅ COST MANAGEMENT VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    }
}

runTest();

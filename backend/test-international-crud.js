const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
    try {
        console.log('--- Starting International Apps Verification ---');

        // 1. Login
        const uniqueId = Date.now();
        const email = `inventor${uniqueId}@example.com`;
        console.log(`\n1. Registering/Logging in as: ${email}`);

        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Patent Inventor',
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
            applicationNumber: `PCT-${uniqueId}`,
            title: 'Global Invention',
            applicationDate: new Date().toISOString(),
            status: 'APPLIED'
        }, authHeaders);
        const patentId = createRes.data.id;
        console.log(`Patent Created: ID=${patentId}`);

        // 3. Add International App
        console.log('\n3. Adding International Application (US)...');
        const iaRes = await axios.post(`${API_URL}/patents/${patentId}/international`, {
            countryCode: 'US',
            countryName: 'United States',
            status: 'APPLIED'
        }, authHeaders);
        const iaId = iaRes.data.id;
        console.log(`International App Created: ID=${iaId}, Country=${iaRes.data.countryCode}`);

        // 4. Get International Apps
        console.log('\n4. Listing International Applications...');
        const listRes = await axios.get(`${API_URL}/patents/${patentId}/international`, authHeaders);
        console.log(`Found ${listRes.data.length} international apps.`);
        if (listRes.data.length !== 1) throw new Error('Count mismatch!');
        if (listRes.data[0].countryCode !== 'US') throw new Error('Country code mismatch!');

        // 5. Remove International App
        console.log('\n5. Removing International Application...');
        await axios.delete(`${API_URL}/patents/international/${iaId}`, authHeaders);
        console.log('Deletion successful.');

        // 6. Verify Deletion
        const listRes2 = await axios.get(`${API_URL}/patents/${patentId}/international`, authHeaders);
        if (listRes2.data.length !== 0) throw new Error('Should be empty after delete!');
        console.log('Deletion verified.');

        // Cleanup
        await axios.delete(`${API_URL}/patents/${patentId}`, authHeaders);
        console.log('\n✅ INTERNATIONAL APPS VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
    }
}

runTest();

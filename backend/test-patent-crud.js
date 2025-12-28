const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000';
// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
    try {
        console.log('--- Starting Patent CRUD Verification ---');

        // 1. Register & Login a User to get Token
        const uniqueId = Date.now();
        const email = `inventor${uniqueId}@example.com`;
        console.log(`\n1. Registering/Logging in as: ${email}`);

        // Register
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Patent Inventor',
                email: email,
                password: 'password123',
            });
        } catch (e) {
            // Ignore if already exists (unlikely with uniqueId)
        }

        // Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: 'password123',
        });
        const token = loginRes.data.access_token;
        console.log('Login successful. Token acquired.');

        const authHeaders = {
            headers: { Authorization: `Bearer ${token}` },
        };

        // 2. Create Patent
        console.log('\n2. Creating Patent...');
        const patentData = {
            applicationNumber: `10-2025-${uniqueId}`,
            title: 'AI-Powered Patent System',
            description: 'A system to manage patents autonomously.',
            applicationDate: new Date().toISOString(),
            status: 'PREPARING'
        };

        const createRes = await axios.post(`${API_URL}/patents`, patentData, authHeaders);
        const patentId = createRes.data.id;
        console.log(`Patent Created: ID=${patentId}, Title=${createRes.data.title}`);

        // 3. List Patents
        console.log('\n3. Listing Patents...');
        const listRes = await axios.get(`${API_URL}/patents?limit=5`, authHeaders);
        console.log(`Found ${listRes.data.total} patents.`);
        const found = listRes.data.data.find(p => p.id === patentId);
        if (!found) throw new Error('Created patent not found in list!');
        console.log('Created patent verified in list.');

        // 4. Update Patent
        console.log('\n4. Updating Patent...');
        const updateRes = await axios.patch(`${API_URL}/patents/${patentId}`, {
            status: 'APPLIED',
            title: 'AI-Powered Patent System v2'
        }, authHeaders);
        console.log(`Updated Status: ${updateRes.data.status}, Title: ${updateRes.data.title}`);
        if (updateRes.data.status !== 'APPLIED') throw new Error('Update failed!');

        // 5. Get Detail
        console.log('\n5. Getting Patent Detail...');
        const detailRes = await axios.get(`${API_URL}/patents/${patentId}`, authHeaders);
        console.log(`Detail: Applicant=${detailRes.data.applicant?.email}`);
        if (detailRes.data.applicant.email !== email) throw new Error('Applicant mismatch!');

        // 6. Delete Patent (Soft Delete)
        console.log('\n6. Deleting Patent...');
        await axios.delete(`${API_URL}/patents/${patentId}`, authHeaders);
        console.log('Delete request successful.');

        // 7. Verify Deletion
        console.log('\n7. Verifying Deletion...');
        try {
            await axios.get(`${API_URL}/patents/${patentId}`, authHeaders);
            throw new Error('Patent should be 404 after delete!');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Patent successfully not found (404).');
            } else {
                throw error;
            }
        }

        console.log('\n✅ PATENT CRUD VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

runTest();

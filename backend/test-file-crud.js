const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://127.0.0.1:3000';
const TEST_FILE_PATH = 'test-upload.txt';

async function runTest() {
    try {
        console.log('--- Starting File Management Verification ---');

        // Create a dummy file
        fs.writeFileSync(TEST_FILE_PATH, 'Hello Patent World! This is a test file.');

        // 1. Login
        const uniqueId = Date.now();
        const email = `filer${uniqueId}@example.com`;
        console.log(`\n1. Registering/Logging in as: ${email}`);

        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'File Manager',
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
            applicationNumber: `FILE-${uniqueId}`,
            title: 'Filed Invention',
            applicationDate: new Date().toISOString(),
            status: 'APPLIED'
        }, authHeaders);
        const patentId = createRes.data.id;
        console.log(`Patent Created: ID=${patentId}`);

        // 3. Upload File
        console.log('\n3. Uploading File...');
        const form = new FormData();
        form.append('file', fs.createReadStream(TEST_FILE_PATH));

        // Axios with FormData needs headers from form-data
        const uploadHeaders = {
            headers: {
                ...authHeaders.headers,
                ...form.getHeaders(),
            }
        };

        const uploadRes = await axios.post(`${API_URL}/patents/${patentId}/attachments`, form, uploadHeaders);
        const attId = uploadRes.data.id;
        console.log(`File Uploaded: ID=${attId}, Name=${uploadRes.data.fileName}`);

        // 4. Get Attachments
        console.log('\n4. Listing Attachments...');
        const listRes = await axios.get(`${API_URL}/patents/${patentId}/attachments`, authHeaders);
        console.log(`Found ${listRes.data.length} attachments.`);
        if (listRes.data.length !== 1) throw new Error('Count mismatch!');

        // 5. Download File
        console.log('\n5. Downloading File...');
        const downloadRes = await axios.get(`${API_URL}/patents/attachments/${attId}/download`, {
            ...authHeaders,
            responseType: 'text' // We know it's text
        });
        console.log('Downloaded Content:', downloadRes.data);
        if (downloadRes.data !== 'Hello Patent World! This is a test file.') throw new Error('Content mismatch!');

        // 6. Delete Attachment
        console.log('\n6. Deleting Attachment...');
        await axios.delete(`${API_URL}/patents/attachments/${attId}`, authHeaders);
        console.log('Deletion successful.');

        // 7. Verify Deletion
        const listRes2 = await axios.get(`${API_URL}/patents/${patentId}/attachments`, authHeaders);
        if (listRes2.data.length !== 0) throw new Error('Should be empty after delete!');
        console.log('Deletion verified.');

        // Cleanup
        fs.unlinkSync(TEST_FILE_PATH);
        console.log('\n✅ FILE MANAGEMENT VERIFICATION PASSED!');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error.message);
        if (error.response) console.error('Response Data:', error.response.data);
        if (fs.existsSync(TEST_FILE_PATH)) fs.unlinkSync(TEST_FILE_PATH);
    }
}

runTest();

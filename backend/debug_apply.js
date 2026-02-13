const API_URL = 'http://localhost:5000/api';

async function testApply() {
    try {
        console.log('1. Registering Test User...');
        const email = `teststudent_${Date.now()}@example.com`;

        let res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Student',
                email,
                password: 'password123',
                role: 'student'
            })
        });

        // Handle 400 User already exists gracefully if re-running
        if (res.status === 400) {
            console.log('User might already exist, trying login...');
        } else {
            const data = await res.json();
            if (!res.ok) throw new Error(JSON.stringify(data));
            console.log('User Registered:', data.user.id);
        }

        console.log('2. Logging in...');
        res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: 'password123'
            })
        });

        const loginData = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(loginData));

        const token = loginData.token;
        console.log('Logged In. Token received.');

        // 3. Apply to Job ID 1
        const jobId = 1;
        console.log(`3. Trying to Apply to Job ID ${jobId}...`);

        res = await fetch(`${API_URL}/student/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jobId })
        });

        const applyData = await res.json();

        if (res.ok) {
            console.log('SUCCESS: Application Submitted!', applyData);
        } else {
            console.error('APPLY FAILED:', applyData);
        }

    } catch (err) {
        console.error('TEST FAILED:', err.message);
    }
}

testApply();

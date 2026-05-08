import fetch from 'node-fetch';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

(async () => {
    try {
        const token = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret');
        const res = await fetch('http://localhost:3000/api/courses/1000', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.text();
        console.log(res.status, data);
    } catch (e: any) {
        console.error("error:", e.message);
    }
})();

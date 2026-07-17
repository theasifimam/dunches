import dotenv from 'dotenv';
dotenv.config();

console.log('--- ENV VALUES FROM DOTENV ---');
console.log('RAZOR_KEY_ID Raw:', JSON.stringify(process.env.RAZOR_KEY_ID));
console.log('RAZOR_KEY_SECRET Raw:', JSON.stringify(process.env.RAZOR_KEY_SECRET));

const cleanEnv = (val = '') => val.replace(/^["']|["']$/g, '').trim();

console.log('RAZOR_KEY_ID Cleaned:', JSON.stringify(cleanEnv(process.env.RAZOR_KEY_ID)));
console.log('RAZOR_KEY_SECRET Cleaned:', JSON.stringify(cleanEnv(process.env.RAZOR_KEY_SECRET)));

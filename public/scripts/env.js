import * as dotenv from 'dotenv';
dotenv.config();

console.log('url', process.env.VERCEL_URL);
console.log('port', process.env.PORT);

const siteUrl = process.env.VERCEL_URL || "http://localhost:3000";

export default siteUrl;
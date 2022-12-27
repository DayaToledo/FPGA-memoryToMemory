import fs from 'fs';

export async function setSiteURL() {
  const isLocal = !process.env.VERCEL_URL;
  const dataPath = isLocal ? 'tmp/env.json': "/tmp/env.json";
  const envs = JSON.stringify({ siteURL: process.env.VERCEL_URL || "http://localhost:3000" });

  await fs.promises.writeFile(dataPath, envs, err => {
    if (err) throw err;
    console.log("Done writing");
  });
};
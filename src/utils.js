import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

export function getPaths() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const viewsPath = path.join(__dirname, 'views');
  const publicPath = path.join(__dirname.split('src')[0], 'public')
  return { publicPath, viewsPath };
};

export async function setSiteURL() {
  const { publicPath } = getPaths();
  const dataPath = path.join(publicPath, 'data/env.json')
  console.log({ siteURL: process.env.VERCEL_URL });
  console.log(process.env);
  const envs = JSON.stringify({ siteURL: process.env.VERCEL_URL || "http://localhost:3000" });
  console.log(envs);

  await fs.promises.writeFile(dataPath, envs, err => {
    if (err) throw err;
    console.log("Done writing");
  });
};
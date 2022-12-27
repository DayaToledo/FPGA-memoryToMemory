import express from 'express'; 
import nunjucks from 'nunjucks'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { 
  pageHome, 
  pageGame, 
  pageWaiting, 
  pageEnd, 
  pageRules, 
  pageAbout, 
  pageRooms, 
} from './pages.js';

const app = express(); 
const rootPath = __dirname.split('src')[0];

app.set('view engine', 'html');

nunjucks.configure(path.join(__dirname, '/views'), {
  autoescape: true,
  express: app,
  noCache: true,
}).addGlobal('siteUrl', process.env.VERCEL_URL);

app.use(express.static(path.join(rootPath, 'public')));
app.use('/tmp', express.static(path.join(rootPath, 'tmp')));
app.get("/", pageHome);
app.get("/waiting", pageWaiting);
app.get("/game", pageGame);
app.get("/end", pageEnd);
app.get("/rules", pageRules);
app.get("/about", pageAbout);
app.get("/rooms", pageRooms);

import { createServer } from 'http';
const server = createServer(app); 

import { setSiteURL } from './utils.js';
await setSiteURL();

export default server;
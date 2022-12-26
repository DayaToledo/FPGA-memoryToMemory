import express from 'express'; 
import nunjucks from 'nunjucks'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).split('src')[0];

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

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

nunjucks.configure(path.join(__dirname, 'src/views'), {
    autoescape: true,
    express: app,
    noCache: true,
});

app.get("/", pageHome);
app.get("/waiting", pageWaiting);
app.get("/game", pageGame);
app.get("/end", pageEnd);
app.get("/rules", pageRules);
app.get("/about", pageAbout);
app.get("/rooms", pageRooms);

import { createServer } from 'http';
const server = createServer(app); 

export default server;
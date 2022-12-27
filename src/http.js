import express from 'express'; 
import nunjucks from 'nunjucks'; 
import { setSiteURL, getPaths } from './utils.js';

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
const { publicPath, viewsPath } = getPaths();

app.set('view engine', 'html');

nunjucks.configure(viewsPath, {
  autoescape: true,
  express: app,
  noCache: true,
});

app.use(express.static(publicPath));
app.get("/", pageHome);
app.get("/waiting", pageWaiting);
app.get("/game", pageGame);
app.get("/end", pageEnd);
app.get("/rules", pageRules);
app.get("/about", pageAbout);
app.get("/rooms", pageRooms);

import { createServer } from 'http';
const server = createServer(app); 

await setSiteURL();

export default server;
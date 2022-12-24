import express from 'express'; 
import nunjucks from 'nunjucks'; 

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

nunjucks.configure('src/views', {
    express: app,
    noCache: true,
})

app.use(express.static("public"));
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
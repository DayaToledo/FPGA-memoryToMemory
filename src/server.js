import server from './http.js'; 
import './websocket.js';

server.listen(3000, () => console.log("Server is running on PORT 3000")); 
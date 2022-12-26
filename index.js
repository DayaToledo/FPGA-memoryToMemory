import server from '../src/http.js'; 
import '../src/websocket.js';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`)); 

module.exports = server;
import server from './src/http.js'; 
import './src/websocket.js';

const PORT = process.env.PORT || 3000;
console.log(PORT);

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`)); 

export default server;
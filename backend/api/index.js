import dotenv from "dotenv";
import http from "http";
import app from "../app.js";
import { initSocket } from "../socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);

// Initialiser Socket.io
initSocket(null);

httpServer.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

export default app;

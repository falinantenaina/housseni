import dotenv from "dotenv";
import app from "../app.js";

dotenv.config();

// En développement local, démarrer le serveur HTTP directement.
// Sur Vercel (serverless), l'export default suffit — pas besoin de listen().
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

export default app;

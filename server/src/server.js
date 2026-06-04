import "dotenv/config";
import app from "./app.js";
import { initializeDatabase } from "./config/database.js";

const port = process.env.PORT || 4000;

async function startServer() {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server");
  console.error(error);
  process.exit(1);
});

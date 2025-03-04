// src/server.ts
import app from "./app";

if (!process.env.VERCEL) {
  // Only start the server locall
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

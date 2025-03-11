// src/app.ts
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';
import onboardingRoutes from "./routes/onboarding.routes";
import path from "path";

const app = express();

app.use(express.json());
app.use(
    cors({
      origin: [
        "http://3.107.49.121:8000/",
        "http://localhost:5173",
        "https://ac59-2405-201-c04a-9044-591d-a99a-d898-a0a3.ngrok-free.app",
        "https://chat-and-call-components-updated.d20z2klsr2pc69.amplifyapp.com",
          "https://dev-buddy.merulife.ai"
      ],
      credentials: true,
    })
  );
  

  const swaggerPath = path.join(__dirname, "..", "swagger.yaml");
  const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8")) as Record<string, any>;
  


// Set up routes
app.use("/api", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/onboarding", onboardingRoutes)

export default app;

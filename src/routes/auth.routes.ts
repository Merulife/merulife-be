// src/routes/auth.routes.ts
import { Router } from "express";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config/auth.config";
import { getAllChats } from "../controllers/chat.controller";

const router = Router();

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as any,
  audience: AUTH0_AUDIENCE,
  issuer: 'https://merulifedev.us.auth0.com/',
  algorithms: ["RS256"],
});

// Public endpoint
router.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint" });
});



// Protected endpoint
router.get("/protected", checkJwt, (req, res) => {
    res.json({
      message: "This is a protected endpoint",
      user_id: (req as any).auth.sub, // Changed from req.user to req.auth
    });
  });

export default router;

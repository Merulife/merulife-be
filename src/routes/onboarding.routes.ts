import { Router } from "express";
import { getOnboarding, createOnboarding } from "../controllers/onboarding.controller";
import { expressjwt } from "express-jwt";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config/auth.config";
import jwksRsa from "jwks-rsa";

const router = Router();


const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as any,
  audience: AUTH0_AUDIENCE,
  issuer: 'https://dev-yq4c5b0jjcjlsbog.us.auth0.com/',
  algorithms: ["RS256"],
});



// GET endpoint to check if onboarding is completed.
router.get("/", getOnboarding);

// POST endpoint to create a new onboarding record.
router.post("/", createOnboarding);

export default router;

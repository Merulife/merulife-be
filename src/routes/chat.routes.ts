// src/routes/chat.routes.ts
import { Router } from "express";
// import { checkJwt } from "../middlewares/auth.middleware";
import { sendMessage, getConversation, getAllChats, getLastTenConversations } from "../controllers/chat.controller";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config/auth.config";

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


router.get("/allchat", getAllChats);
router.get('/getLast10', getLastTenConversations);


/**
 * POST /api/chat/:companionId
 * Create a new message in the conversation with the given companion.
 * If the conversation does not exist, create it.
 */
router.post("/:companionId", checkJwt, sendMessage);

/**
 * GET /api/chat/:companionId
 * Retrieve all messages for the conversation with the given companion.
 */
router.get("/:companionId", checkJwt, getConversation);

// router.get("/allchat", getAllChats)

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chat.routes.ts
const express_1 = require("express");
// import { checkJwt } from "../middlewares/auth.middleware";
const chat_controller_1 = require("../controllers/chat.controller");
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const auth_config_1 = require("../config/auth.config");
const router = (0, express_1.Router)();
const checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth_config_1.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: auth_config_1.AUTH0_AUDIENCE,
    issuer: 'https://merulifedev.us.auth0.com/',
    algorithms: ["RS256"],
});
router.get("/allchat", chat_controller_1.getAllChats);
router.get('/getLast10', chat_controller_1.getLastTenConversations);
/**
 * POST /api/chat/:companionId
 * Create a new message in the conversation with the given companion.
 * If the conversation does not exist, create it.
 */
router.post("/:companionId", checkJwt, chat_controller_1.sendMessage);
/**
 * GET /api/chat/:companionId
 * Retrieve all messages for the conversation with the given companion.
 */
router.get("/:companionId", checkJwt, chat_controller_1.getConversation);
// router.get("/allchat", getAllChats)
exports.default = router;

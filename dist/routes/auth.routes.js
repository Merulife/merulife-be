"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
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
// Public endpoint
router.get("/public", (req, res) => {
    res.json({ message: "This is a public endpoint" });
});
// Protected endpoint
router.get("/protected", checkJwt, (req, res) => {
    res.json({
        message: "This is a protected endpoint",
        user_id: req.auth.sub, // Changed from req.user to req.auth
    });
});
exports.default = router;

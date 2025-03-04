"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onboarding_controller_1 = require("../controllers/onboarding.controller");
const express_jwt_1 = require("express-jwt");
const auth_config_1 = require("../config/auth.config");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
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
// GET endpoint to check if onboarding is completed.
router.get("/", onboarding_controller_1.getOnboarding);
// POST endpoint to create a new onboarding record.
router.post("/", onboarding_controller_1.createOnboarding);
exports.default = router;

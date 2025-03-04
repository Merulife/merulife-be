"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const auth_config_1 = require("../config/auth.config");
exports.checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth_config_1.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: auth_config_1.AUTH0_AUDIENCE,
    issuer: `https://${auth_config_1.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
});

// // src/middlewares/auth.middleware.ts
// import { RequestHandler } from "express";
// import { expressjwt } from "express-jwt";
// import jwksRsa from "jwks-rsa";
// import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config/auth.config";

// export const checkJwt: RequestHandler = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
//   }) as any,
//   audience: AUTH0_AUDIENCE,
//   issuer: `https://${AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
// });

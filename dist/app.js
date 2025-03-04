"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const onboarding_routes_1 = __importDefault(require("./routes/onboarding.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://3.107.49.121:8000/",
        "http://localhost:5173",
        "https://ac59-2405-201-c04a-9044-591d-a99a-d898-a0a3.ngrok-free.app"
    ],
    credentials: true,
}));
// Load the swagger.yaml file and cast it to a Record<string, any>
const swaggerDocument = js_yaml_1.default.load(fs_1.default.readFileSync('./swagger.yaml', 'utf8'));
// Serve swagger docs on /api-docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Set up routes
app.use("/api", auth_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/api/onboarding", onboarding_routes_1.default);
exports.default = app;

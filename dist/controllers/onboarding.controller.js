"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnboarding = exports.getOnboarding = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /api/onboarding?userId=...
 * Checks whether the user has completed onboarding.
 * Returns:
 *    { "exists": true, "data": { ... } }  if onboarding exists,
 * or { "exists": false } otherwise.
 */
const getOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required." });
        }
        const onboarding = yield prisma.onboarding.findUnique({
            where: { userId },
        });
        if (onboarding) {
            return res.json({ exists: true, data: onboarding });
        }
        else {
            return res.json({ exists: false });
        }
    }
    catch (error) {
        console.error("Error checking onboarding:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getOnboarding = getOnboarding;
/**
 * POST /api/onboarding
 * Creates a new onboarding record for a user.
 * Expects a JSON payload with:
 *    { "userId": "string", "gender": "string", "age": number }
 */
const createOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, gender, age } = req.body;
        if (!userId || !gender || age === undefined) {
            return res.status(400).json({ error: "userId, gender, and age are required." });
        }
        // Check if the user already has an onboarding record
        const existing = yield prisma.onboarding.findUnique({
            where: { userId },
        });
        if (existing) {
            return res.status(400).json({ error: "Onboarding already completed." });
        }
        const newRecord = yield prisma.onboarding.create({
            data: { userId, gender, age },
        });
        res.status(201).json(newRecord);
    }
    catch (error) {
        console.error("Error creating onboarding:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createOnboarding = createOnboarding;

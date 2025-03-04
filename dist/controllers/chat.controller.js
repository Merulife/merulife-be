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
exports.getLastTenConversations = exports.getAllChats = exports.getConversation = exports.sendMessage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Handles sending a message for a specific companion.
 * Checks for an existing conversation (by userId and companion identifier).
 * If none exists, it creates a new conversation and then adds the message.
 */
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companionId } = req.params;
        // Expecting message, sender, and userId to be in the body.
        const { message, sender, userId } = req.body;
        // console.log("sendMessage: userId =", userId);
        if (!message || !sender || !userId) {
            return res.status(400).json({ error: "Message, sender, and userId are required." });
        }
        // Find or create a conversation for this user and companion.
        let conversation = yield prisma.conversation.findUnique({
            where: {
                userId_companion: {
                    userId,
                    companion: companionId,
                },
            },
        });
        if (!conversation) {
            conversation = yield prisma.conversation.create({
                data: {
                    userId,
                    companion: companionId,
                },
            });
            console.log('ct\read');
        }
        // Create the chat message.
        const chatMessage = yield prisma.chatMessage.create({
            data: {
                conversationId: conversation.id,
                content: message,
                sender,
            },
        });
        res.status(201).json(chatMessage);
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.sendMessage = sendMessage;
/**
 * Retrieves the full conversation (chat history) for a given companion.
 */
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companionId } = req.params;
        const userId = req.query.userId;
        // Find the conversation for this user and companion.
        const conversation = yield prisma.conversation.findUnique({
            where: {
                userId_companion: {
                    userId,
                    companion: companionId,
                },
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        // If no conversation exists, return an empty array.
        if (!conversation) {
            return res.json([]);
        }
        res.json(conversation.messages);
    }
    catch (error) {
        console.error("Error retrieving conversation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getConversation = getConversation;
/**
* Retrieves the entire chat database: all conversations with their messages.
*/
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all conversations, including their messages (ordered by creation time)
        const conversations = yield prisma.conversation.findMany({
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        // Group the conversations by userId
        const groupedByUser = conversations.reduce((acc, conversation) => {
            const { userId } = conversation;
            if (!acc[userId]) {
                acc[userId] = [];
            }
            acc[userId].push(conversation);
            return acc;
        }, {});
        res.json(groupedByUser);
    }
    catch (error) {
        console.error("Error retrieving all chats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllChats = getAllChats;
// get last 10 coversations
const getLastTenConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the last 10 conversations sorted by createdAt in descending order.
        const conversations = yield prisma.conversation.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        res.json(conversations);
    }
    catch (error) {
        console.error("Error retrieving last ten conversations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getLastTenConversations = getLastTenConversations;

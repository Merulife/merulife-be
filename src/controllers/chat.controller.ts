// src/controllers/chat.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handles sending a message for a specific companion.
 * Checks for an existing conversation (by userId and companion identifier).
 * If none exists, it creates a new conversation and then adds the message.
 */
export const sendMessage = async (req: Request, res: Response) => {
    try {
      const { companionId } = req.params;
      // Expecting message, sender, and userId to be in the body.
      const { message, sender, userId } = req.body;
      console.log("sendMessage: userId =", userId);
  
      if (!message || !sender || !userId) {
        return res.status(400).json({ error: "Message, sender, and userId are required." });
      }
  
      // Find or create a conversation for this user and companion.
      let conversation = await prisma.conversation.findUnique({
        where: {
          userId_companion: {
            userId,
            companion: companionId,
          },
        },
      });
  
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            userId,
            companion: companionId,
          },
        });
        // console.log('ct\read');
        
      }
  
      // Create the chat message.
      const chatMessage = await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          content: message,
          sender,
        },
      });
  
      res.status(201).json(chatMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

/**
 * Retrieves the full conversation (chat history) for a given companion.
 */
export const getConversation = async (req: Request, res: Response) => {
    try {
      const { companionId } = req.params;
      const userId = req.query.userId as string;
  
      // Find the conversation for this user and companion.
      const conversation = await prisma.conversation.findUnique({
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
    } catch (error) {
      console.error("Error retrieving conversation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  /**
 * Retrieves the entire chat database: all conversations with their messages.
 */
export const getAllChats = async (req: Request, res: Response) => {
    try {
      // Fetch all conversations, including their messages (ordered by creation time)
      const conversations = await prisma.conversation.findMany({
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      // Group the conversations by userId
    const groupedByUser = conversations.reduce((acc: { [x: string]: any[]; }, conversation: { userId: any; }) => {
        const { userId } = conversation;
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push(conversation);
        return acc;
      }, {} as Record<string, typeof conversations>);
  
      res.json(groupedByUser);

    } catch (error) {
      console.error("Error retrieving all chats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


// get last 10 coversations
export const getLastTenConversations = async (req: Request, res: Response) => {
    try {
      // Fetch the last 10 conversations sorted by createdAt in descending order.
      const conversations = await prisma.conversation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
  
      res.json(conversations);
    } catch (error) {
      console.error("Error retrieving last ten conversations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  
  

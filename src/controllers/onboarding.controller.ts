import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/onboarding?userId=...
 * Checks whether the user has completed onboarding.
 * Returns:
 *    { "exists": true, "data": { ... } }  if onboarding exists,
 * or { "exists": false } otherwise.
 */
export const getOnboarding = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "UserId is required." });
    }

    const onboarding = await prisma.onboarding.findUnique({
      where: { userId },
    });

    if (onboarding) {
      return res.json({ exists: true, data: onboarding });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking onboarding:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /api/onboarding
 * Creates a new onboarding record for a user.
 * Expects a JSON payload with:
 *    { "userId": "string", "gender": "string", "age": number }
 */
export const createOnboarding = async (req: Request, res: Response) => {
  try {
    const { userId, gender, age } = req.body;
    if (!userId || !gender || age === undefined) {
      return res.status(400).json({ error: "userId, gender, and age are required." });
    }

    // Check if the user already has an onboarding record
    const existing = await prisma.onboarding.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.status(400).json({ error: "Onboarding already completed." });
    }

    const newRecord = await prisma.onboarding.create({
      data: { userId, gender, age },
    });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating onboarding:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

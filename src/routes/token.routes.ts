import { Router, Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const router = Router();

const createToken = async (): Promise<string> => {
  // Generate a unique room name every time
  const roomName = "room-" + uuidv4().substring(0, 8);
  // Identifier to be used for the participant.
  const participantName = "quickstart-username";

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing LiveKit API credentials in environment variables");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: "10m",
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};

router.get("/getToken", async (req: Request, res: Response) => {
  try {
    const token = await createToken();
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

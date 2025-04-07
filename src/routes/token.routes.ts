import { Router, Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const createToken = async (companionId: string): Promise<string> => {
  // Generate a unique room name every time.
  const roomName = "room-" + uuidv4().substring(0, 8);
  // Identifier to be used for the participant.
  const participantName = "quickstart-username";

  // Use the companion id to get the correct environment variables.
  // Example: if companionId is "companion_001", then:
  // process.env["COMPANION_001_LIVEKIT_API_KEY"]
  const envPrefix = companionId.toUpperCase();
  const livekitUrl = process.env[`${envPrefix}_LIVEKIT_URL`];
  const apiKey = process.env[`${envPrefix}_LIVEKIT_API_KEY`];
  const apiSecret = process.env[`${envPrefix}_LIVEKIT_API_SECRET`];

  if (!livekitUrl || !apiKey || !apiSecret) {
    throw new Error(`Missing LiveKit credentials for ${companionId} in environment variables`);
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: "10m",
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};

router.get("/getToken/:companionId", async (req: Request, res: Response) => {
  try {
    const companionId = req.params.companionId;
    const token = await createToken(companionId);
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

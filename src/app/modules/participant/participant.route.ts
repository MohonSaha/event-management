import express from "express";
import { ParticipantControllers } from "./participant.controller";

const router = express.Router();

router.post("/participant", ParticipantControllers.registerParticipant);

export const ParticipantRoutes = router;

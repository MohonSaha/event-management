import express from "express";
import { EventControllers } from "./event.controller";

const router = express.Router();

router.post("/events", EventControllers.addEvent);

router.get("/events", EventControllers.getAllEvents);

router.get("/events/:id", EventControllers.getSpecificEventByID);

router.put("/events/:id", EventControllers.updateEvent);

router.delete("/events/:id", EventControllers.deleteEvent);

router.post("/events/:id/participants", EventControllers.addParticipant);

router.delete(
  "/events/:id/participants/:participantId",
  EventControllers.removeParticipant
);

export const EventRoutes = router;

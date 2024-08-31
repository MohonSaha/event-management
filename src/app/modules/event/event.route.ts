import express from "express";
import { EventControllers } from "./event.controller";

const router = express.Router();

router.post("/events", EventControllers.addEvent);

router.get("/events", EventControllers.getAllEvents);

export const EventRoutes = router;

import express from "express";
import { EventRoutes } from "../modules/event/event.route";
import { ParticipantRoutes } from "../modules/participant/participant.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: EventRoutes,
  },
  {
    path: "/",
    route: ParticipantRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

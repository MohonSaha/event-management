import express from "express";
import { EventRoutes } from "../modules/event/event.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: EventRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

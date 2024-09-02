"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoutes = void 0;
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("./event.controller");
const router = express_1.default.Router();
router.post("/events", event_controller_1.EventControllers.addEvent);
router.get("/events", event_controller_1.EventControllers.getAllEvents);
router.get("/events/:id", event_controller_1.EventControllers.getSpecificEventByID);
router.put("/events/:id", event_controller_1.EventControllers.updateEvent);
router.delete("/events/:id", event_controller_1.EventControllers.deleteEvent);
router.post("/events/:id/participants", event_controller_1.EventControllers.addParticipant);
router.delete("/events/:id/participants/:participantId", event_controller_1.EventControllers.removeParticipant);
exports.EventRoutes = router;

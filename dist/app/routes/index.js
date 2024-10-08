"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_route_1 = require("../modules/event/event.route");
const participant_route_1 = require("../modules/participant/participant.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: event_route_1.EventRoutes,
    },
    {
        path: "/",
        route: participant_route_1.ParticipantRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

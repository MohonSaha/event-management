"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const participant_controller_1 = require("./participant.controller");
const router = express_1.default.Router();
router.post("/participant", participant_controller_1.ParticipantControllers.registerParticipant);
exports.ParticipantRoutes = router;

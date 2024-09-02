"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const event_service_1 = require("./event.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const addEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const result = yield event_service_1.EventServices.addeventIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "New event added successfully!",
        data: result,
    });
}));
const getAllEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield event_service_1.EventServices.getAllEventsFromDB(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Events list retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getSpecificEventByID = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventID = parseInt(req.params.id);
    const result = yield event_service_1.EventServices.getSpecificEventFromDB(eventID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single event details retrieved successfully!",
        data: result,
    });
}));
const updateEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventID = parseInt(req.params.id);
    const payload = req.body;
    const result = yield event_service_1.EventServices.updateEventIntoDB(eventID, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Event updated successfully!",
        data: result,
    });
}));
const deleteEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventID = parseInt(req.params.id);
    const result = yield event_service_1.EventServices.deleteEventByID(eventID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Event deleted successfully!",
        data: null,
    });
}));
const addParticipant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const eventID = parseInt(req.params.id);
    const result = yield event_service_1.EventServices.addParticipantOnEvent(req.body, eventID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Participant added successfully!",
        data: result,
    });
}));
const removeParticipant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const eventID = parseInt(req.params.id);
    const participantID = parseInt(req.params.participantId);
    const result = yield event_service_1.EventServices.removeParticipantFromEvent(eventID, participantID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Participant removed successfully from the event!",
        data: result,
    });
}));
exports.EventControllers = {
    addEvent,
    getAllEvents,
    getSpecificEventByID,
    updateEvent,
    deleteEvent,
    addParticipant,
    removeParticipant,
};

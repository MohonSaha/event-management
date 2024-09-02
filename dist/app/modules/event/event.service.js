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
exports.EventServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const event_utils_1 = require("./event.utils");
const addeventIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, eventDate, startTime, endTime } = payload;
    // Check for time conflicts before creating the event
    yield (0, event_utils_1.checkTimeConflict)(location, eventDate, startTime, endTime);
    payload.startTime = (0, event_utils_1.convertTo24HourFormat)(startTime);
    payload.endTime = (0, event_utils_1.convertTo24HourFormat)(endTime);
    const createdPostData = yield prisma_1.default.event.create({
        data: payload,
    });
    return createdPostData;
});
const getAllEventsFromDB = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const events = yield prisma_1.default.event.findMany({
        include: {
            participants: true,
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const paginatedEvents = events.slice(skip, skip + limit);
    const total = events.length;
    return {
        success: true,
        statusCode: 200,
        message: "Schools list retrieved successfully!",
        meta: {
            page,
            limit,
            total,
        },
        data: paginatedEvents,
    };
});
const getSpecificEventFromDB = (eventID) => __awaiter(void 0, void 0, void 0, function* () {
    // const eventID = parseInt(id);
    const result = yield prisma_1.default.event.findUniqueOrThrow({
        where: {
            eventID,
        },
        include: {
            participants: true,
        },
    });
    return result;
});
const updateEventIntoDB = (eventID, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate event existence
    yield (0, event_utils_1.validateEventExists)(eventID);
    const { location, eventDate, startTime, endTime } = payload;
    // Ensure correct data types
    if (typeof eventDate === "string" &&
        typeof startTime === "string" &&
        typeof endTime === "string") {
        const eventDateObj = new Date(eventDate);
        yield (0, event_utils_1.checkTimeConflictForUpdate)(eventID, location, eventDate, startTime, endTime);
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payload format. Ensure eventDate, startTime, and endTime are strings.");
    }
    const updateEventData = yield prisma_1.default.event.update({
        where: {
            eventID,
        },
        data: payload,
    });
    return updateEventData;
});
const deleteEventByID = (eventID) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate event existence
    yield (0, event_utils_1.validateEventExists)(eventID);
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // First, delete all participants associated with the event
        yield prisma.participantOnEvent.deleteMany({
            where: {
                eventID,
            },
        });
        // Then, delete the event itself
        const deletedEvent = yield prisma.event.delete({
            where: {
                eventID,
            },
        });
        return deletedEvent;
    }));
});
const addParticipantOnEvent = (payload, eventID) => __awaiter(void 0, void 0, void 0, function* () {
    const { participantID: participantIDs } = payload;
    /// Validate event existence
    yield (0, event_utils_1.validateEventExists)(eventID);
    // Validate each participant ID
    for (let id of participantIDs) {
        const participant = yield prisma_1.default.participant.findUnique({
            where: {
                participantID: parseInt(id),
            },
        });
        if (!participant) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Participant ID ${id} not found! Try again with a valid participant ID.`);
        }
    }
    // Add all participants to the event
    const addedParticipants = yield prisma_1.default.$transaction(participantIDs.map((id) => prisma_1.default.participantOnEvent.create({
        data: {
            participantID: parseInt(id),
            eventID,
        },
    })));
    return addedParticipants;
});
const removeParticipantFromEvent = (eventID, participantID) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate event existence
    yield (0, event_utils_1.validateEventExists)(eventID);
    // check if the given participantId is valid or not
    const participant = yield prisma_1.default.participant.findUnique({
        where: {
            participantID,
        },
    });
    if (!participant) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Participant ID ${participantID} not found! Try again with valid participant ID.`);
    }
    const removeParticipant = yield prisma_1.default.participantOnEvent.deleteMany({
        where: {
            participantID,
            eventID,
        },
    });
    return removeParticipant;
});
exports.EventServices = {
    addeventIntoDB,
    getAllEventsFromDB,
    getSpecificEventFromDB,
    updateEventIntoDB,
    deleteEventByID,
    addParticipantOnEvent,
    removeParticipantFromEvent,
};

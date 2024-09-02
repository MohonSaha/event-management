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
exports.convertTo12HourFormat = exports.convertTo24HourFormat = exports.checkTimeConflictForUpdate = exports.validateEventExists = exports.checkTimeConflict = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const date_fns_1 = require("date-fns");
// Function to convert 12-hour time format to 24-hour format
const parseTime = (time) => (0, date_fns_1.parse)(time, "hh:mm a", new Date()).toISOString().substr(11, 5);
const checkTimeConflict = (location, eventDate, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert input times to 24-hour format
    const startTime24h = (0, exports.convertTo24HourFormat)(startTime);
    const endTime24h = (0, exports.convertTo24HourFormat)(endTime);
    // Find conflicting events
    const conflictingEvents = yield prisma_1.default.event.findMany({
        where: {
            location,
            eventDate,
            OR: [
                {
                    startTime: {
                        lt: endTime24h,
                    },
                    endTime: {
                        gt: startTime24h,
                    },
                },
            ],
        },
    });
    if (conflictingEvents.length > 0) {
        // Format the event date and times for the error message
        const formattedDate = (0, date_fns_1.format)(new Date(conflictingEvents[0].eventDate), "dd-MM-yyyy");
        const formatTime = (time) => (0, date_fns_1.format)(new Date(`1970-01-01T${time}:00Z`), "hh:mm a");
        const startTime12h = (0, exports.convertTo12HourFormat)(conflictingEvents[0].startTime);
        const endTime12h = (0, exports.convertTo12HourFormat)(conflictingEvents[0].endTime);
        throw new ApiError_1.default(http_status_1.default.CONFLICT, `Time conflict detected! Another event is already scheduled at ${location} on ${formattedDate} from ${startTime12h} to ${endTime12h}.`);
    }
});
exports.checkTimeConflict = checkTimeConflict;
const validateEventExists = (eventID) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prisma_1.default.event.findUnique({
        where: {
            eventID,
        },
    });
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Event ID ${eventID} not found! Try again with a valid event ID.`);
    }
    return event;
});
exports.validateEventExists = validateEventExists;
const checkTimeConflictForUpdate = (eventID, location, eventDate, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert input times to 24-hour format
    const startTime24h = (0, exports.convertTo24HourFormat)(startTime);
    const endTime24h = (0, exports.convertTo24HourFormat)(endTime);
    console.log(startTime24h, endTime24h);
    const conflictingEvents = yield prisma_1.default.event.findMany({
        where: {
            location,
            eventDate,
            eventID: {
                not: eventID,
            },
            OR: [
                {
                    startTime: {
                        lt: endTime24h,
                    },
                    endTime: {
                        gt: startTime24h,
                    },
                },
            ],
        },
    });
    if (conflictingEvents.length > 0) {
        const formattedDate = (0, date_fns_1.format)(new Date(conflictingEvents[0].eventDate), "dd-MM-yyyy");
        const startTime12h = (0, exports.convertTo12HourFormat)(conflictingEvents[0].startTime);
        const endTime12h = (0, exports.convertTo12HourFormat)(conflictingEvents[0].endTime);
        throw new ApiError_1.default(http_status_1.default.CONFLICT, `Time conflict detected! Another event is already scheduled at ${location} on ${formattedDate} from ${startTime12h} to ${endTime12h}.`);
    }
});
exports.checkTimeConflictForUpdate = checkTimeConflictForUpdate;
const convertTo24HourFormat = (time12h) => {
    // Split the time and period (AM/PM)
    const [time, period] = time12h.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    // Convert hours to 24-hour format
    let convertedHours = hours;
    if (period === "PM" && hours !== 12) {
        convertedHours += 12;
    }
    if (period === "AM" && hours === 12) {
        convertedHours = 0;
    }
    // Format hours and minutes to two digits
    const formattedHours = String(convertedHours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
};
exports.convertTo24HourFormat = convertTo24HourFormat;
const convertTo12HourFormat = (time24h) => {
    // Split the time into hours and minutes
    let [hours, minutes] = time24h.split(":").map(Number);
    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight (12 AM)
    // Format hours and minutes to two digits
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${period}`;
};
exports.convertTo12HourFormat = convertTo12HourFormat;

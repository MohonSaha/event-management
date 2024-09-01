import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { format, parse, isBefore, isAfter, parseISO } from "date-fns";

// Function to convert 12-hour time format to 24-hour format
const parseTime = (time: string) =>
  parse(time, "hh:mm a", new Date()).toISOString().substr(11, 5);

export const checkTimeConflict = async (
  location: string,
  eventDate: string,
  startTime: string,
  endTime: string
) => {
  // Convert input times to 24-hour format
  const startTime24h = convertTo24HourFormat(startTime);
  const endTime24h = convertTo24HourFormat(endTime);

  // Find conflicting events
  const conflictingEvents = await prisma.event.findMany({
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
    const formattedDate = format(
      new Date(conflictingEvents[0].eventDate),
      "dd-MM-yyyy"
    );
    const formatTime = (time: string) =>
      format(new Date(`1970-01-01T${time}:00Z`), "hh:mm a");

    const startTime12h = convertTo12HourFormat(conflictingEvents[0].startTime);
    const endTime12h = convertTo12HourFormat(conflictingEvents[0].endTime);

    throw new ApiError(
      httpStatus.CONFLICT,
      `Time conflict detected! Another event is already scheduled at ${location} on ${formattedDate} from ${startTime12h} to ${endTime12h}.`
    );
  }
};

export const validateEventExists = async (eventID: number) => {
  const event = await prisma.event.findUnique({
    where: {
      eventID,
    },
  });

  if (!event) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Event ID ${eventID} not found! Try again with a valid event ID.`
    );
  }
  return event;
};

export const checkTimeConflictForUpdate = async (
  eventID: number,
  location: string,
  eventDate: string,
  startTime: string,
  endTime: string
) => {
  // Convert input times to 24-hour format
  const startTime24h = convertTo24HourFormat(startTime);
  const endTime24h = convertTo24HourFormat(endTime);

  console.log(startTime24h, endTime24h);

  const conflictingEvents = await prisma.event.findMany({
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
    const formattedDate = format(
      new Date(conflictingEvents[0].eventDate),
      "dd-MM-yyyy"
    );

    const startTime12h = convertTo12HourFormat(conflictingEvents[0].startTime);
    const endTime12h = convertTo12HourFormat(conflictingEvents[0].endTime);

    throw new ApiError(
      httpStatus.CONFLICT,
      `Time conflict detected! Another event is already scheduled at ${location} on ${formattedDate} from ${startTime12h} to ${endTime12h}.`
    );
  }
};

export const convertTo24HourFormat = (time12h: any) => {
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

export const convertTo12HourFormat = (time24h: any) => {
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

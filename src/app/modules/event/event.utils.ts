import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { format } from "date-fns";

export const checkTimeConflict = async (
  location: string,
  eventDate: Date,
  startTime: string,
  endTime: string
) => {
  const conflictingEvents = await prisma.event.findMany({
    where: {
      location,
      eventDate,
      OR: [
        {
          startTime: {
            lt: endTime,
          },
          endTime: {
            gt: startTime,
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
    throw new ApiError(
      httpStatus.CONFLICT,
      `Time conflict detected! Another event is already scheduled at ${location} on ${formattedDate} from ${conflictingEvents[0].startTime} to ${conflictingEvents[0].endTime}.`
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
  eventDate: Date,
  startTime: string,
  endTime: string
) => {
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
            lt: endTime,
          },
          endTime: {
            gt: startTime,
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
    throw new ApiError(
      httpStatus.CONFLICT,
      `Time conflict detected! Another event is already scheduled at ${location} on ${formattedDate} from ${conflictingEvents[0].startTime} to ${conflictingEvents[0].endTime}.`
    );
  }
};

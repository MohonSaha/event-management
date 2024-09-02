import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import {
  checkTimeConflict,
  checkTimeConflictForUpdate,
  convertTo12HourFormat,
  convertTo24HourFormat,
  validateEventExists,
} from "./event.utils";

const addeventIntoDB = async (payload: any) => {
  const { location, eventDate, startTime, endTime } = payload;

  // Check for time conflicts before creating the event
  await checkTimeConflict(location, eventDate, startTime, endTime);

  payload.startTime = convertTo24HourFormat(startTime);
  payload.endTime = convertTo24HourFormat(endTime);

  const createdPostData = await prisma.event.create({
    data: payload,
  });
  return createdPostData;
};

const getAllEventsFromDB = async (options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const events = await prisma.event.findMany({
    include: {
      participants: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
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
};

const getSpecificEventFromDB = async (eventID: number) => {
  // const eventID = parseInt(id);
  const result = await prisma.event.findUniqueOrThrow({
    where: {
      eventID,
    },
    include: {
      participants: true,
    },
  });
  return result;
};

const updateEventIntoDB = async (eventID: number, payload: any) => {
  // Validate event existence
  await validateEventExists(eventID);

  const { location, eventDate, startTime, endTime } = payload;

  // Ensure correct data types
  if (
    typeof eventDate === "string" &&
    typeof startTime === "string" &&
    typeof endTime === "string"
  ) {
    const eventDateObj = new Date(eventDate);

    await checkTimeConflictForUpdate(
      eventID,
      location,
      eventDate,
      startTime,
      endTime
    );
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid payload format. Ensure eventDate, startTime, and endTime are strings."
    );
  }

  const updateEventData = await prisma.event.update({
    where: {
      eventID,
    },
    data: payload,
  });

  return updateEventData;
};

const deleteEventByID = async (eventID: number) => {
  // Validate event existence
  await validateEventExists(eventID);

  return await prisma.$transaction(async (prisma) => {
    // First, delete all participants associated with the event
    await prisma.participantOnEvent.deleteMany({
      where: {
        eventID,
      },
    });

    // Then, delete the event itself
    const deletedEvent = await prisma.event.delete({
      where: {
        eventID,
      },
    });

    return deletedEvent;
  });
};

const addParticipantOnEvent = async (payload: any, eventID: number) => {
  const { participantID: participantIDs } = payload;

  /// Validate event existence
  await validateEventExists(eventID);

  // Validate each participant ID
  for (let id of participantIDs) {
    const participant = await prisma.participant.findUnique({
      where: {
        participantID: parseInt(id),
      },
    });

    if (!participant) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Participant ID ${id} not found! Try again with a valid participant ID.`
      );
    }
  }

  // Add all participants to the event
  const addedParticipants = await prisma.$transaction(
    participantIDs.map((id: string) =>
      prisma.participantOnEvent.create({
        data: {
          participantID: parseInt(id),
          eventID,
        },
      })
    )
  );

  return addedParticipants;
};

const removeParticipantFromEvent = async (
  eventID: number,
  participantID: number
) => {
  // Validate event existence
  await validateEventExists(eventID);

  // check if the given participantId is valid or not
  const participant = await prisma.participant.findUnique({
    where: {
      participantID,
    },
  });

  if (!participant) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Participant ID ${participantID} not found! Try again with valid participant ID.`
    );
  }

  const removeParticipant = await prisma.participantOnEvent.deleteMany({
    where: {
      participantID,
      eventID,
    },
  });

  return removeParticipant;
};

export const EventServices = {
  addeventIntoDB,
  getAllEventsFromDB,
  getSpecificEventFromDB,
  updateEventIntoDB,
  deleteEventByID,
  addParticipantOnEvent,
  removeParticipantFromEvent,
};

import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";

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
            lte: endTime,
          },
          endTime: {
            gte: startTime,
          },
        },
      ],
    },
  });

  if (conflictingEvents.length > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Time conflict detected! Another event is already scheduled at ${location} from ${conflictingEvents[0].startTime} to ${conflictingEvents[0].endTime}.`
    );
  }
};

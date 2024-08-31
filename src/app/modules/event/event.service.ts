import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";

const addeventIntoDB = async (payload: any) => {
  const createdPostData = await prisma.event.create({
    data: payload,
  });

  return createdPostData;
};

const getAllEventsFromDB = async (options: IPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const events = await prisma.event.findMany({
    // include: {},
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
  const total = events.length; // Total events before pagination

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

export const EventServices = {
  addeventIntoDB,
  getAllEventsFromDB,
};

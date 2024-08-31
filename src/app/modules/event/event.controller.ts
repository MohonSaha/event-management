import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EventServices } from "./event.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";

const addEvent = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);

  const result = await EventServices.addeventIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New event added successfully!",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await EventServices.getAllEventsFromDB(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events list retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const EventControllers = {
  addEvent,
  getAllEvents,
};

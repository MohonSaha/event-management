import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EventServices } from "./event.service";
import { Request, Response } from "express";
import pick from "../../../shared/pick";

const addEvent = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);

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

const getSpecificEventByID = catchAsync(async (req: Request, res: Response) => {
  const eventID = parseInt(req.params.id);
  const result = await EventServices.getSpecificEventFromDB(eventID);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single event details retrieved successfully!",
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const eventID = parseInt(req.params.id);
  const payload = req.body;
  const result = await EventServices.updateEventIntoDB(eventID, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully!",
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const eventID = parseInt(req.params.id);
  const result = await EventServices.deleteEventByID(eventID);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Event deleted successfully!",
    data: null,
  });
});

const addParticipant = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const eventID = parseInt(req.params.id);

  const result = await EventServices.addParticipantOnEvent(req.body, eventID);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Participant added successfully!",
    data: result,
  });
});

const removeParticipant = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const eventID = parseInt(req.params.id);
  const participantID = parseInt(req.params.participantId);

  const result = await EventServices.removeParticipantFromEvent(
    eventID,
    participantID
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Participant removed successfully from the event!",
    data: result,
  });
});

export const EventControllers = {
  addEvent,
  getAllEvents,
  getSpecificEventByID,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
};
